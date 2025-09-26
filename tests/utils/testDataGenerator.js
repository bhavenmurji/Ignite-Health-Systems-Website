/**
 * Test Data Generator for Mailchimp Automation Testing
 * Generates realistic test data for different user scenarios
 */

const faker = require('faker');

class TestDataGenerator {
  constructor() {
    // Medical specialties for physician testing
    this.medicalSpecialties = [
      'Family Medicine',
      'Internal Medicine',
      'Emergency Medicine',
      'Cardiology',
      'Dermatology',
      'Neurology',
      'Oncology',
      'Pediatrics',
      'Psychiatry',
      'Radiology',
      'Surgery',
      'Anesthesiology',
      'Pathology',
      'Orthopedics',
      'Ophthalmology'
    ];

    // Practice models
    this.practiceModels = [
      'independent',
      'hospital-employed',
      'group-practice',
      'academic',
      'telehealth',
      'concierge'
    ];

    // EMR systems
    this.emrSystems = [
      'Epic',
      'Cerner',
      'Allscripts',
      'athenahealth',
      'eClinicalWorks',
      'NextGen',
      'Meditech',
      'Greenway',
      'AmazingCharts',
      'DrChrono'
    ];

    // Common physician challenges
    this.physicianChallenges = [
      'Spending 4+ hours daily on documentation instead of patient care',
      'EMR system is slow and inefficient, hurts productivity',
      'Burnout from administrative tasks taking away from medicine',
      'Need better AI tools to assist with clinical decision making',
      'Struggling with work-life balance due to documentation burden',
      'Want to focus on patients, not clicking boxes in EMR',
      'Looking for technology that truly enhances medical practice',
      'Tired of systems that make medicine harder, not easier'
    ];

    // Investor/specialist challenges
    this.businessChallenges = [
      'Looking for healthcare disruption opportunities with strong ROI',
      'Seeking innovative healthcare technology investments',
      'Want to invest in solutions that improve patient outcomes',
      'Building AI solutions that enhance physician capabilities',
      'Developing technology to reduce healthcare administrative burden',
      'Creating tools that improve healthcare efficiency and quality',
      'Working on healthcare automation and workflow optimization',
      'Designing systems that put patients and providers first'
    ];

    // User type probabilities for realistic distribution
    this.userTypeDistribution = {
      physician: 0.6,    // 60% physicians
      investor: 0.25,    // 25% investors
      specialist: 0.15   // 15% specialists
    };
  }

  // Generate a single contact based on user type
  generateContact(userType = null, options = {}) {
    // Auto-select user type based on distribution if not specified
    if (!userType) {
      const rand = Math.random();
      if (rand < 0.6) userType = 'physician';
      else if (rand < 0.85) userType = 'investor';
      else userType = 'specialist';
    }

    const baseContact = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: this.generateUniqueEmail(options.emailPrefix),
      userType: userType,
      timestamp: new Date().toISOString(),
      source: 'ignite-health-systems-website',
      formType: 'interest-form',
      userAgent: 'Mozilla/5.0 (Test Agent)',
      url: 'https://ignitehealthsystems.com/test'
    };

    // Add type-specific fields
    switch (userType) {
      case 'physician':
        return {
          ...baseContact,
          specialty: faker.random.arrayElement(this.medicalSpecialties),
          practiceModel: faker.random.arrayElement(this.practiceModels),
          emrSystem: faker.random.arrayElement(this.emrSystems),
          challenge: faker.random.arrayElement(this.physicianChallenges),
          cofounder: faker.random.boolean() && Math.random() < 0.1, // 10% interested in co-founding
          linkedin: Math.random() < 0.7 ? this.generateLinkedInURL(baseContact.firstName, baseContact.lastName) : ''
        };

      case 'investor':
        return {
          ...baseContact,
          specialty: '',
          practiceModel: '',
          emrSystem: '',
          challenge: faker.random.arrayElement(this.businessChallenges),
          cofounder: faker.random.boolean() && Math.random() < 0.05, // 5% interested in co-founding
          linkedin: this.generateLinkedInURL(baseContact.firstName, baseContact.lastName)
        };

      case 'specialist':
        return {
          ...baseContact,
          specialty: 'Health Tech AI',
          practiceModel: '',
          emrSystem: '',
          challenge: faker.random.arrayElement(this.businessChallenges),
          cofounder: faker.random.boolean() && Math.random() < 0.15, // 15% interested in co-founding
          linkedin: this.generateLinkedInURL(baseContact.firstName, baseContact.lastName)
        };

      default:
        return baseContact;
    }
  }

  // Generate batch of contacts
  generateContactBatch(count = 10, userTypeDistribution = null) {
    const contacts = [];
    const distribution = userTypeDistribution || this.userTypeDistribution;

    for (let i = 0; i < count; i++) {
      let userType = null;

      // Apply distribution
      const rand = Math.random();
      let cumulative = 0;
      for (const [type, probability] of Object.entries(distribution)) {
        cumulative += probability;
        if (rand <= cumulative) {
          userType = type;
          break;
        }
      }

      contacts.push(this.generateContact(userType, { emailPrefix: `batch-${i}` }));
    }

    return contacts;
  }

  // Generate specific scenario contacts
  generateScenarioContacts() {
    return {
      // High-value physician (co-founder interest)
      highValuePhysician: this.generateContact('physician', {
        overrides: {
          specialty: 'Emergency Medicine',
          practiceModel: 'independent',
          emrSystem: 'Epic',
          challenge: 'Want to revolutionize healthcare technology and join as co-founder',
          cofounder: true,
          emailPrefix: 'high-value-physician'
        }
      }),

      // Standard physician
      standardPhysician: this.generateContact('physician', {
        overrides: {
          specialty: 'Family Medicine',
          practiceModel: 'group-practice',
          emrSystem: 'Cerner',
          challenge: 'Spending 4+ hours daily on documentation instead of patient care',
          cofounder: false,
          emailPrefix: 'standard-physician'
        }
      }),

      // Angel investor
      angelInvestor: this.generateContact('investor', {
        overrides: {
          challenge: 'Looking for healthcare disruption opportunities with strong ROI',
          cofounder: false,
          emailPrefix: 'angel-investor'
        }
      }),

      // Tech specialist
      techSpecialist: this.generateContact('specialist', {
        overrides: {
          specialty: 'Health Tech AI',
          challenge: 'Building AI solutions that enhance physician capabilities',
          cofounder: true,
          emailPrefix: 'tech-specialist'
        }
      }),

      // Edge cases
      minimalData: {
        firstName: 'Min',
        lastName: 'Test',
        email: 'minimal-test@example.com',
        userType: 'physician'
      },

      invalidEmail: {
        firstName: 'Invalid',
        lastName: 'Email',
        email: 'not-an-email',
        userType: 'physician'
      },

      longStrings: {
        firstName: 'A'.repeat(100),
        lastName: 'B'.repeat(100),
        email: 'long-string-test@example.com',
        userType: 'physician',
        challenge: 'C'.repeat(500)
      }
    };
  }

  // Generate performance test data
  generatePerformanceTestData(contactCount = 1000) {
    const batches = [];
    const batchSize = 100;

    for (let i = 0; i < contactCount; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, contactCount - i);
      batches.push(this.generateContactBatch(currentBatchSize, {
        physician: 0.7,
        investor: 0.2,
        specialist: 0.1
      }));
    }

    return {
      totalContacts: contactCount,
      batches: batches,
      batchCount: batches.length,
      averageBatchSize: contactCount / batches.length
    };
  }

  // Generate webhook test payloads
  generateWebhookPayloads() {
    const scenarios = this.generateScenarioContacts();
    const payloads = {};

    for (const [scenarioName, contact] of Object.entries(scenarios)) {
      payloads[scenarioName] = this.contactToWebhookPayload(contact);
    }

    return payloads;
  }

  // Convert contact to webhook payload format
  contactToWebhookPayload(contact) {
    return {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      userType: contact.userType,
      specialty: contact.specialty || '',
      practiceModel: contact.practiceModel || '',
      emrSystem: contact.emrSystem || '',
      challenge: contact.challenge || '',
      cofounder: contact.cofounder || false,
      linkedin: contact.linkedin || '',
      timestamp: contact.timestamp || new Date().toISOString(),
      source: contact.source || 'test',
      formType: contact.formType || 'interest-form'
    };
  }

  // Helper methods
  generateUniqueEmail(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    const domain = faker.random.arrayElement(['example.com', 'test.org', 'demo.net']);

    if (prefix) {
      return `${prefix}-${timestamp}-${random}@${domain}`;
    }

    return `test-${timestamp}-${random}@${domain}`;
  }

  generateLinkedInURL(firstName, lastName) {
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
    return `https://linkedin.com/in/${cleanFirst}-${cleanLast}-${Math.random().toString(36).substr(2, 3)}`;
  }

  // Validation test cases
  generateValidationTestCases() {
    return {
      valid: {
        completePhysician: this.generateContact('physician'),
        completeInvestor: this.generateContact('investor'),
        completeSpecialist: this.generateContact('specialist')
      },
      invalid: {
        missingEmail: { ...this.generateContact('physician'), email: '' },
        missingFirstName: { ...this.generateContact('physician'), firstName: '' },
        missingUserType: { ...this.generateContact('physician'), userType: '' },
        invalidEmailFormat: { ...this.generateContact('physician'), email: 'not-an-email' },
        physicianMissingSpecialty: { ...this.generateContact('physician'), specialty: '' },
        investorMissingLinkedIn: { ...this.generateContact('investor'), linkedin: '' }
      }
    };
  }
}

// Export singleton instance
const testDataGenerator = new TestDataGenerator();

module.exports = {
  TestDataGenerator,
  testDataGenerator
};