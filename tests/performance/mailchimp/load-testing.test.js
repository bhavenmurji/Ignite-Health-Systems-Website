/**
 * Performance and Load Testing for Mailchimp Workflows
 * Tests system performance under various load conditions
 */

const { testDataGenerator } = require('../../utils/testDataGenerator');
const { mockMailchimpAPI } = require('../../mocks/mailchimp/mockMailchimpAPI');
const { WebhookSimulator, WebhookClient } = require('../../utils/webhookSimulator');

describe('Mailchimp Workflow Performance Tests', () => {
  let webhookSimulator;
  let webhookClient;

  beforeAll(async () => {
    webhookSimulator = new WebhookSimulator({ port: 3002 });
    await webhookSimulator.start();

    webhookClient = new WebhookClient('http://localhost:3002');

    // Configure standard webhook responses
    webhookSimulator.simulateN8nWebhook();
    webhookSimulator.simulateMailchimpWebhook();
  });

  afterAll(async () => {
    if (webhookSimulator) {
      await webhookSimulator.stop();
    }
  });

  beforeEach(() => {
    mockMailchimpAPI.reset();
    webhookSimulator.clearRequests();
  });

  describe('Load Testing', () => {
    test('should handle 100 concurrent form submissions', async () => {
      const contactCount = 100;
      const contacts = testDataGenerator.generateContactBatch(contactCount);

      const startTime = Date.now();

      // Submit all contacts concurrently
      const promises = contacts.map(async (contact, index) => {
        const webhookData = testDataGenerator.contactToWebhookPayload(contact);

        try {
          const response = await webhookClient.post('/webhook/n8n/interest-form', webhookData);

          // Simulate Mailchimp API processing
          mockMailchimpAPI.addSubscriber(contact.email, {
            merge_fields: {
              FNAME: contact.firstName,
              LNAME: contact.lastName,
              USERTYPE: contact.userType,
              SPECIALTY: contact.specialty || '',
              CHALLENGE: contact.challenge || ''
            }
          });

          return {
            index,
            success: true,
            responseTime: Date.now() - startTime,
            status: response.status
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: error.message,
            responseTime: Date.now() - startTime
          };
        }
      });

      const results = await Promise.allSettled(promises);
      const endTime = Date.now();

      // Analyze results
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
      const failed = results.filter(r => r.status === 'rejected' || !r.value.success);

      const totalTime = endTime - startTime;
      const avgResponseTime = successful.length > 0 ?
        successful.reduce((sum, r) => sum + r.value.responseTime, 0) / successful.length : 0;

      console.log(`Load Test Results:
        - Total contacts: ${contactCount}
        - Successful: ${successful.length}
        - Failed: ${failed.length}
        - Total time: ${totalTime}ms
        - Average response time: ${avgResponseTime.toFixed(2)}ms
        - Requests per second: ${(contactCount / (totalTime / 1000)).toFixed(2)}`);

      // Performance assertions
      expect(successful.length).toBeGreaterThan(contactCount * 0.95); // At least 95% success rate
      expect(totalTime).toBeLessThan(30000); // Complete within 30 seconds
      expect(avgResponseTime).toBeLessThan(5000); // Average response under 5 seconds

      // Verify data integrity
      const addedSubscribers = mockMailchimpAPI.getAllSubscribers();
      expect(addedSubscribers.length).toBe(successful.length);
    }, 60000); // 60 second timeout

    test('should handle sustained load over time', async () => {
      const batchSize = 20;
      const batchCount = 5;
      const batchInterval = 2000; // 2 seconds between batches

      const results = [];
      let totalProcessed = 0;

      for (let batch = 0; batch < batchCount; batch++) {
        console.log(`Processing batch ${batch + 1}/${batchCount}`);

        const contacts = testDataGenerator.generateContactBatch(batchSize);
        const batchStartTime = Date.now();

        const batchPromises = contacts.map(async (contact) => {
          const webhookData = testDataGenerator.contactToWebhookPayload(contact);

          try {
            const response = await webhookClient.post('/webhook/n8n/interest-form', webhookData);

            mockMailchimpAPI.addSubscriber(contact.email, {
              merge_fields: {
                FNAME: contact.firstName,
                LNAME: contact.lastName,
                USERTYPE: contact.userType
              }
            });

            return { success: true, responseTime: Date.now() - batchStartTime };
          } catch (error) {
            return { success: false, error: error.message };
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        const batchSuccessful = batchResults.filter(r =>
          r.status === 'fulfilled' && r.value.success
        ).length;

        totalProcessed += batchSuccessful;

        results.push({
          batch: batch + 1,
          processed: batchSuccessful,
          total: batchSize,
          successRate: batchSuccessful / batchSize,
          time: Date.now() - batchStartTime
        });

        // Wait before next batch (except for last batch)
        if (batch < batchCount - 1) {
          await new Promise(resolve => setTimeout(resolve, batchInterval));
        }
      }

      // Analyze sustained load results
      const totalExpected = batchSize * batchCount;
      const overallSuccessRate = totalProcessed / totalExpected;
      const avgBatchTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;

      console.log(`Sustained Load Results:
        - Total expected: ${totalExpected}
        - Total processed: ${totalProcessed}
        - Overall success rate: ${(overallSuccessRate * 100).toFixed(1)}%
        - Average batch time: ${avgBatchTime.toFixed(2)}ms`);

      // Performance assertions
      expect(overallSuccessRate).toBeGreaterThan(0.9); // 90% success rate
      expect(avgBatchTime).toBeLessThan(10000); // Average batch under 10 seconds

      // Check for performance degradation
      const firstBatchTime = results[0].time;
      const lastBatchTime = results[results.length - 1].time;
      const degradation = (lastBatchTime - firstBatchTime) / firstBatchTime;

      expect(degradation).toBeLessThan(2.0); // No more than 100% degradation
    }, 90000); // 90 second timeout

    test('should handle memory efficiently under load', async () => {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const initialMemory = process.memoryUsage();
      const contactCount = 200;

      // Process contacts in batches to simulate real usage
      const batchSize = 50;
      const batches = Math.ceil(contactCount / batchSize);

      for (let i = 0; i < batches; i++) {
        const batchContacts = testDataGenerator.generateContactBatch(batchSize);

        await Promise.all(batchContacts.map(async (contact) => {
          const webhookData = testDataGenerator.contactToWebhookPayload(contact);

          try {
            await webhookClient.post('/webhook/n8n/interest-form', webhookData);
            mockMailchimpAPI.addSubscriber(contact.email, {
              merge_fields: {
                FNAME: contact.firstName,
                LNAME: contact.lastName,
                USERTYPE: contact.userType
              }
            });
          } catch (error) {
            // Continue on error for memory test
          }
        }));

        // Force garbage collection after each batch
        if (global.gc) {
          global.gc();
        }
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryIncreasePerContact = memoryIncrease / contactCount;

      console.log(`Memory Usage:
        - Initial: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB
        - Final: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)} MB
        - Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB
        - Per contact: ${(memoryIncreasePerContact / 1024).toFixed(2)} KB`);

      // Memory assertions
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // Less than 100MB increase
      expect(memoryIncreasePerContact).toBeLessThan(50 * 1024); // Less than 50KB per contact
    }, 60000);
  });

  describe('Stress Testing', () => {
    test('should handle rapid burst requests', async () => {
      const burstSize = 50;
      const contact = testDataGenerator.generateContact('physician');
      const webhookData = testDataGenerator.contactToWebhookPayload(contact);

      // Send burst of identical requests
      const startTime = Date.now();
      const promises = Array(burstSize).fill(null).map(async (_, index) => {
        try {
          const response = await webhookClient.post('/webhook/n8n/interest-form', {
            ...webhookData,
            email: `burst-${index}-${contact.email}` // Unique emails
          });
          return { success: true, status: response.status };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });

      const results = await Promise.allSettled(promises);
      const endTime = Date.now();

      const successful = results.filter(r =>
        r.status === 'fulfilled' && r.value.success
      ).length;

      const burstTime = endTime - startTime;
      const requestsPerSecond = burstSize / (burstTime / 1000);

      console.log(`Burst Test Results:
        - Burst size: ${burstSize}
        - Successful: ${successful}
        - Burst time: ${burstTime}ms
        - Requests per second: ${requestsPerSecond.toFixed(2)}`);

      // Should handle at least 80% of burst requests
      expect(successful).toBeGreaterThan(burstSize * 0.8);
      expect(burstTime).toBeLessThan(15000); // Complete within 15 seconds
    });

    test('should handle mixed user type load distribution', async () => {
      const totalContacts = 150;

      // Generate realistic distribution
      const physicians = testDataGenerator.generateContactBatch(90, { physician: 1 }); // 60%
      const investors = testDataGenerator.generateContactBatch(38, { investor: 1 }); // 25%
      const specialists = testDataGenerator.generateContactBatch(22, { specialist: 1 }); // 15%

      const allContacts = [...physicians, ...investors, ...specialists];

      // Shuffle for realistic submission order
      for (let i = allContacts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allContacts[i], allContacts[j]] = [allContacts[j], allContacts[i]];
      }

      const startTime = Date.now();

      const results = await Promise.allSettled(
        allContacts.map(async (contact) => {
          const webhookData = testDataGenerator.contactToWebhookPayload(contact);

          try {
            const response = await webhookClient.post('/webhook/n8n/interest-form', webhookData);

            mockMailchimpAPI.addSubscriber(contact.email, {
              merge_fields: {
                FNAME: contact.firstName,
                LNAME: contact.lastName,
                USERTYPE: contact.userType,
                SPECIALTY: contact.specialty || '',
                PRACTICE: contact.practiceModel || '',
                CHALLENGE: contact.challenge || ''
              }
            });

            return {
              success: true,
              userType: contact.userType,
              responseTime: Date.now() - startTime
            };
          } catch (error) {
            return {
              success: false,
              userType: contact.userType,
              error: error.message
            };
          }
        })
      );

      const endTime = Date.now();

      // Analyze by user type
      const byUserType = {
        physician: { total: 0, successful: 0 },
        investor: { total: 0, successful: 0 },
        specialist: { total: 0, successful: 0 }
      };

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const userType = result.value.userType;
          byUserType[userType].total++;
          if (result.value.success) {
            byUserType[userType].successful++;
          }
        }
      });

      // Verify segmentation worked correctly
      const physicianSubscribers = mockMailchimpAPI.getSubscribersByUserType('physician');
      const investorSubscribers = mockMailchimpAPI.getSubscribersByUserType('investor');
      const specialistSubscribers = mockMailchimpAPI.getSubscribersByUserType('specialist');

      console.log(`Mixed Load Results:
        - Physicians: ${physicianSubscribers.length}/${byUserType.physician.total}
        - Investors: ${investorSubscribers.length}/${byUserType.investor.total}
        - Specialists: ${specialistSubscribers.length}/${byUserType.specialist.total}
        - Total time: ${endTime - startTime}ms`);

      // Assertions
      expect(physicianSubscribers.length).toBeGreaterThan(80); // Most physicians processed
      expect(investorSubscribers.length).toBeGreaterThan(30); // Most investors processed
      expect(specialistSubscribers.length).toBeGreaterThan(18); // Most specialists processed

      // Verify tagging worked under load
      const taggedPhysicians = mockMailchimpAPI.getSubscribersByTag('physician');
      const taggedInvestors = mockMailchimpAPI.getSubscribersByTag('investor');
      const taggedSpecialists = mockMailchimpAPI.getSubscribersByTag('specialist');

      expect(taggedPhysicians.length).toBe(physicianSubscribers.length);
      expect(taggedInvestors.length).toBe(investorSubscribers.length);
      expect(taggedSpecialists.length).toBe(specialistSubscribers.length);
    }, 60000);
  });

  describe('Performance Benchmarks', () => {
    test('should meet response time benchmarks', async () => {
      const sampleSize = 50;
      const contacts = testDataGenerator.generateContactBatch(sampleSize);
      const responseTimes = [];

      for (const contact of contacts) {
        const webhookData = testDataGenerator.contactToWebhookPayload(contact);
        const startTime = Date.now();

        try {
          await webhookClient.post('/webhook/n8n/interest-form', webhookData);
          mockMailchimpAPI.addSubscriber(contact.email, {
            merge_fields: {
              FNAME: contact.firstName,
              LNAME: contact.lastName,
              USERTYPE: contact.userType
            }
          });

          const responseTime = Date.now() - startTime;
          responseTimes.push(responseTime);
        } catch (error) {
          // Include failed requests in timing for realistic benchmarks
          responseTimes.push(Date.now() - startTime);
        }

        // Small delay between requests for realistic testing
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Calculate statistics
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const minResponseTime = Math.min(...responseTimes);
      const maxResponseTime = Math.max(...responseTimes);

      responseTimes.sort((a, b) => a - b);
      const p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)];
      const p99ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.99)];

      console.log(`Performance Benchmarks:
        - Average: ${avgResponseTime.toFixed(2)}ms
        - Min: ${minResponseTime}ms
        - Max: ${maxResponseTime}ms
        - 95th percentile: ${p95ResponseTime}ms
        - 99th percentile: ${p99ResponseTime}ms`);

      // Benchmark assertions
      expect(avgResponseTime).toBeLessThan(2000); // Average under 2 seconds
      expect(p95ResponseTime).toBeLessThan(5000); // 95% under 5 seconds
      expect(p99ResponseTime).toBeLessThan(10000); // 99% under 10 seconds
    });

    test('should maintain performance under error conditions', async () => {
      // Simulate various error conditions
      webhookSimulator.simulateFailures();

      const contactCount = 100;
      const contacts = testDataGenerator.generateContactBatch(contactCount);
      const results = [];

      for (const contact of contacts) {
        const webhookData = testDataGenerator.contactToWebhookPayload(contact);
        const startTime = Date.now();

        try {
          const response = await webhookClient.post('/webhook/n8n/interest-form', webhookData);

          if (response.status === 200) {
            mockMailchimpAPI.addSubscriber(contact.email, {
              merge_fields: {
                FNAME: contact.firstName,
                LNAME: contact.lastName,
                USERTYPE: contact.userType
              }
            });
          }

          results.push({
            success: response.status === 200,
            responseTime: Date.now() - startTime,
            status: response.status
          });
        } catch (error) {
          results.push({
            success: false,
            responseTime: Date.now() - startTime,
            error: error.message
          });
        }
      }

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      const avgSuccessfulTime = successful.length > 0 ?
        successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length : 0;
      const avgFailedTime = failed.length > 0 ?
        failed.reduce((sum, r) => sum + r.responseTime, 0) / failed.length : 0;

      console.log(`Error Condition Performance:
        - Successful requests: ${successful.length}
        - Failed requests: ${failed.length}
        - Avg successful time: ${avgSuccessfulTime.toFixed(2)}ms
        - Avg failed time: ${avgFailedTime.toFixed(2)}ms`);

      // Even with errors, successful requests should be reasonably fast
      expect(avgSuccessfulTime).toBeLessThan(3000);
      expect(avgFailedTime).toBeLessThan(5000); // Failed requests shouldn't hang too long
    });
  });

  describe('Scalability Testing', () => {
    test('should demonstrate linear scalability', async () => {
      const loadLevels = [10, 25, 50, 75, 100];
      const scalabilityResults = [];

      for (const loadLevel of loadLevels) {
        console.log(`Testing scalability at load level: ${loadLevel}`);

        const contacts = testDataGenerator.generateContactBatch(loadLevel);
        const startTime = Date.now();

        const promises = contacts.map(async (contact) => {
          const webhookData = testDataGenerator.contactToWebhookPayload(contact);

          try {
            const response = await webhookClient.post('/webhook/n8n/interest-form', webhookData);

            if (response.status === 200) {
              mockMailchimpAPI.addSubscriber(contact.email, {
                merge_fields: {
                  FNAME: contact.firstName,
                  LNAME: contact.lastName,
                  USERTYPE: contact.userType
                }
              });
            }

            return { success: response.status === 200 };
          } catch (error) {
            return { success: false };
          }
        });

        const results = await Promise.allSettled(promises);
        const endTime = Date.now();

        const successful = results.filter(r =>
          r.status === 'fulfilled' && r.value.success
        ).length;

        const totalTime = endTime - startTime;
        const throughput = successful / (totalTime / 1000); // requests per second

        scalabilityResults.push({
          loadLevel,
          successful,
          totalTime,
          throughput,
          successRate: successful / loadLevel
        });

        console.log(`Load ${loadLevel}: ${successful}/${loadLevel} successful, ${throughput.toFixed(2)} req/s`);

        // Clear data between tests
        mockMailchimpAPI.reset();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause between tests
      }

      // Analyze scalability
      const throughputs = scalabilityResults.map(r => r.throughput);
      const avgThroughput = throughputs.reduce((a, b) => a + b, 0) / throughputs.length;
      const throughputVariance = throughputs.reduce((sum, t) => sum + Math.pow(t - avgThroughput, 2), 0) / throughputs.length;
      const throughputStdDev = Math.sqrt(throughputVariance);

      console.log(`Scalability Analysis:
        - Average throughput: ${avgThroughput.toFixed(2)} req/s
        - Throughput std dev: ${throughputStdDev.toFixed(2)}
        - Coefficient of variation: ${(throughputStdDev / avgThroughput * 100).toFixed(1)}%`);

      // Scalability assertions
      expect(avgThroughput).toBeGreaterThan(5); // At least 5 requests per second
      expect(throughputStdDev / avgThroughput).toBeLessThan(0.5); // Coefficient of variation < 50%

      // Success rates should remain consistent
      const successRates = scalabilityResults.map(r => r.successRate);
      const minSuccessRate = Math.min(...successRates);
      expect(minSuccessRate).toBeGreaterThan(0.8); // At least 80% success rate at all load levels
    }, 120000); // 2 minute timeout
  });
});

// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requestCount: 0,
      totalResponseTime: 0,
      errorCount: 0,
      startTime: Date.now()
    };
  }

  recordRequest(responseTime, success = true) {
    this.metrics.requestCount++;
    this.metrics.totalResponseTime += responseTime;
    if (!success) {
      this.metrics.errorCount++;
    }
  }

  getStats() {
    const runtime = Date.now() - this.metrics.startTime;
    return {
      totalRequests: this.metrics.requestCount,
      averageResponseTime: this.metrics.requestCount > 0 ?
        this.metrics.totalResponseTime / this.metrics.requestCount : 0,
      requestsPerSecond: this.metrics.requestCount / (runtime / 1000),
      errorRate: this.metrics.requestCount > 0 ?
        this.metrics.errorCount / this.metrics.requestCount : 0,
      runtime
    };
  }

  reset() {
    this.metrics = {
      requestCount: 0,
      totalResponseTime: 0,
      errorCount: 0,
      startTime: Date.now()
    };
  }
}

module.exports = { PerformanceMonitor };