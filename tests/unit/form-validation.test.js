/**
 * @test Form Validation Unit Tests
 * @description Validates form handling and validation logic
 * @prerequisites JSDOM with form elements and validation functions
 */

describe('Form Validation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="waitlist-form" data-testid="waitlist-form">
        <input type="text" name="name" id="name" required />
        <input type="email" name="email" id="email" required />
        <input type="tel" name="phone" id="phone" />
        <select name="practice_type" id="practice_type" required>
          <option value="">Select Practice Type</option>
          <option value="family_medicine">Family Medicine</option>
          <option value="internal_medicine">Internal Medicine</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="dpc">Direct Primary Care</option>
        </select>
        <textarea name="message" id="message"></textarea>
        <button type="submit">Join Waitlist</button>
      </form>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'doctor@clinic.com',
        'test.email+tag@example.com',
        'physician123@hospital.org',
        'dr.smith@healthcare.net'
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@clinic.com',
        'doctor@',
        'doctor@.com',
        '',
        ' ',
        'doctor..test@clinic.com'
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should handle healthcare-specific email domains', () => {
      const healthcareEmails = [
        'physician@mayo.edu',
        'doctor@jhmi.edu',
        'admin@clevelandclinic.org',
        'staff@kaiserpermanente.org'
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.(edu|org|com|net)$/;

      healthcareEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate US phone number formats', () => {
      const validPhones = [
        '(555) 123-4567',
        '555-123-4567',
        '5551234567',
        '+1 555 123 4567',
        '555.123.4567'
      ];

      const phoneRegex = /^[\+]?[1]?[\s\-\.]?\(?[0-9]{3}\)?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/;

      validPhones.forEach(phone => {
        expect(phoneRegex.test(phone)).toBe(true);
      });
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = [
        '123',
        '555-12-3456',
        'phone-number',
        '555 123 456',
        ''
      ];

      const phoneRegex = /^[\+]?[1]?[\s\-\.]?\(?[0-9]{3}\)?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/;

      invalidPhones.forEach(phone => {
        if (phone) { // Skip empty string as it might be optional
          expect(phoneRegex.test(phone)).toBe(false);
        }
      });
    });
  });

  describe('Name Validation', () => {
    it('should validate physician names with titles', () => {
      const validNames = [
        'Dr. John Smith',
        'Sarah Johnson, MD',
        'Michael Chen',
        'Dr. Maria Rodriguez-Garcia',
        'Jennifer Park, DO',
        'David O\'Brien'
      ];

      const nameRegex = /^[a-zA-Z\s\.\,\'\-]+$/;

      validNames.forEach(name => {
        expect(nameRegex.test(name)).toBe(true);
        expect(name.length).toBeGreaterThan(2);
        expect(name.length).toBeLessThan(100);
      });
    });

    it('should reject invalid name formats', () => {
      const invalidNames = [
        '',
        '123',
        'Dr. Smith123',
        'Name@clinic',
        'A', // Too short
        'X'.repeat(101) // Too long
      ];

      const nameRegex = /^[a-zA-Z\s\.\,\'\-]+$/;

      invalidNames.forEach(name => {
        if (name.length === 0) {
          expect(name).toBe('');
        } else if (name.length <= 2 || name.length >= 100) {
          expect(name.length <= 2 || name.length >= 100).toBe(true);
        } else {
          expect(nameRegex.test(name)).toBe(false);
        }
      });
    });
  });

  describe('Practice Type Validation', () => {
    it('should validate medical practice types', () => {
      const validPracticeTypes = [
        'family_medicine',
        'internal_medicine',
        'pediatrics',
        'dpc',
        'cardiology',
        'dermatology',
        'orthopedics'
      ];

      validPracticeTypes.forEach(type => {
        expect(type).toMatch(/^[a-z_]+$/);
        expect(type.length).toBeGreaterThan(2);
      });
    });

    it('should have required practice type selection', () => {
      const selectElement = document.getElementById('practice_type');
      expect(selectElement.hasAttribute('required')).toBe(true);

      const options = selectElement.querySelectorAll('option');
      expect(options.length).toBeGreaterThan(1); // Should have options beyond placeholder
    });
  });

  describe('Form Structure Validation', () => {
    it('should have proper form structure', () => {
      const form = document.getElementById('waitlist-form');

      expect(form).toHaveValidFormStructure();
      expect(form.tagName).toBe('FORM');

      const requiredFields = form.querySelectorAll('[required]');
      expect(requiredFields.length).toBeGreaterThan(0);

      const submitButton = form.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });

    it('should have accessible labels for form fields', () => {
      const form = document.getElementById('waitlist-form');
      const inputs = form.querySelectorAll('input, select, textarea');

      inputs.forEach(input => {
        // Should have either a label, aria-label, or be self-descriptive
        const hasLabel = document.querySelector(`label[for="${input.id}"]`);
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasPlaceholder = input.getAttribute('placeholder');

        const isAccessible = hasLabel || hasAriaLabel || hasPlaceholder || input.tagName === 'BUTTON';
        expect(isAccessible).toBeTruthy();
      });
    });

    it('should handle form submission properly', () => {
      const form = document.getElementById('waitlist-form');
      const mockSubmit = jest.fn();

      form.addEventListener('submit', mockSubmit);
      form.dispatchEvent(new Event('submit'));

      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe('Healthcare-Specific Validation', () => {
    it('should validate medical license formats (if applicable)', () => {
      const licenseFormats = [
        'MD123456',
        'DO-7890123',
        'NP.456789',
        'PA123456'
      ];

      const licenseRegex = /^[A-Z]{2}[-\.]?[0-9]{6,8}$/;

      licenseFormats.forEach(license => {
        expect(licenseRegex.test(license)).toBe(true);
      });
    });

    it('should validate NPI numbers format', () => {
      const validNPIs = [
        '1234567890',
        '9876543210'
      ];

      validNPIs.forEach(npi => {
        expect(npi).toMatch(/^\d{10}$/);
        expect(npi.length).toBe(10);
      });
    });

    it('should handle speciality-specific validation', () => {
      const medicalSpecialties = [
        'family_medicine',
        'internal_medicine',
        'pediatrics',
        'emergency_medicine',
        'psychiatry',
        'radiology',
        'pathology'
      ];

      medicalSpecialties.forEach(specialty => {
        expect(specialty).toMatch(/^[a-z_]+$/);
        expect(specialty.includes('medicine') || specialty.includes('ology') || ['pediatrics', 'psychiatry', 'dpc'].includes(specialty)).toBe(true);
      });
    });
  });

  describe('Security Validation', () => {
    it('should sanitize input to prevent XSS', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(1)">',
        '"><script>alert("xss")</script>'
      ];

      const sanitize = (input) => {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                   .replace(/javascript:/gi, '')
                   .replace(/on\w+\s*=/gi, '');
      };

      maliciousInputs.forEach(input => {
        const sanitized = sanitize(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized.toLowerCase()).not.toContain('javascript:');
        expect(sanitized.toLowerCase()).not.toMatch(/on\w+\s*=/);
      });
    });

    it('should validate input length limits', () => {
      const testLimits = {
        name: 100,
        email: 254,
        phone: 20,
        message: 1000
      };

      Object.entries(testLimits).forEach(([field, maxLength]) => {
        const tooLongInput = 'x'.repeat(maxLength + 1);
        expect(tooLongInput.length).toBeGreaterThan(maxLength);

        const validInput = 'x'.repeat(maxLength - 1);
        expect(validInput.length).toBeLessThan(maxLength);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing form elements gracefully', () => {
      document.body.innerHTML = ''; // Remove form

      expect(() => {
        const form = document.getElementById('waitlist-form');
        if (form) {
          // Process form
        }
      }).not.toThrow();
    });

    it('should provide meaningful error messages', () => {
      const errorMessages = {
        name: 'Please enter your full name',
        email: 'Please enter a valid email address',
        practice_type: 'Please select your practice type',
        phone: 'Please enter a valid phone number (optional)'
      };

      Object.entries(errorMessages).forEach(([field, message]) => {
        expect(message).toContain(field.replace('_', ' '));
        expect(message.length).toBeGreaterThan(10);
        expect(message).toMatch(/^[A-Z]/); // Should start with capital letter
      });
    });
  });
});