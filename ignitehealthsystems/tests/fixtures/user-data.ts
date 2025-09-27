export interface TestUser {
  name: string;
  email: string;
  role: 'physician' | 'nurse' | 'administrator' | 'other';
  note?: string;
}

export const testUsers: Record<string, TestUser> = {
  physician: {
    name: 'Dr. Bhaven Murji',
    email: 'bhavenmurji@gmail.com',
    role: 'physician',
    note: 'Interested in AI-powered clinical decision support and patient care optimization.'
  },

  investor: {
    name: 'Bhaven Murji',
    email: 'bhavenmurji@icloud.com',
    role: 'other', // Using 'other' for investor since it's not in the dropdown
    note: 'Investor interested in healthcare AI and digital transformation opportunities.'
  },

  nurse: {
    name: 'Test Nurse',
    email: 'test.nurse@example.com',
    role: 'nurse',
    note: 'Testing nurse signup functionality.'
  },

  administrator: {
    name: 'Test Admin',
    email: 'test.admin@example.com',
    role: 'administrator',
    note: 'Testing administrator signup functionality.'
  }
};

export const expectedEmailSubjects = {
  welcome: {
    physician: 'Welcome to Ignite Health Systems - Transform Your Practice',
    nurse: 'Welcome to Ignite Health Systems - Enhance Patient Care',
    administrator: 'Welcome to Ignite Health Systems - Optimize Operations',
    investor: 'Welcome to Ignite Health Systems - Investment Opportunity'
  },
  newsletter: 'Ignite Health Systems Monthly Insights'
};