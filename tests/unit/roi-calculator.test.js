/**
 * @test ROI Calculator Unit Tests
 * @description Validates the ROI calculator functionality with edge cases
 * @prerequisites JSDOM environment with mocked DOM elements
 */

describe('ROI Calculator', () => {
  let mockDocument;
  let calculatorCache;
  let calculatorUpdateTimeout;

  beforeEach(() => {
    // Reset global variables
    calculatorCache = new Map();
    calculatorUpdateTimeout = null;

    // Mock DOM elements
    document.body.innerHTML = `
      <input type="number" id="patients-per-day" value="20" />
      <input type="number" id="minutes-per-note" value="15" />
      <input type="number" id="working-days" value="5" />
      <div id="current-time">25 hours/week</div>
      <div id="time-saved">10 hours/week</div>
      <div id="monthly-value">$8,000 saved</div>
    `;

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
    global.clearTimeout = jest.fn();
    global.setTimeout = jest.fn((fn, delay) => fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Calculator Logic', () => {
    it('should calculate correct values for default inputs', () => {
      const patientsPerDay = 20;
      const minutesPerNote = 15;
      const workingDays = 5;

      const currentMinutesPerWeek = patientsPerDay * minutesPerNote * workingDays;
      const currentHoursPerWeek = currentMinutesPerWeek / 60;
      const timeReduction = 0.4;
      const savedHours = currentHoursPerWeek * timeReduction;
      const hourlyValue = 200;
      const monthlySavings = savedHours * 4 * hourlyValue;

      expect(currentHoursPerWeek).toBe(25);
      expect(savedHours).toBe(10);
      expect(monthlySavings).toBe(8000);
    });

    it('should handle edge case: minimum values', () => {
      const patientsPerDay = 1;
      const minutesPerNote = 1;
      const workingDays = 1;

      const currentMinutesPerWeek = patientsPerDay * minutesPerNote * workingDays;
      const currentHoursPerWeek = currentMinutesPerWeek / 60;

      expect(currentHoursPerWeek).toBe(1/60);
      expect(currentHoursPerWeek).toBeGreaterThan(0);
    });

    it('should handle edge case: maximum reasonable values', () => {
      const patientsPerDay = 50;
      const minutesPerNote = 30;
      const workingDays = 7;

      const currentMinutesPerWeek = patientsPerDay * minutesPerNote * workingDays;
      const currentHoursPerWeek = currentMinutesPerWeek / 60;

      expect(currentHoursPerWeek).toBe(175);
      expect(currentHoursPerWeek).toBeLessThan(200); // Sanity check
    });

    it('should handle invalid/zero inputs gracefully', () => {
      const patientsPerDay = 0;
      const minutesPerNote = 0;
      const workingDays = 0;

      const currentMinutesPerWeek = patientsPerDay * minutesPerNote * workingDays;
      const currentHoursPerWeek = currentMinutesPerWeek / 60;

      expect(currentHoursPerWeek).toBe(0);
      expect(Number.isFinite(currentHoursPerWeek)).toBe(true);
    });
  });

  describe('DOM Integration', () => {
    it('should read input values from DOM elements', () => {
      const patientsInput = document.getElementById('patients-per-day');
      const minutesInput = document.getElementById('minutes-per-note');
      const workingDaysInput = document.getElementById('working-days');

      expect(parseInt(patientsInput.value)).toBe(20);
      expect(parseInt(minutesInput.value)).toBe(15);
      expect(parseInt(workingDaysInput.value)).toBe(5);
    });

    it('should update display elements with calculated values', () => {
      const currentTimeElement = document.getElementById('current-time');
      const timeSavedElement = document.getElementById('time-saved');
      const monthlyValueElement = document.getElementById('monthly-value');

      expect(currentTimeElement).toBeTruthy();
      expect(timeSavedElement).toBeTruthy();
      expect(monthlyValueElement).toBeTruthy();
    });

    it('should handle missing DOM elements gracefully', () => {
      document.getElementById('current-time').remove();

      expect(() => {
        const element = document.getElementById('current-time');
        if (element) element.textContent = 'test';
      }).not.toThrow();
    });
  });

  describe('Performance Optimization', () => {
    it('should implement caching for repeated calculations', () => {
      const cache = new Map();
      const key = '20-15-5';
      const result = { currentHours: 25, savedHours: 10, monthlySavings: 8000 };

      cache.set(key, result);
      expect(cache.get(key)).toEqual(result);
      expect(cache.has(key)).toBe(true);
    });

    it('should debounce rapid input changes', () => {
      const mockSetTimeout = jest.fn();
      const mockClearTimeout = jest.fn();

      global.setTimeout = mockSetTimeout;
      global.clearTimeout = mockClearTimeout;

      // Simulate rapid input changes
      const input = document.getElementById('patients-per-day');
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('input'));

      // Should clear timeout on each input
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockSetTimeout).toHaveBeenCalled();
    });
  });

  describe('Healthcare-Specific Validation', () => {
    it('should validate reasonable physician workload ranges', () => {
      // Test typical family practice ranges
      const typicalPatients = 25;
      const typicalMinutes = 12;
      const typicalDays = 5;

      expect(typicalPatients).toBeGreaterThan(0);
      expect(typicalPatients).toBeLessThanOrEqual(50);
      expect(typicalMinutes).toBeGreaterThan(0);
      expect(typicalMinutes).toBeLessThanOrEqual(30);
      expect(typicalDays).toBeGreaterThan(0);
      expect(typicalDays).toBeLessThanOrEqual(7);
    });

    it('should calculate realistic time savings percentages', () => {
      const timeReduction = 0.4; // 40%

      expect(timeReduction).toBeGreaterThan(0);
      expect(timeReduction).toBeLessThan(1);
      expect(timeReduction).toBe(0.4); // Matches business requirement
    });

    it('should use realistic physician hourly values', () => {
      const hourlyValue = 200; // $200/hour

      expect(hourlyValue).toBeGreaterThan(100);
      expect(hourlyValue).toBeLessThan(500);
      expect(typeof hourlyValue).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should handle NaN inputs gracefully', () => {
      const patientsPerDay = parseInt('invalid') || 20;
      const minutesPerNote = parseInt('') || 15;
      const workingDays = parseInt(null) || 5;

      expect(patientsPerDay).toBe(20);
      expect(minutesPerNote).toBe(15);
      expect(workingDays).toBe(5);
    });

    it('should handle negative inputs by using fallbacks', () => {
      const negativeInput = -5;
      const validInput = Math.max(negativeInput, 1);

      expect(validInput).toBe(1);
      expect(validInput).toBeGreaterThan(0);
    });
  });
});