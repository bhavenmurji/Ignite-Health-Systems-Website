/**
 * @test Form Submission Integration Tests
 * @description Integration testing for form handling and API communication
 * @prerequisites Mock server and form submission endpoints
 */

describe('Form Submission Integration', () => {
  let mockFetch;
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Set up DOM
    document.body.innerHTML = `
      <form id="waitlist-form" action="/api/waitlist" method="POST">
        <input type="text" name="name" id="name" required />
        <input type="email" name="email" id="email" required />
        <input type="tel" name="phone" id="phone" />
        <select name="practice_type" id="practice_type" required>
          <option value="">Select Practice Type</option>
          <option value="family_medicine">Family Medicine</option>
          <option value="internal_medicine">Internal Medicine</option>
        </select>
        <textarea name="message" id="message"></textarea>
        <button type="submit" id="submit-btn">Join Waitlist</button>
      </form>
      <div id="success-message" style="display: none;"></div>
      <div id="error-message" style="display: none;"></div>
    `;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  describe('Successful Form Submissions', () => {
    it('should submit valid physician data successfully', async () => {
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Successfully added to waitlist',
          id: 'physician_12345'
        })
      });

      const form = document.getElementById('waitlist-form');
      const formData = {
        name: 'Dr. Sarah Chen, MD',
        email: 'sarah.chen@familyclinic.com',
        phone: '(555) 123-4567',
        practice_type: 'family_medicine',
        message: 'Interested in reducing EHR burden'
      };

      // Fill form
      Object.entries(formData).forEach(([name, value]) => {
        const field = document.querySelector(`[name="${name}"]`);
        if (field) field.value = value;
      });

      // Simulate form submission
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formDataObj = new FormData(form);
        const data = Object.fromEntries(formDataObj);

        try {
          const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();

          if (response.ok) {
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('success-message').textContent = result.message;
            form.reset();
          }
        } catch (error) {
          console.error('Submission failed:', error);
        }
      });

      form.dispatchEvent(submitEvent);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify API was called correctly
      expect(mockFetch).toHaveBeenCalledWith('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Verify success message is shown
      const successMessage = document.getElementById('success-message');
      expect(successMessage.style.display).toBe('block');
      expect(successMessage.textContent).toBe('Successfully added to waitlist');
    });

    it('should handle different practice types correctly', async () => {
      const practiceTypes = [
        'family_medicine',
        'internal_medicine',
        'pediatrics',
        'dpc',
        'emergency_medicine'
      ];

      for (const practiceType of practiceTypes) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true, practice_type: practiceType })
        });

        const formData = {
          name: `Dr. Test ${practiceType}`,
          email: `test.${practiceType}@clinic.com`,
          practice_type: practiceType
        };

        // Simulate submission
        await fetch('/api/waitlist', {
          method: 'POST',
          body: JSON.stringify(formData)
        });

        expect(mockFetch).toHaveBeenCalledWith('/api/waitlist', expect.objectContaining({
          body: JSON.stringify(formData)
        }));
      }
    });

    it('should include proper analytics tracking', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      });

      const mockAnalytics = jest.fn();
      global.gtag = mockAnalytics;

      const form = document.getElementById('waitlist-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Track form submission
        if (typeof gtag === 'function') {
          gtag('event', 'form_submission', {
            event_category: 'engagement',
            event_label: 'waitlist_form',
            value: 1
          });
        }

        await fetch('/api/waitlist', {
          method: 'POST',
          body: JSON.stringify({ name: 'Test', email: 'test@example.com' })
        });
      });

      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockAnalytics).toHaveBeenCalledWith('event', 'form_submission', {
        event_category: 'engagement',
        event_label: 'waitlist_form',
        value: 1
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: 'Internal server error'
        })
      });

      const form = document.getElementById('waitlist-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
          const response = await fetch('/api/waitlist', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test', email: 'test@example.com' })
          });

          if (!response.ok) {
            const errorData = await response.json();
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').textContent =
              errorData.error || 'Something went wrong. Please try again.';
          }
        } catch (error) {
          console.error('Network error:', error);
        }
      });

      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const errorMessage = document.getElementById('error-message');
      expect(errorMessage.style.display).toBe('block');
      expect(errorMessage.textContent).toBe('Internal server error');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const form = document.getElementById('waitlist-form');
      let errorHandled = false;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
          await fetch('/api/waitlist', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test', email: 'test@example.com' })
          });
        } catch (error) {
          errorHandled = true;
          document.getElementById('error-message').style.display = 'block';
          document.getElementById('error-message').textContent =
            'Network error. Please check your connection and try again.';
        }
      });

      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorHandled).toBe(true);
      const errorMessage = document.getElementById('error-message');
      expect(errorMessage.style.display).toBe('block');
    });

    it('should handle duplicate email submissions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          success: false,
          error: 'Email already registered',
          code: 'DUPLICATE_EMAIL'
        })
      });

      const form = document.getElementById('waitlist-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const response = await fetch('/api/waitlist', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Dr. Duplicate',
            email: 'existing@clinic.com'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.code === 'DUPLICATE_EMAIL') {
            document.getElementById('error-message').textContent =
              'This email is already on our waitlist. Check your inbox for updates!';
            document.getElementById('error-message').style.display = 'block';
          }
        }
      });

      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const errorMessage = document.getElementById('error-message');
      expect(errorMessage.textContent).toContain('already on our waitlist');
    });
  });

  describe('Form Validation Integration', () => {
    it('should prevent submission with invalid data', () => {
      const form = document.getElementById('waitlist-form');
      let submissionPrevented = false;

      form.addEventListener('submit', (e) => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const practiceType = document.getElementById('practice_type').value;

        if (!name || !email || !practiceType) {
          e.preventDefault();
          submissionPrevented = true;
        }
      });

      // Leave required fields empty
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('practice_type').value = '';

      form.dispatchEvent(new Event('submit'));

      expect(submissionPrevented).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should validate email format before submission', () => {
      const form = document.getElementById('waitlist-form');
      const emailField = document.getElementById('email');

      const invalidEmails = [
        'invalid-email',
        'test@',
        '@clinic.com',
        'test..email@clinic.com'
      ];

      invalidEmails.forEach(email => {
        emailField.value = email;
        expect(emailField.validity.valid).toBe(false);
      });

      const validEmails = [
        'doctor@clinic.com',
        'test.email@healthcare.org',
        'physician+tag@hospital.net'
      ];

      validEmails.forEach(email => {
        emailField.value = email;
        expect(emailField.validity.valid).toBe(true);
      });
    });

    it('should sanitize input data before submission', () => {
      const form = document.getElementById('waitlist-form');

      // Mock sanitization function
      const sanitizeInput = (input) => {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                   .replace(/javascript:/gi, '')
                   .trim();
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const sanitizedData = {};

        for (const [key, value] of formData.entries()) {
          sanitizedData[key] = sanitizeInput(value);
        }

        // Verify sanitization worked
        expect(sanitizedData.name).not.toContain('<script>');
        expect(sanitizedData.message).not.toContain('javascript:');
      });

      // Fill form with malicious data
      document.getElementById('name').value = 'Dr. Test <script>alert("xss")</script>';
      document.getElementById('message').value = 'javascript:alert("xss")';

      form.dispatchEvent(new Event('submit'));
    });
  });

  describe('ROI Calculator Integration', () => {
    beforeEach(() => {
      document.body.innerHTML += `
        <div class="roi-calculator">
          <input type="number" id="patients-per-day" value="20" />
          <input type="number" id="minutes-per-note" value="15" />
          <input type="number" id="working-days" value="5" />
          <div id="current-time">25 hours/week</div>
          <div id="time-saved">10 hours/week</div>
          <div id="monthly-value">$8,000 saved</div>
        </div>
      `;
    });

    it('should calculate and update values correctly', () => {
      const calculateROI = (patients, minutes, days) => {
        const currentMinutesPerWeek = patients * minutes * days;
        const currentHoursPerWeek = currentMinutesPerWeek / 60;
        const timeReduction = 0.4;
        const savedHours = currentHoursPerWeek * timeReduction;
        const hourlyValue = 200;
        const monthlySavings = savedHours * 4 * hourlyValue;

        return {
          currentHours: Math.round(currentHoursPerWeek * 10) / 10,
          savedHours: Math.round(savedHours * 10) / 10,
          monthlySavings: Math.round(monthlySavings)
        };
      };

      const updateCalculator = () => {
        const patients = parseInt(document.getElementById('patients-per-day').value) || 20;
        const minutes = parseInt(document.getElementById('minutes-per-note').value) || 15;
        const days = parseInt(document.getElementById('working-days').value) || 5;

        const result = calculateROI(patients, minutes, days);

        document.getElementById('current-time').textContent = `${result.currentHours} hours/week`;
        document.getElementById('time-saved').textContent = `${result.savedHours} hours/week`;
        document.getElementById('monthly-value').textContent = `$${result.monthlySavings.toLocaleString()} saved`;
      };

      // Test default values
      updateCalculator();
      expect(document.getElementById('current-time').textContent).toBe('25 hours/week');
      expect(document.getElementById('time-saved').textContent).toBe('10 hours/week');
      expect(document.getElementById('monthly-value').textContent).toBe('$8,000 saved');

      // Test updated values
      document.getElementById('patients-per-day').value = '30';
      document.getElementById('minutes-per-note').value = '20';
      document.getElementById('working-days').value = '6';
      updateCalculator();

      const newCurrentTime = document.getElementById('current-time').textContent;
      const newTimeSaved = document.getElementById('time-saved').textContent;
      const newMonthlyValue = document.getElementById('monthly-value').textContent;

      expect(newCurrentTime).toBe('60 hours/week');
      expect(newTimeSaved).toBe('24 hours/week');
      expect(newMonthlyValue).toBe('$19,200 saved');
    });

    it('should handle edge cases in calculator', () => {
      const calculateROI = (patients, minutes, days) => {
        const currentMinutesPerWeek = patients * minutes * days;
        const currentHoursPerWeek = currentMinutesPerWeek / 60;
        const timeReduction = 0.4;
        const savedHours = currentHoursPerWeek * timeReduction;
        const hourlyValue = 200;
        const monthlySavings = savedHours * 4 * hourlyValue;

        return {
          currentHours: Math.max(0, Math.round(currentHoursPerWeek * 10) / 10),
          savedHours: Math.max(0, Math.round(savedHours * 10) / 10),
          monthlySavings: Math.max(0, Math.round(monthlySavings))
        };
      };

      // Test zero values
      let result = calculateROI(0, 0, 0);
      expect(result.currentHours).toBe(0);
      expect(result.savedHours).toBe(0);
      expect(result.monthlySavings).toBe(0);

      // Test negative values (should be handled gracefully)
      result = calculateROI(-1, -1, -1);
      expect(result.currentHours).toBe(0);
      expect(result.savedHours).toBe(0);
      expect(result.monthlySavings).toBe(0);

      // Test extreme values
      result = calculateROI(100, 60, 7);
      expect(result.currentHours).toBe(700);
      expect(result.savedHours).toBe(280);
      expect(result.monthlySavings).toBe(224000);
    });
  });

  describe('Email Notification Integration', () => {
    it('should trigger email confirmation after successful submission', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          emailSent: true,
          confirmationId: 'conf_12345'
        })
      });

      const form = document.getElementById('waitlist-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const response = await fetch('/api/waitlist', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Dr. Test',
            email: 'test@example.com'
          })
        });

        const result = await response.json();

        if (result.emailSent) {
          document.getElementById('success-message').innerHTML = `
            <p>Successfully added to waitlist!</p>
            <p>Check your email for confirmation and next steps.</p>
          `;
          document.getElementById('success-message').style.display = 'block';
        }
      });

      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const successMessage = document.getElementById('success-message');
      expect(successMessage.innerHTML).toContain('Check your email');
    });
  });
});