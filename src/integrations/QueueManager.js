/**
 * Queue Management for Bulk Operations
 * Handles queuing, rate limiting, and batch processing of Mailchimp operations
 */

import { EventEmitter } from 'events';

class QueueManager extends EventEmitter {
  constructor(config = {}) {
    super();

    // Configuration
    this.config = {
      maxConcurrency: config.maxConcurrency || 3,
      rateLimitPerSecond: config.rateLimitPerSecond || 10,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      batchSize: config.batchSize || 500,
      queueTimeout: config.queueTimeout || 300000, // 5 minutes
      ...config
    };

    // Queue state
    this.queues = new Map();
    this.activeJobs = new Map();
    this.rateLimitTokens = this.config.rateLimitPerSecond;
    this.lastTokenRefill = Date.now();

    // Metrics
    this.metrics = {
      totalJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      averageProcessingTime: 0,
      queueSizes: {},
      rateLimitHits: 0
    };

    // Start rate limit token refill
    this.startTokenRefill();

    // Start queue processor
    this.startQueueProcessor();
  }

  /**
   * Add job to queue
   */
  async addJob(queueName, jobData, options = {}) {
    try {
      const job = {
        id: this.generateJobId(),
        queueName,
        data: jobData,
        priority: options.priority || 'normal',
        retryCount: 0,
        maxRetries: options.maxRetries || this.config.retryAttempts,
        delay: options.delay || 0,
        timeout: options.timeout || this.config.queueTimeout,
        addedAt: Date.now(),
        ...options
      };

      // Get or create queue
      if (!this.queues.has(queueName)) {
        this.queues.set(queueName, {
          jobs: [],
          processing: false,
          concurrency: options.concurrency || this.config.maxConcurrency,
          rateLimit: options.rateLimit || this.config.rateLimitPerSecond
        });
      }

      const queue = this.queues.get(queueName);

      // Add job to queue based on priority
      if (job.priority === 'high') {
        queue.jobs.unshift(job);
      } else {
        queue.jobs.push(job);
      }

      this.metrics.totalJobs++;
      this.updateQueueMetrics();

      this.emit('job.added', { queueName, jobId: job.id, priority: job.priority });

      return job.id;

    } catch (error) {
      this.emit('job.error', { queueName, error: error.message });
      throw new Error(`Failed to add job to queue: ${error.message}`);
    }
  }

  /**
   * Add bulk operation job
   */
  async addBulkJob(queueName, operation, items, options = {}) {
    const batchSize = options.batchSize || this.config.batchSize;
    const jobIds = [];

    // Split items into batches
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      const jobData = {
        operation,
        batch,
        batchIndex: Math.floor(i / batchSize),
        totalBatches: Math.ceil(items.length / batchSize),
        originalItemCount: items.length
      };

      const jobId = await this.addJob(queueName, jobData, {
        ...options,
        priority: 'normal',
        type: 'bulk'
      });

      jobIds.push(jobId);
    }

    this.emit('bulk.job.added', {
      queueName,
      operation,
      totalItems: items.length,
      batches: jobIds.length,
      jobIds
    });

    return jobIds;
  }

  /**
   * Process queue jobs
   */
  async processQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue || queue.processing || queue.jobs.length === 0) {
      return;
    }

    queue.processing = true;
    const activeJobsForQueue = [];

    try {
      while (queue.jobs.length > 0 && activeJobsForQueue.length < queue.concurrency) {
        // Check rate limiting
        if (!this.canProcessJob()) {
          await this.waitForRateLimit();
          continue;
        }

        const job = queue.jobs.shift();
        if (!job) break;

        // Check if job has expired
        if (this.isJobExpired(job)) {
          this.handleJobTimeout(job);
          continue;
        }

        // Add delay if specified
        if (job.delay > 0) {
          setTimeout(() => this.executeJob(job), job.delay);
        } else {
          activeJobsForQueue.push(this.executeJob(job));
        }

        this.consumeRateLimit();
      }

      // Wait for all active jobs to complete
      if (activeJobsForQueue.length > 0) {
        await Promise.allSettled(activeJobsForQueue);
      }

    } finally {
      queue.processing = false;

      // Continue processing if there are more jobs
      if (queue.jobs.length > 0) {
        setImmediate(() => this.processQueue(queueName));
      }
    }
  }

  /**
   * Execute individual job
   */
  async executeJob(job) {
    const startTime = Date.now();

    try {
      this.activeJobs.set(job.id, job);

      this.emit('job.started', {
        queueName: job.queueName,
        jobId: job.id,
        attempt: job.retryCount + 1
      });

      // Execute the job based on its type
      let result;
      switch (job.data.operation) {
        case 'addMembers':
          result = await this.processAddMembers(job);
          break;
        case 'updateMembers':
          result = await this.processUpdateMembers(job);
          break;
        case 'sendCampaign':
          result = await this.processSendCampaign(job);
          break;
        case 'addTags':
          result = await this.processAddTags(job);
          break;
        case 'updateMemberFields':
          result = await this.processUpdateMemberFields(job);
          break;
        default:
          if (job.processor && typeof job.processor === 'function') {
            result = await job.processor(job.data);
          } else {
            throw new Error(`Unknown operation: ${job.data.operation}`);
          }
      }

      // Job completed successfully
      this.handleJobSuccess(job, result, Date.now() - startTime);

    } catch (error) {
      this.handleJobError(job, error, Date.now() - startTime);
    } finally {
      this.activeJobs.delete(job.id);
    }
  }

  /**
   * Handle job success
   */
  handleJobSuccess(job, result, processingTime) {
    this.metrics.completedJobs++;
    this.updateAverageProcessingTime(processingTime);

    this.emit('job.completed', {
      queueName: job.queueName,
      jobId: job.id,
      result,
      processingTime,
      attempts: job.retryCount + 1
    });

    // Check if this was part of a bulk operation
    if (job.type === 'bulk') {
      this.checkBulkOperationComplete(job);
    }
  }

  /**
   * Handle job error
   */
  async handleJobError(job, error, processingTime) {
    job.retryCount++;
    job.lastError = error.message;
    job.lastAttemptTime = Date.now();

    this.emit('job.failed', {
      queueName: job.queueName,
      jobId: job.id,
      error: error.message,
      attempt: job.retryCount,
      maxRetries: job.maxRetries
    });

    // Retry if under limit
    if (job.retryCount < job.maxRetries) {
      const retryDelay = this.calculateRetryDelay(job.retryCount);

      this.emit('job.retry', {
        queueName: job.queueName,
        jobId: job.id,
        retryDelay,
        attempt: job.retryCount + 1
      });

      // Add back to queue with delay
      setTimeout(() => {
        const queue = this.queues.get(job.queueName);
        if (queue) {
          queue.jobs.unshift(job); // Add to front for priority
        }
      }, retryDelay);

    } else {
      // Max retries exceeded
      this.metrics.failedJobs++;

      this.emit('job.exhausted', {
        queueName: job.queueName,
        jobId: job.id,
        finalError: error.message,
        totalAttempts: job.retryCount
      });
    }
  }

  /**
   * Handle job timeout
   */
  handleJobTimeout(job) {
    this.metrics.failedJobs++;

    this.emit('job.timeout', {
      queueName: job.queueName,
      jobId: job.id,
      addedAt: job.addedAt,
      timeout: job.timeout
    });
  }

  /**
   * Process add members operation
   */
  async processAddMembers(job) {
    const { batch, listId, mailchimpClient } = job.data;

    if (!mailchimpClient) {
      throw new Error('Mailchimp client not provided');
    }

    const results = await mailchimpClient.batchAddMembers(listId, batch);

    this.emit('members.added', {
      listId,
      batchSize: batch.length,
      results
    });

    return results;
  }

  /**
   * Process update members operation
   */
  async processUpdateMembers(job) {
    const { batch, listId, updateData, mailchimpClient } = job.data;

    const results = [];
    for (const member of batch) {
      try {
        const result = await mailchimpClient.updateMember(listId, member.email, updateData);
        results.push({ email: member.email, success: true, result });
      } catch (error) {
        results.push({ email: member.email, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Process send campaign operation
   */
  async processSendCampaign(job) {
    const { campaignData, mailchimpClient } = job.data;

    const campaign = await mailchimpClient.createCampaign(campaignData);
    const result = await mailchimpClient.sendCampaign(campaign.id);

    this.emit('campaign.sent', {
      campaignId: campaign.id,
      recipients: campaignData.recipients
    });

    return { campaign, result };
  }

  /**
   * Process add tags operation
   */
  async processAddTags(job) {
    const { batch, listId, tags, mailchimpClient } = job.data;

    const results = [];
    for (const member of batch) {
      try {
        const result = await mailchimpClient.addTags(listId, member.email, tags);
        results.push({ email: member.email, success: true, result });
      } catch (error) {
        results.push({ email: member.email, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Process update member fields operation
   */
  async processUpdateMemberFields(job) {
    const { batch, listId, fieldUpdates, mailchimpClient } = job.data;

    const results = [];
    for (const member of batch) {
      try {
        const mergeFields = { ...fieldUpdates, ...member.customFields };
        const result = await mailchimpClient.updateMember(listId, member.email, { mergeFields });
        results.push({ email: member.email, success: true, result });
      } catch (error) {
        results.push({ email: member.email, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Rate limiting methods
   */
  canProcessJob() {
    this.refillTokens();
    return this.rateLimitTokens > 0;
  }

  consumeRateLimit() {
    this.rateLimitTokens = Math.max(0, this.rateLimitTokens - 1);
  }

  async waitForRateLimit() {
    const waitTime = Math.ceil(1000 / this.config.rateLimitPerSecond);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    this.metrics.rateLimitHits++;
  }

  refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastTokenRefill;
    const tokensToAdd = Math.floor(timePassed / 1000) * this.config.rateLimitPerSecond;

    if (tokensToAdd > 0) {
      this.rateLimitTokens = Math.min(
        this.config.rateLimitPerSecond,
        this.rateLimitTokens + tokensToAdd
      );
      this.lastTokenRefill = now;
    }
  }

  startTokenRefill() {
    setInterval(() => {
      this.refillTokens();
    }, 1000);
  }

  /**
   * Queue processor
   */
  startQueueProcessor() {
    setInterval(() => {
      for (const queueName of this.queues.keys()) {
        this.processQueue(queueName);
      }
    }, 100); // Check every 100ms
  }

  /**
   * Utility methods
   */
  generateJobId() {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isJobExpired(job) {
    return Date.now() - job.addedAt > job.timeout;
  }

  calculateRetryDelay(retryCount) {
    return this.config.retryDelay * Math.pow(2, retryCount - 1); // Exponential backoff
  }

  updateAverageProcessingTime(processingTime) {
    const totalCompleted = this.metrics.completedJobs;
    this.metrics.averageProcessingTime =
      ((this.metrics.averageProcessingTime * (totalCompleted - 1)) + processingTime) / totalCompleted;
  }

  updateQueueMetrics() {
    this.metrics.queueSizes = {};
    for (const [queueName, queue] of this.queues) {
      this.metrics.queueSizes[queueName] = queue.jobs.length;
    }
  }

  checkBulkOperationComplete(job) {
    const { operation, totalBatches, batchIndex } = job.data;

    // This is a simplified check - in a production system, you'd want more sophisticated tracking
    this.emit('bulk.batch.completed', {
      operation,
      batchIndex,
      totalBatches,
      progress: Math.round(((batchIndex + 1) / totalBatches) * 100)
    });

    if (batchIndex + 1 === totalBatches) {
      this.emit('bulk.operation.completed', { operation, totalBatches });
    }
  }

  /**
   * Queue management methods
   */
  async pauseQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (queue) {
      queue.processing = false;
      this.emit('queue.paused', { queueName });
    }
  }

  async resumeQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (queue) {
      queue.processing = false; // Will be set to true when processing starts
      this.processQueue(queueName);
      this.emit('queue.resumed', { queueName });
    }
  }

  async clearQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (queue) {
      const clearedJobs = queue.jobs.length;
      queue.jobs = [];
      this.emit('queue.cleared', { queueName, clearedJobs });
    }
  }

  getQueueStatus(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      return null;
    }

    return {
      queueName,
      pending: queue.jobs.length,
      processing: queue.processing,
      concurrency: queue.concurrency,
      rateLimit: queue.rateLimit
    };
  }

  getAllQueueStatuses() {
    const statuses = {};
    for (const queueName of this.queues.keys()) {
      statuses[queueName] = this.getQueueStatus(queueName);
    }
    return statuses;
  }

  getMetrics() {
    this.updateQueueMetrics();
    return {
      ...this.metrics,
      activeJobs: this.activeJobs.size,
      totalQueues: this.queues.size,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Cleanup method
   */
  destroy() {
    // Clear all intervals and cleanup
    for (const queue of this.queues.values()) {
      queue.jobs = [];
      queue.processing = false;
    }

    this.activeJobs.clear();
    this.queues.clear();
    this.removeAllListeners();

    this.emit('queue.destroyed');
  }
}

export default QueueManager;