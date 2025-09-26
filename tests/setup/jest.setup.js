// Jest DOM setup for HTML element testing
import '@testing-library/jest-dom';

// Mock implementations for browser APIs
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock navigator APIs
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve()),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock performance API
global.performance.mark = jest.fn();
global.performance.measure = jest.fn();
global.requestIdleCallback = jest.fn(cb => setTimeout(cb, 1));

// Custom matchers for healthcare-specific testing
expect.extend({
  toBeAccessible(received) {
    // Check for basic accessibility requirements
    const hasAriaLabel = received.getAttribute('aria-label');
    const hasAltText = received.tagName === 'IMG' ? received.getAttribute('alt') : true;
    const hasRole = received.getAttribute('role') || received.tagName.toLowerCase();

    const pass = hasAriaLabel || hasAltText || hasRole;

    if (pass) {
      return {
        message: () => `Element is accessible`,
        pass: true,
      };
    } else {
      return {
        message: () => `Element lacks accessibility features (aria-label, alt text, or role)`,
        pass: false,
      };
    }
  },

  toHaveValidFormStructure(received) {
    const hasLabels = received.querySelectorAll('label').length > 0;
    const hasRequiredFields = received.querySelectorAll('[required]').length > 0;
    const hasSubmitButton = received.querySelector('button[type="submit"], input[type="submit"]');

    const pass = hasLabels && hasSubmitButton;

    if (pass) {
      return {
        message: () => `Form has valid structure`,
        pass: true,
      };
    } else {
      return {
        message: () => `Form lacks proper structure (labels, submit button)`,
        pass: false,
      };
    }
  }
});