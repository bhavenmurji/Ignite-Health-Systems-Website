/**
 * Segmentation Logic Validation Tests
 * Tests Mailchimp audience segmentation rules and logic
 */

const { mockMailchimpAPI } = require('../../mocks/mailchimp/mockMailchimpAPI');
const { testDataGenerator } = require('../../utils/testDataGenerator');

describe('Mailchimp Segmentation Logic', () => {
  beforeEach(() => {
    mockMailchimpAPI.reset();
  });

  describe('Basic User Type Segmentation', () => {
    test('should create physician segment correctly', () => {
      // Add test physicians
      const physicians = testDataGenerator.generateContactBatch(10, { physician: 1 });

      physicians.forEach(physician => {
        mockMailchimpAPI.addSubscriber(physician.email, {
          merge_fields: {
            FNAME: physician.firstName,
            LNAME: physician.lastName,
            USERTYPE: 'physician',
            SPECIALTY: physician.specialty,
            PRACTICE: physician.practiceModel,
            EMR: physician.emrSystem
          }
        });
      });

      // Create physician segment
      const physicianSegment = mockMailchimpAPI.createSegment({
        name: 'All Physicians',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'physician'
          }]
        }
      });

      expect(physicianSegment.member_count).toBe(10);
      expect(physicianSegment.name).toBe('All Physicians');

      // Verify segment members are correct
      const allSubscribers = mockMailchimpAPI.getAllSubscribers();
      const physicianSubscribers = allSubscribers.filter(s => s.merge_fields.USERTYPE === 'physician');
      expect(physicianSubscribers).toHaveLength(10);
    });

    test('should create investor segment correctly', () => {
      // Add mixed user types
      const physicians = testDataGenerator.generateContactBatch(5, { physician: 1 });
      const investors = testDataGenerator.generateContactBatch(3, { investor: 1 });
      const specialists = testDataGenerator.generateContactBatch(2, { specialist: 1 });

      [...physicians, ...investors, ...specialists].forEach(contact => {
        mockMailchimpAPI.addSubscriber(contact.email, {
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType,
            CHALLENGE: contact.challenge || ''
          }
        });
      });

      // Create investor segment
      const investorSegment = mockMailchimpAPI.createSegment({
        name: 'All Investors',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'investor'
          }]
        }
      });

      expect(investorSegment.member_count).toBe(3);

      // Create specialist segment
      const specialistSegment = mockMailchimpAPI.createSegment({
        name: 'All Specialists',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'specialist'
          }]
        }
      });

      expect(specialistSegment.member_count).toBe(2);
    });
  });

  describe('Co-founder Interest Segmentation', () => {
    test('should segment co-founder interested contacts', () => {
      // Add contacts with varying co-founder interest
      const regularPhysician = testDataGenerator.generateContact('physician', {
        overrides: { cofounder: false }
      });

      const cofounderPhysician = testDataGenerator.generateContact('physician', {
        overrides: { cofounder: true }
      });

      const cofounderInvestor = testDataGenerator.generateContact('investor', {
        overrides: { cofounder: true }
      });

      const regularSpecialist = testDataGenerator.generateContact('specialist', {
        overrides: { cofounder: false }
      });

      [regularPhysician, cofounderPhysician, cofounderInvestor, regularSpecialist].forEach(contact => {
        mockMailchimpAPI.addSubscriber(contact.email, {
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType,
            COFOUNDER: contact.cofounder ? 'Yes' : 'No'
          }
        });
      });

      // Create co-founder interest segment
      const cofounderSegment = mockMailchimpAPI.createSegment({
        name: 'Co-founder Interest',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'COFOUNDER',
            op: 'is',
            value: 'Yes'
          }]
        }
      });

      expect(cofounderSegment.member_count).toBe(2); // physician + investor with co-founder interest

      // Verify correct members in segment
      const allSubscribers = mockMailchimpAPI.getAllSubscribers();
      const cofounderSubscribers = allSubscribers.filter(s => s.merge_fields.COFOUNDER === 'Yes');
      expect(cofounderSubscribers).toHaveLength(2);

      const cofounderEmails = cofounderSubscribers.map(s => s.email_address);
      expect(cofounderEmails).toContain(cofounderPhysician.email.toLowerCase());
      expect(cofounderEmails).toContain(cofounderInvestor.email.toLowerCase());
    });

    test('should create high-priority segment for co-founder physicians', () => {
      // Add various contacts
      const regularPhysician = testDataGenerator.generateContact('physician', { overrides: { cofounder: false } });
      const cofounderPhysician1 = testDataGenerator.generateContact('physician', { overrides: { cofounder: true } });
      const cofounderPhysician2 = testDataGenerator.generateContact('physician', { overrides: { cofounder: true } });
      const cofounderInvestor = testDataGenerator.generateContact('investor', { overrides: { cofounder: true } });

      [regularPhysician, cofounderPhysician1, cofounderPhysician2, cofounderInvestor].forEach(contact => {
        mockMailchimpAPI.addSubscriber(contact.email, {
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType,
            COFOUNDER: contact.cofounder ? 'Yes' : 'No'
          }
        });
      });

      // Create high-priority segment (physician + co-founder interest)
      const highPrioritySegment = mockMailchimpAPI.createSegment({
        name: 'High Priority Co-founder Physicians',
        options: {
          match: 'all',
          conditions: [
            {
              condition_type: 'TextMerge',
              field: 'USERTYPE',
              op: 'is',
              value: 'physician'
            },
            {
              condition_type: 'TextMerge',
              field: 'COFOUNDER',
              op: 'is',
              value: 'Yes'
            }
          ]
        }
      });

      expect(highPrioritySegment.member_count).toBe(2); // Only co-founder physicians
    });
  });

  describe('Specialty-Based Segmentation', () => {
    test('should segment physicians by medical specialty', () => {
      // Add physicians with different specialties
      const specialties = ['Family Medicine', 'Emergency Medicine', 'Cardiology', 'Neurology', 'Pediatrics'];
      const contacts = [];

      specialties.forEach(specialty => {
        // Add 2 physicians per specialty
        for (let i = 0; i < 2; i++) {
          const physician = testDataGenerator.generateContact('physician', {
            overrides: { specialty }
          });
          contacts.push(physician);

          mockMailchimpAPI.addSubscriber(physician.email, {
            merge_fields: {
              FNAME: physician.firstName,
              LNAME: physician.lastName,
              USERTYPE: 'physician',
              SPECIALTY: specialty
            }
          });
        }
      });

      // Create segment for Emergency Medicine physicians
      const emergencyMedSegment = mockMailchimpAPI.createSegment({
        name: 'Emergency Medicine Physicians',
        options: {
          match: 'all',
          conditions: [
            {
              condition_type: 'TextMerge',
              field: 'USERTYPE',
              op: 'is',
              value: 'physician'
            },
            {
              condition_type: 'TextMerge',
              field: 'SPECIALTY',
              op: 'is',
              value: 'Emergency Medicine'
            }
          ]
        }
      });

      expect(emergencyMedSegment.member_count).toBe(2);

      // Create segment for primary care (Family Medicine + Pediatrics)
      const primaryCarePhysicians = mockMailchimpAPI.getAllSubscribers().filter(s =>
        s.merge_fields.USERTYPE === 'physician' &&
        (s.merge_fields.SPECIALTY === 'Family Medicine' || s.merge_fields.SPECIALTY === 'Pediatrics')
      );

      expect(primaryCarePhysicians).toHaveLength(4);
    });
  });

  describe('Practice Model Segmentation', () => {
    test('should segment physicians by practice model', () => {
      const practiceModels = ['independent', 'hospital-employed', 'group-practice', 'academic'];

      practiceModels.forEach(practiceModel => {
        const physician = testDataGenerator.generateContact('physician', {
          overrides: { practiceModel }
        });

        mockMailchimpAPI.addSubscriber(physician.email, {
          merge_fields: {
            FNAME: physician.firstName,
            LNAME: physician.lastName,
            USERTYPE: 'physician',
            PRACTICE: practiceModel
          }
        });
      });

      // Create segment for independent physicians
      const independentSegment = mockMailchimpAPI.createSegment({
        name: 'Independent Physicians',
        options: {
          match: 'all',
          conditions: [
            {
              condition_type: 'TextMerge',
              field: 'USERTYPE',
              op: 'is',
              value: 'physician'
            },
            {
              condition_type: 'TextMerge',
              field: 'PRACTICE',
              op: 'is',
              value: 'independent'
            }
          ]
        }
      });

      expect(independentSegment.member_count).toBe(1);

      // Create segment for employed physicians (hospital + group practice)
      const employedPhysicians = mockMailchimpAPI.getAllSubscribers().filter(s =>
        s.merge_fields.USERTYPE === 'physician' &&
        (s.merge_fields.PRACTICE === 'hospital-employed' || s.merge_fields.PRACTICE === 'group-practice')
      );

      expect(employedPhysicians).toHaveLength(2);
    });
  });

  describe('EMR System Segmentation', () => {
    test('should segment physicians by EMR system', () => {
      const emrSystems = ['Epic', 'Cerner', 'Allscripts', 'athenahealth'];

      emrSystems.forEach(emrSystem => {
        // Add 3 physicians per EMR system
        for (let i = 0; i < 3; i++) {
          const physician = testDataGenerator.generateContact('physician', {
            overrides: { emrSystem }
          });

          mockMailchimpAPI.addSubscriber(physician.email, {
            merge_fields: {
              FNAME: physician.firstName,
              LNAME: physician.lastName,
              USERTYPE: 'physician',
              EMR: emrSystem
            }
          });
        }
      });

      // Create Epic users segment
      const epicSegment = mockMailchimpAPI.createSegment({
        name: 'Epic EMR Users',
        options: {
          match: 'all',
          conditions: [
            {
              condition_type: 'TextMerge',
              field: 'USERTYPE',
              op: 'is',
              value: 'physician'
            },
            {
              condition_type: 'TextMerge',
              field: 'EMR',
              op: 'is',
              value: 'Epic'
            }
          ]
        }
      });

      expect(epicSegment.member_count).toBe(3);

      // Verify total physician count
      const allPhysicians = mockMailchimpAPI.getSubscribersByUserType('physician');
      expect(allPhysicians).toHaveLength(12); // 3 per EMR system × 4 systems
    });
  });

  describe('Complex Multi-Condition Segmentation', () => {
    test('should create complex segment with multiple conditions', () => {
      // Add diverse set of physicians
      const physicians = [
        // Target segment: Independent Family Medicine Epic users
        { specialty: 'Family Medicine', practiceModel: 'independent', emrSystem: 'Epic' },
        { specialty: 'Family Medicine', practiceModel: 'independent', emrSystem: 'Epic' },

        // Not in target: Different specialty
        { specialty: 'Cardiology', practiceModel: 'independent', emrSystem: 'Epic' },

        // Not in target: Different practice model
        { specialty: 'Family Medicine', practiceModel: 'hospital-employed', emrSystem: 'Epic' },

        // Not in target: Different EMR
        { specialty: 'Family Medicine', practiceModel: 'independent', emrSystem: 'Cerner' },

        // Not in target: Multiple differences
        { specialty: 'Emergency Medicine', practiceModel: 'group-practice', emrSystem: 'Allscripts' }
      ];

      physicians.forEach(config => {
        const physician = testDataGenerator.generateContact('physician', {
          overrides: config
        });

        mockMailchimpAPI.addSubscriber(physician.email, {
          merge_fields: {
            FNAME: physician.firstName,
            LNAME: physician.lastName,
            USERTYPE: 'physician',
            SPECIALTY: config.specialty,
            PRACTICE: config.practiceModel,
            EMR: config.emrSystem
          }
        });
      });

      // Create complex segment
      const complexSegment = mockMailchimpAPI.createSegment({
        name: 'Independent Family Medicine Epic Users',
        options: {
          match: 'all',
          conditions: [
            {
              condition_type: 'TextMerge',
              field: 'USERTYPE',
              op: 'is',
              value: 'physician'
            },
            {
              condition_type: 'TextMerge',
              field: 'SPECIALTY',
              op: 'is',
              value: 'Family Medicine'
            },
            {
              condition_type: 'TextMerge',
              field: 'PRACTICE',
              op: 'is',
              value: 'independent'
            },
            {
              condition_type: 'TextMerge',
              field: 'EMR',
              op: 'is',
              value: 'Epic'
            }
          ]
        }
      });

      expect(complexSegment.member_count).toBe(2); // Only the first two match all conditions
    });

    test('should handle OR logic with any match', () => {
      // Add various specialists
      const contacts = [
        testDataGenerator.generateContact('specialist', { overrides: { specialty: 'Health Tech AI' } }),
        testDataGenerator.generateContact('specialist', { overrides: { specialty: 'Medical AI' } }),
        testDataGenerator.generateContact('specialist', { overrides: { specialty: 'Clinical Data Science' } }),
        testDataGenerator.generateContact('physician', { overrides: { specialty: 'Family Medicine' } }) // Should not match
      ];

      contacts.forEach(contact => {
        mockMailchimpAPI.addSubscriber(contact.email, {
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType,
            SPECIALTY: contact.specialty
          }
        });
      });

      // Get AI/Tech specialists (would need custom logic for OR conditions)
      const aiSpecialists = mockMailchimpAPI.getAllSubscribers().filter(s =>
        s.merge_fields.USERTYPE === 'specialist' &&
        (s.merge_fields.SPECIALTY.includes('AI') || s.merge_fields.SPECIALTY.includes('Tech'))
      );

      expect(aiSpecialists).toHaveLength(2); // Health Tech AI + Medical AI
    });
  });

  describe('Dynamic Segment Updates', () => {
    test('should update segment member count when new subscribers added', () => {
      // Create initial segment
      const physicianSegment = mockMailchimpAPI.createSegment({
        name: 'All Physicians',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'physician'
          }]
        }
      });

      expect(physicianSegment.member_count).toBe(0);

      // Add physicians one by one and check count updates
      for (let i = 1; i <= 5; i++) {
        const physician = testDataGenerator.generateContact('physician');
        mockMailchimpAPI.addSubscriber(physician.email, {
          merge_fields: {
            FNAME: physician.firstName,
            LNAME: physician.lastName,
            USERTYPE: 'physician'
          }
        });

        // Update segment count
        mockMailchimpAPI.updateSegmentMemberCount(physicianSegment.id);
        const updatedSegment = mockMailchimpAPI.segments.get(physicianSegment.id);
        expect(updatedSegment.member_count).toBe(i);
      }
    });

    test('should handle subscriber data changes affecting segmentation', () => {
      const physician = testDataGenerator.generateContact('physician');

      // Add as regular physician
      const subscriber = mockMailchimpAPI.addSubscriber(physician.email, {
        merge_fields: {
          FNAME: physician.firstName,
          LNAME: physician.lastName,
          USERTYPE: 'physician',
          COFOUNDER: 'No'
        }
      });

      // Create co-founder segment
      const cofounderSegment = mockMailchimpAPI.createSegment({
        name: 'Co-founder Interest',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'COFOUNDER',
            op: 'is',
            value: 'Yes'
          }]
        }
      });

      expect(cofounderSegment.member_count).toBe(0);

      // Update subscriber to have co-founder interest
      mockMailchimpAPI.updateSubscriber(physician.email, {
        merge_fields: {
          COFOUNDER: 'Yes'
        }
      });

      // Update segment count
      mockMailchimpAPI.updateSegmentMemberCount(cofounderSegment.id);
      const updatedSegment = mockMailchimpAPI.segments.get(cofounderSegment.id);
      expect(updatedSegment.member_count).toBe(1);
    });
  });

  describe('Segmentation Performance', () => {
    test('should handle large audience segmentation efficiently', () => {
      const largeAudienceSize = 1000;
      const contacts = testDataGenerator.generateContactBatch(largeAudienceSize, {
        physician: 0.6,
        investor: 0.25,
        specialist: 0.15
      });

      const startTime = Date.now();

      // Add all contacts
      contacts.forEach(contact => {
        mockMailchimpAPI.addSubscriber(contact.email, {
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType,
            SPECIALTY: contact.specialty || '',
            COFOUNDER: contact.cofounder ? 'Yes' : 'No'
          }
        });
      });

      const addTime = Date.now() - startTime;

      // Create multiple segments
      const segmentStartTime = Date.now();

      const physicianSegment = mockMailchimpAPI.createSegment({
        name: 'All Physicians',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'physician'
          }]
        }
      });

      const investorSegment = mockMailchimpAPI.createSegment({
        name: 'All Investors',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'investor'
          }]
        }
      });

      const cofounderSegment = mockMailchimpAPI.createSegment({
        name: 'Co-founder Interest',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'COFOUNDER',
            op: 'is',
            value: 'Yes'
          }]
        }
      });

      const segmentTime = Date.now() - segmentStartTime;

      console.log(`Performance Results:
        - Added ${largeAudienceSize} contacts in ${addTime}ms
        - Created 3 segments in ${segmentTime}ms
        - Physician segment: ${physicianSegment.member_count} members
        - Investor segment: ${investorSegment.member_count} members
        - Co-founder segment: ${cofounderSegment.member_count} members`);

      // Verify counts are reasonable
      expect(physicianSegment.member_count).toBeGreaterThan(500); // ~60%
      expect(physicianSegment.member_count).toBeLessThan(700);

      expect(investorSegment.member_count).toBeGreaterThan(200); // ~25%
      expect(investorSegment.member_count).toBeLessThan(300);

      // Performance assertions
      expect(addTime).toBeLessThan(5000); // Adding 1000 contacts under 5 seconds
      expect(segmentTime).toBeLessThan(1000); // Creating segments under 1 second
    });
  });

  describe('Segmentation Error Handling', () => {
    test('should handle invalid segment conditions gracefully', () => {
      // Try to create segment with invalid field
      expect(() => {
        mockMailchimpAPI.createSegment({
          name: 'Invalid Segment',
          options: {
            match: 'all',
            conditions: [{
              condition_type: 'TextMerge',
              field: 'NONEXISTENT_FIELD',
              op: 'is',
              value: 'test'
            }]
          }
        });
      }).not.toThrow(); // Should create segment, but count will be 0

      const invalidSegment = mockMailchimpAPI.createSegment({
        name: 'Invalid Field Segment',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'NONEXISTENT_FIELD',
            op: 'is',
            value: 'test'
          }]
        }
      });

      expect(invalidSegment.member_count).toBe(0);
    });

    test('should handle empty segment creation', () => {
      const emptySegment = mockMailchimpAPI.createSegment({
        name: 'Empty Segment',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'nonexistent-type'
          }]
        }
      });

      expect(emptySegment.member_count).toBe(0);
      expect(emptySegment.name).toBe('Empty Segment');
    });
  });
});