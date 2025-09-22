// IGNITE Health Systems EMR Application
// Complete application data and functionality

// Application Data from JSON
const appData = {
  currentUser: {
    name: "Dr. Sarah Johnson",
    role: "MD",
    practice: "IGNITE Health Systems",
    avatar: "SJ"
  },
  systemStatus: {
    online: true,
    notifications: 5,
    criticalAlerts: 2
  },
  scheduleMetrics: {
    totalAppointments: 18,
    noShowRate: 5.5,
    timeUntilNext: "12 min",
    providerStatus: "Available"
  },
  appointments: [
    {
      id: 1,
      time: "08:00 AM",
      endTime: "08:30 AM",
      patient: {
        name: "Maria Garcia",
        type: "New Patient",
        mrn: "MRN001234",
        age: 40
      },
      reason: "Annual Physical Exam",
      status: "Checked In",
      room: "Room 1",
      priority: "normal"
    },
    {
      id: 2,
      time: "08:30 AM",
      endTime: "08:45 AM",
      patient: {
        name: "David Chen",
        type: "Follow-up",
        mrn: "MRN005678",
        age: 55
      },
      reason: "Hypertension Check",
      status: "Scheduled",
      room: "Room 2",
      priority: "routine"
    },
    {
      id: 3,
      time: "09:00 AM",
      endTime: "09:15 AM",
      patient: {
        name: "Sarah Williams",
        type: "Urgent Care",
        mrn: "MRN009012",
        age: 28
      },
      reason: "Respiratory Symptoms",
      status: "In Room",
      room: "Room 1",
      priority: "urgent"
    },
    {
      id: 4,
      time: "09:30 AM",
      endTime: "09:45 AM",
      patient: {
        name: "John Smith",
        type: "Follow-up",
        mrn: "MRN003456",
        age: 45
      },
      reason: "Diabetes Management",
      status: "No Show",
      room: "Room 2",
      priority: "high"
    },
    {
      id: 5,
      time: "10:00 AM",
      endTime: "10:30 AM",
      patient: {
        name: "Lisa Anderson",
        type: "New Patient",
        mrn: "MRN007890",
        age: 35
      },
      reason: "General Consultation",
      status: "Scheduled",
      room: "Room 1",
      priority: "normal"
    },
    {
      id: 6,
      time: "10:30 AM",
      endTime: "11:00 AM",
      patient: {
        name: "Robert Davis",
        type: "Follow-up",
        mrn: "MRN011111",
        age: 62
      },
      reason: "Cardiac Follow-up",
      status: "Confirmed",
      room: "Room 2",
      priority: "high"
    }
  ],
  patients: [
    {
      name: "Maria Garcia",
      dob: "1985-03-15",
      mrn: "MRN001234",
      age: 40,
      allergies: ["Penicillin", "Shellfish"],
      medications: ["Lisinopril 10mg daily", "Metformin 500mg BID"],
      vitals: {
        bp: "128/82",
        temp: "98.6°F",
        pulse: "72 bpm",
        weight: "165 lbs",
        height: "5'6\""
      },
      insurance: "Blue Cross Blue Shield",
      lastVisit: "2025-06-15"
    },
    {
      name: "David Chen",
      dob: "1970-08-22",
      mrn: "MRN005678",
      age: 55,
      allergies: ["NKDA"],
      medications: ["Amlodipine 5mg daily", "Atorvastatin 20mg daily"],
      vitals: {
        bp: "142/88",
        temp: "98.2°F",
        pulse: "78 bpm",
        weight: "185 lbs",
        height: "5'10\""
      },
      insurance: "Medicare",
      lastVisit: "2025-07-10"
    },
    {
      name: "Sarah Williams",
      dob: "1996-11-08",
      mrn: "MRN009012",
      age: 28,
      allergies: ["Latex"],
      medications: ["Albuterol inhaler PRN"],
      vitals: {
        bp: "118/74",
        temp: "100.2°F",
        pulse: "88 bpm",
        weight: "140 lbs",
        height: "5'4\""
      },
      insurance: "Aetna",
      lastVisit: "2025-09-10"
    },
    {
      name: "John Smith",
      dob: "1980-05-15",
      mrn: "MRN003456",
      age: 45,
      allergies: ["Sulfa drugs"],
      medications: ["Metformin 1000mg BID", "Lisinopril 20mg daily"],
      vitals: {
        bp: "145/92",
        temp: "98.4°F",
        pulse: "76 bpm",
        weight: "220 lbs",
        height: "6'0\""
      },
      insurance: "UnitedHealth",
      lastVisit: "2025-08-22"
    },
    {
      name: "Lisa Anderson",
      dob: "1988-12-03",
      mrn: "MRN007890",
      age: 35,
      allergies: ["NKDA"],
      medications: ["Prenatal vitamins daily"],
      vitals: {
        bp: "110/70",
        temp: "98.4°F",
        pulse: "68 bpm",
        weight: "150 lbs",
        height: "5'5\""
      },
      insurance: "Cigna",
      lastVisit: "2025-08-01"
    },
    {
      name: "Robert Davis",
      dob: "1961-07-18",
      mrn: "MRN011111",
      age: 62,
      allergies: ["Aspirin"],
      medications: ["Metoprolol 50mg BID", "Clopidogrel 75mg daily"],
      vitals: {
        bp: "135/85",
        temp: "98.1°F",
        pulse: "65 bpm",
        weight: "195 lbs",
        height: "5'11\""
      },
      insurance: "Medicare Advantage",
      lastVisit: "2025-09-01"
    }
  ],
  inboxItems: [
    {
      id: 1,
      type: "Critical Alert",
      priority: "High",
      subject: "Abnormal Lab Results - Maria Garcia",
      message: "Creatinine elevated to 2.1 mg/dL (Normal: 0.6-1.2)",
      timestamp: "2 hours ago",
      status: "Unread",
      category: "Clinical"
    },
    {
      id: 2,
      type: "Task",
      priority: "Medium",
      subject: "Prior Authorization - David Chen",
      message: "MRI brain needs insurance approval",
      timestamp: "1 day ago",
      status: "Pending",
      category: "Administrative"
    },
    {
      id: 3,
      type: "Message",
      priority: "Low",
      subject: "Patient Portal Message - Sarah Williams",
      message: "Question about medication timing",
      timestamp: "3 hours ago",
      status: "Unread",
      category: "Messages"
    },
    {
      id: 4,
      type: "Alert",
      priority: "High",
      subject: "Drug Interaction Warning - John Smith",
      message: "Potential interaction between newly prescribed medication",
      timestamp: "4 hours ago",
      status: "Acknowledged",
      category: "Clinical"
    },
    {
      id: 5,
      type: "Task",
      priority: "Medium",
      subject: "Insurance Verification - Lisa Anderson",
      message: "Verify insurance eligibility before appointment",
      timestamp: "6 hours ago",
      status: "Pending",
      category: "Administrative"
    }
  ],
  aiInsights: [
    {
      type: "warning",
      title: "High No-Show Risk",
      message: "Patient John Smith (9:30 AM) has a 75% no-show probability based on history.",
      action: "Send reminder text",
      severity: "medium"
    },
    {
      type: "suggestion",
      title: "Scheduling Optimization",
      message: "Consider moving the 10:30 AM follow-up to optimize patient flow.",
      action: "Accept Suggestion",
      severity: "low"
    },
    {
      type: "alert",
      title: "Critical Lab Alert",
      message: "Maria Garcia has a new critical lab result requiring immediate review.",
      action: "View Result Now",
      severity: "high"
    }
  ],
  providers: [
    {
      name: "Dr. Sarah Johnson",
      initials: "SJ",
      status: "active",
      specialty: "Family Medicine"
    },
    {
      name: "Dr. Ben Carter",
      initials: "BC", 
      status: "available",
      specialty: "Internal Medicine"
    },
    {
      name: "Dr. Emily Rodriguez",
      initials: "ER",
      status: "busy",
      specialty: "Pediatrics"
    }
  ]
};

// Sub-navigation configurations
const subNavConfigs = {
  schedule: ['Day View', 'Week View', 'Month View', 'List View'],
  patient: ['Office Visit', 'Chart Review', 'Orders', 'Results', 'Documents'],
  inbox: ['Clinical', 'Administrative', 'Messages', 'Tasks', 'Alerts'],
  calendar: ['Month', 'Week', 'Day', 'Agenda'],
  admin: ['Users', 'Reports', 'Settings', 'Billing']
};

// Application State
let currentTab = 'schedule';
let currentSubTab = 'Day View';
let selectedPatient = null;
let currentDate = new Date();
let panelSizes = {
  left: 25,
  center: 50,
  right: 25
};

// Global functions for window scope
window.checkInPatient = function(appointmentId) {
  const appointment = appData.appointments.find(a => a.id == appointmentId);
  if (appointment) {
    if (appointment.status === 'Scheduled' || appointment.status === 'Confirmed') {
      appointment.status = 'Checked In';
    } else if (appointment.status === 'Checked In') {
      appointment.status = 'In Room';
    }
    renderScheduleInterface();
    renderLeftPanel();
    showNotification(`Patient ${appointment.patient.name} status updated to ${appointment.status}`);
  }
};

window.selectPatientFromAppointment = function(mrn) {
  selectPatient(mrn);
};

window.acknowledgeInboxItem = function(itemId) {
  const item = appData.inboxItems.find(i => i.id == itemId);
  if (item) {
    item.status = 'Acknowledged';
    renderInboxInterface();
    showNotification(`${item.type} acknowledged`);
  }
};

window.delegateInboxItem = function(itemId) {
  showNotification('Item delegated to staff');
};

window.snoozeInboxItem = function(itemId) {
  showNotification('Item snoozed for later review');
};

window.handleInsightAction = function(action) {
  showNotification(`${action} executed`);
};

window.showNotification = function(message) {
  showNotification(message);
};

// DOM Elements
let elements = {};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeDOM();
  initializeApp();
});

function initializeDOM() {
  elements = {
    navTabs: document.querySelectorAll('.nav-tab'),
    subNav: document.getElementById('subNav'),
    interfaces: document.querySelectorAll('.interface'),
    patientSearch: document.getElementById('patientSearch'),
    searchResults: document.getElementById('searchResults'),
    profileBtn: document.getElementById('profileBtn'),
    profileDropdown: document.getElementById('profileDropdown'),
    scheduleContent: document.getElementById('scheduleContent'),
    patientBanner: document.getElementById('patientBanner'),
    patientContent: document.getElementById('patientContent'),
    inboxContent: document.getElementById('inboxContent'),
    leftPanel: document.getElementById('leftPanel'),
    centerPanel: document.getElementById('centerPanel'),
    rightPanel: document.getElementById('rightPanel'),
    leftPanelContent: document.getElementById('leftPanelContent'),
    rightPanelContent: document.getElementById('rightPanelContent'),
    contextMenu: document.getElementById('contextMenu'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    datePicker: document.getElementById('datePicker'),
    prevDay: document.getElementById('prevDay'),
    nextDay: document.getElementById('nextDay'),
    jumpToday: document.getElementById('jumpToday'),
    roomViewToggle: document.getElementById('roomViewToggle'),
    calendarContent: document.getElementById('calendarContent'),
    adminContent: document.getElementById('adminContent'),
    aiInsights: document.getElementById('aiInsights')
  };
}

function initializeApp() {
  setupEventListeners();
  setupDatePicker();
  updateScheduleMetrics();
  renderSubNavigation();
  renderScheduleInterface();
  renderLeftPanel();
  renderRightPanel();
  setupPanelResize();
  
  // Initialize with default patient
  selectedPatient = appData.patients[0];
}

function setupEventListeners() {
  // Main Navigation - Fixed with proper event delegation
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-tab')) {
      e.preventDefault();
      const tabName = e.target.getAttribute('data-tab');
      if (tabName) {
        switchTab(tabName);
      }
    }
  });

  // Patient Search - Fixed
  if (elements.patientSearch) {
    elements.patientSearch.addEventListener('input', handlePatientSearch);
    elements.patientSearch.addEventListener('focus', () => {
      if (elements.patientSearch.value.length >= 2) {
        elements.searchResults.classList.remove('hidden');
      }
    });
  }

  // Profile Dropdown
  if (elements.profileBtn) {
    elements.profileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleProfileDropdown();
    });
  }
  
  document.addEventListener('click', (e) => {
    if (elements.profileBtn && !elements.profileBtn.contains(e.target)) {
      elements.profileDropdown.classList.add('hidden');
    }
    if (elements.patientSearch && elements.searchResults && 
        !elements.patientSearch.contains(e.target) && !elements.searchResults.contains(e.target)) {
      elements.searchResults.classList.add('hidden');
    }
  });

  // Date Navigation - Fixed
  if (elements.prevDay) {
    elements.prevDay.addEventListener('click', () => navigateDate(-1));
  }
  if (elements.nextDay) {
    elements.nextDay.addEventListener('click', () => navigateDate(1));
  }
  if (elements.jumpToday) {
    elements.jumpToday.addEventListener('click', jumpToToday);
  }
  if (elements.datePicker) {
    elements.datePicker.addEventListener('change', handleDateChange);
  }

  // Room View Toggle - Fixed
  if (elements.roomViewToggle) {
    elements.roomViewToggle.addEventListener('click', toggleRoomView);
  }

  // Panel Collapse
  document.querySelectorAll('.panel__collapse').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const panel = e.target.closest('button').getAttribute('data-panel');
      if (panel) {
        togglePanelCollapse(panel);
      }
    });
  });

  // Context Menu
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', () => {
    if (elements.contextMenu) {
      elements.contextMenu.classList.add('hidden');
    }
  });

  // Calendar navigation - Fixed
  document.addEventListener('click', function(e) {
    if (e.target.id === 'calPrevMonth') {
      navigateCalendar(-1);
    } else if (e.target.id === 'calNextMonth') {
      navigateCalendar(1);
    }
  });
}

function setupDatePicker() {
  if (elements.datePicker) {
    elements.datePicker.value = currentDate.toISOString().split('T')[0];
  }
}

function updateScheduleMetrics() {
  const totalAppointments = document.getElementById('totalAppointments');
  const noShowRate = document.getElementById('noShowRate');
  const timeUntilNext = document.getElementById('timeUntilNext');
  const providerStatus = document.getElementById('providerStatus');
  
  if (totalAppointments) totalAppointments.textContent = appData.scheduleMetrics.totalAppointments;
  if (noShowRate) noShowRate.textContent = appData.scheduleMetrics.noShowRate + '%';
  if (timeUntilNext) timeUntilNext.textContent = appData.scheduleMetrics.timeUntilNext;
  if (providerStatus) providerStatus.textContent = appData.scheduleMetrics.providerStatus;
  
  // Update inbox counters
  const criticalAlerts = document.getElementById('criticalAlerts');
  const overdueTasks = document.getElementById('overdueTasks');
  const unprocessedResults = document.getElementById('unprocessedResults');
  const pendingSignatures = document.getElementById('pendingSignatures');
  
  if (criticalAlerts) criticalAlerts.textContent = appData.systemStatus.criticalAlerts;
  if (overdueTasks) overdueTasks.textContent = '4';
  if (unprocessedResults) unprocessedResults.textContent = '7';
  if (pendingSignatures) pendingSignatures.textContent = '3';
}

function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  // Update active tab
  elements.navTabs.forEach(tab => {
    tab.classList.remove('nav-tab--active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('nav-tab--active');
    }
  });

  // Hide all interfaces
  elements.interfaces.forEach(interface => {
    interface.classList.add('hidden');
  });
  
  // Show target interface
  const targetInterface = document.getElementById(`${tabName}Interface`);
  if (targetInterface) {
    targetInterface.classList.remove('hidden');
  }

  // Update current tab and render sub-navigation
  currentTab = tabName;
  currentSubTab = subNavConfigs[tabName] ? subNavConfigs[tabName][0] : null;
  renderSubNavigation();
  renderLeftPanel();

  // Load interface-specific content
  switch(tabName) {
    case 'schedule':
      renderScheduleInterface();
      break;
    case 'patient':
      renderPatientInterface();
      break;
    case 'inbox':
      renderInboxInterface();
      break;
    case 'calendar':
      renderCalendarInterface();
      break;
    case 'admin':
      renderAdminInterface();
      break;
  }
  
  showNotification(`Switched to ${tabName} interface`);
}

function renderSubNavigation() {
  if (!subNavConfigs[currentTab] || !elements.subNav) {
    if (elements.subNav) elements.subNav.innerHTML = '';
    return;
  }

  const subTabs = subNavConfigs[currentTab].map(subTab => `
    <button class="sub-nav-tab ${subTab === currentSubTab ? 'sub-nav-tab--active' : ''}" 
            data-subtab="${subTab}">
      ${subTab}
    </button>
  `).join('');

  elements.subNav.innerHTML = subTabs;

  // Add event listeners to sub-tabs using event delegation
  elements.subNav.addEventListener('click', function(e) {
    if (e.target.classList.contains('sub-nav-tab')) {
      e.preventDefault();
      const subTabName = e.target.getAttribute('data-subtab');
      if (subTabName) {
        switchSubTab(subTabName);
      }
    }
  });
}

function switchSubTab(subTabName) {
  console.log('Switching to sub-tab:', subTabName);
  currentSubTab = subTabName;
  
  // Update active sub-tab
  const subNavTabs = elements.subNav.querySelectorAll('.sub-nav-tab');
  subNavTabs.forEach(tab => {
    tab.classList.remove('sub-nav-tab--active');
    if (tab.dataset.subtab === subTabName) {
      tab.classList.add('sub-nav-tab--active');
    }
  });

  // Handle sub-tab specific logic based on current main tab
  switch(currentTab) {
    case 'schedule':
      renderScheduleInterface();
      break;
    case 'patient':
      renderPatientInterface();
      break;
    case 'inbox':
      renderInboxInterface();
      break;
    case 'calendar':
      renderCalendarInterface();
      break;
    case 'admin':
      renderAdminInterface();
      break;
  }
  
  showNotification(`Switched to ${subTabName} view`);
}

function handlePatientSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (query.length < 2) {
    elements.searchResults.classList.add('hidden');
    elements.searchResults.innerHTML = '';
    return;
  }

  const matches = appData.patients.filter(patient => 
    patient.name.toLowerCase().includes(query) ||
    patient.mrn.toLowerCase().includes(query)
  );

  renderSearchResults(matches);
}

function renderSearchResults(patients) {
  if (patients.length === 0) {
    elements.searchResults.innerHTML = '<div class="search-result-item">No patients found</div>';
  } else {
    elements.searchResults.innerHTML = patients.map(patient => `
      <div class="search-result-item" data-mrn="${patient.mrn}">
        <div><strong>${patient.name}</strong></div>
        <div style="font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.6);">
          ${patient.mrn} • DOB: ${new Date(patient.dob).toLocaleDateString()}
        </div>
      </div>
    `).join('');

    // Add click handlers using event delegation
    elements.searchResults.addEventListener('click', function(e) {
      const resultItem = e.target.closest('.search-result-item');
      if (resultItem) {
        e.preventDefault();
        const mrn = resultItem.getAttribute('data-mrn');
        selectPatient(mrn);
        elements.searchResults.classList.add('hidden');
        elements.patientSearch.value = '';
      }
    });
  }

  elements.searchResults.classList.remove('hidden');
}

function selectPatient(mrn) {
  selectedPatient = appData.patients.find(p => p.mrn === mrn);
  if (selectedPatient) {
    switchTab('patient');
    showNotification(`Selected patient: ${selectedPatient.name}`);
  }
}

function toggleProfileDropdown() {
  if (elements.profileDropdown) {
    elements.profileDropdown.classList.toggle('hidden');
  }
}

function renderScheduleInterface() {
  if (!elements.scheduleContent) return;
  
  if (currentSubTab === 'List View') {
    renderScheduleListView();
    return;
  }
  
  if (currentSubTab === 'Week View') {
    renderWeekView();
    return;
  }
  
  if (currentSubTab === 'Month View') {
    renderMonthView();
    return;
  }

  // Default Day View
  const appointmentsHtml = appData.appointments.map(appointment => {
    const statusClass = getStatusClass(appointment.status);
    const priorityClass = appointment.priority === 'urgent' ? 'appointment-card--urgent' : 
                         appointment.priority === 'high' ? 'appointment-card--high' : '';
    
    return `
      <div class="appointment-card ${priorityClass}" data-appointment-id="${appointment.id}">
        <div class="appointment-status">
          <span class="status ${statusClass}">${appointment.status}</span>
        </div>
        <div class="appointment-time">${appointment.time}</div>
        <div class="patient-info">
          <div class="patient-name">${appointment.patient.name}</div>
          <div class="patient-details">
            <span>Age: ${appointment.patient.age}</span>
            <span>${appointment.patient.mrn}</span>
          </div>
        </div>
        <div class="appointment-type">${appointment.reason}</div>
        <div style="font-size: var(--font-size-sm); color: rgba(255, 255, 255, 0.7); margin-bottom: var(--space-8);">
          ${appointment.room} • ${appointment.patient.type}
        </div>
        <div class="appointment-actions">
          <button class="btn btn--sm btn--primary" onclick="checkInPatient('${appointment.id}')">
            ${appointment.status === 'Scheduled' || appointment.status === 'Confirmed' ? 'Check In' : 'Start Visit'}
          </button>
          <button class="btn btn--sm btn--secondary" onclick="selectPatientFromAppointment('${appointment.patient.mrn}')">
            Chart Review
          </button>
        </div>
      </div>
    `;
  }).join('');

  elements.scheduleContent.innerHTML = appointmentsHtml;
}

function renderScheduleListView() {
  const listHtml = `
    <div style="padding: var(--space-16); background-color: var(--ignite-dark);">
      <table style="width: 100%; border-collapse: collapse; background-color: var(--ignite-dark-card); border-radius: var(--radius-lg); overflow: hidden;">
        <thead>
          <tr style="background-color: var(--ignite-gray); color: var(--ignite-white);">
            <th style="text-align: left; padding: var(--space-12); font-weight: var(--font-weight-semibold);">Time</th>
            <th style="text-align: left; padding: var(--space-12); font-weight: var(--font-weight-semibold);">Patient</th>
            <th style="text-align: left; padding: var(--space-12); font-weight: var(--font-weight-semibold);">Reason</th>
            <th style="text-align: left; padding: var(--space-12); font-weight: var(--font-weight-semibold);">Room</th>
            <th style="text-align: left; padding: var(--space-12); font-weight: var(--font-weight-semibold);">Status</th>
            <th style="text-align: left; padding: var(--space-12); font-weight: var(--font-weight-semibold);">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${appData.appointments.map(apt => `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); transition: background-color var(--duration-fast);" 
                onmouseover="this.style.backgroundColor='rgba(255, 107, 53, 0.1)'" 
                onmouseout="this.style.backgroundColor='transparent'">
              <td style="padding: var(--space-12); color: var(--ignite-primary); font-weight: var(--font-weight-semibold);">${apt.time}</td>
              <td style="padding: var(--space-12);">
                <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">${apt.patient.name}</div>
                <div style="font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.7);">${apt.patient.mrn} • Age ${apt.patient.age}</div>
              </td>
              <td style="padding: var(--space-12); color: rgba(255, 255, 255, 0.8);">${apt.reason}</td>
              <td style="padding: var(--space-12); color: rgba(255, 255, 255, 0.8);">${apt.room}</td>
              <td style="padding: var(--space-12);">
                <span class="status ${getStatusClass(apt.status)}">${apt.status}</span>
              </td>
              <td style="padding: var(--space-12);">
                <button class="btn btn--sm btn--primary" onclick="checkInPatient('${apt.id}')" style="margin-right: var(--space-4);">
                  ${apt.status === 'Scheduled' || apt.status === 'Confirmed' ? 'Check In' : 'Start Visit'}
                </button>
                <button class="btn btn--sm btn--secondary" onclick="selectPatientFromAppointment('${apt.patient.mrn}')">
                  Chart
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  elements.scheduleContent.innerHTML = listHtml;
}

function renderWeekView() {
  const weekHtml = `
    <div style="padding: var(--space-16); background-color: var(--ignite-dark);">
      <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-lg); padding: var(--space-16);">
        <h3 style="color: var(--ignite-white); margin-bottom: var(--space-16);">Week of September 8-14, 2025</h3>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: var(--space-8);">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => `
            <div style="border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-base); padding: var(--space-8);">
              <h4 style="color: var(--ignite-primary); margin-bottom: var(--space-8); text-align: center;">${day}</h4>
              <div style="min-height: 200px;">
                ${index < 5 ? `
                  <div style="background-color: rgba(255, 107, 53, 0.1); border-left: 3px solid var(--ignite-primary); padding: var(--space-4); margin-bottom: var(--space-4); border-radius: var(--radius-sm);">
                    <div style="font-size: var(--font-size-xs); color: var(--ignite-primary); font-weight: var(--font-weight-semibold);">8:00 AM</div>
                    <div style="font-size: var(--font-size-sm); color: var(--ignite-white);">Physical Exam</div>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  elements.scheduleContent.innerHTML = weekHtml;
}

function renderMonthView() {
  const monthHtml = `
    <div style="padding: var(--space-16); background-color: var(--ignite-dark);">
      <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-lg); padding: var(--space-16);">
        <h3 style="color: var(--ignite-white); margin-bottom: var(--space-16);">September 2025</h3>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background-color: rgba(255, 255, 255, 0.1);">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `
            <div style="background-color: var(--ignite-gray); padding: var(--space-8); text-align: center; font-weight: var(--font-weight-semibold); color: var(--ignite-white);">${day}</div>
          `).join('')}
          ${Array.from({length: 30}, (_, i) => `
            <div style="background-color: var(--ignite-dark-card); padding: var(--space-8); min-height: 80px; border: 1px solid rgba(255, 255, 255, 0.05);">
              <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium); margin-bottom: var(--space-4);">${i + 1}</div>
              ${i === 9 ? '<div style="background-color: rgba(255, 107, 53, 0.2); padding: var(--space-2); border-radius: var(--radius-sm); font-size: var(--font-size-xs); color: var(--ignite-primary);">18 appts</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  elements.scheduleContent.innerHTML = monthHtml;
}

function renderPatientInterface() {
  if (!selectedPatient) {
    selectedPatient = appData.patients[0];
  }

  const patient = selectedPatient;
  
  const bannerHtml = `
    <div class="patient-header">
      <div class="patient-primary-info">
        <h2>${patient.name}</h2>
        <div class="patient-demographics">
          DOB: ${new Date(patient.dob).toLocaleDateString()} • 
          MRN: ${patient.mrn} • 
          Insurance: ${patient.insurance} • 
          Last Visit: ${new Date(patient.lastVisit).toLocaleDateString()}
        </div>
        <div class="patient-alerts">
          ${patient.allergies.length > 0 && patient.allergies[0] !== 'NKDA' ? patient.allergies.map(allergy => `
            <span class="alert-badge alert-badge--allergy">⚠️ Allergy: ${allergy}</span>
          `).join('') : '<span style="color: var(--ignite-success); font-size: var(--font-size-sm);">✓ No Known Allergies</span>'}
        </div>
      </div>
      <div class="patient-vitals">
        <div class="vital-item">
          <span class="vital-label">Blood Pressure</span>
          <span class="vital-value">${patient.vitals.bp}</span>
        </div>
        <div class="vital-item">
          <span class="vital-label">Temperature</span>
          <span class="vital-value">${patient.vitals.temp}</span>
        </div>
        <div class="vital-item">
          <span class="vital-label">Pulse</span>
          <span class="vital-value">${patient.vitals.pulse}</span>
        </div>
        <div class="vital-item">
          <span class="vital-label">Weight</span>
          <span class="vital-value">${patient.vitals.weight}</span>
        </div>
        ${patient.vitals.height ? `
        <div class="vital-item">
          <span class="vital-label">Height</span>
          <span class="vital-value">${patient.vitals.height}</span>
        </div>
        ` : ''}
      </div>
    </div>
  `;

  if (elements.patientBanner) {
    elements.patientBanner.innerHTML = bannerHtml;
  }

  let contentHtml = '';
  
  switch(currentSubTab) {
    case 'Office Visit':
      contentHtml = `
        <div class="documentation-area">
          <h3>Office Visit Documentation</h3>
          <div style="margin-bottom: var(--space-16);">
            <div style="display: flex; gap: var(--space-8); margin-bottom: var(--space-8);">
              <button class="btn btn--sm btn--primary">Chief Complaint</button>
              <button class="btn btn--sm btn--secondary">HPI</button>
              <button class="btn btn--sm btn--secondary">ROS</button>
              <button class="btn btn--sm btn--secondary">Physical Exam</button>
            </div>
          </div>
          <textarea class="form-control" rows="12" placeholder="Document the office visit..." style="margin-bottom: var(--space-16);">${patient.name} presents for follow-up visit. Patient reports...</textarea>
          
          <div class="order-management">
            <h4>Current Medications</h4>
            <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12); margin-bottom: var(--space-16);">
              ${patient.medications.map(med => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-6) 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                  <span style="color: var(--ignite-white);">${med}</span>
                  <div>
                    <button class="btn btn--sm btn--outline" style="margin-right: var(--space-4);">Edit</button>
                    <button class="btn btn--sm btn--secondary">Renew</button>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <h4>Orders & Actions</h4>
            <div class="order-actions">
              <button class="btn btn--sm btn--primary">✓ Sign Orders</button>
              <button class="btn btn--sm btn--warning">⏸ Pend for Review</button>
              <button class="btn btn--sm btn--secondary">📋 Order Sets</button>
              <button class="btn btn--sm btn--outline">🔬 Lab Orders</button>
            </div>
          </div>
        </div>
      `;
      break;
    case 'Chart Review':
      contentHtml = `
        <div class="chart-review">
          <h3>Chart Review - ${patient.name}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16);">
            <div class="chart-section">
              <h4>Recent Visits</h4>
              <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12);">
                <div class="visit-item" style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: var(--space-8) 0;">
                  <div style="font-weight: var(--font-weight-semibold); color: var(--ignite-white);">${new Date(patient.lastVisit).toLocaleDateString()} - Follow-up Visit</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">Blood pressure well controlled, continue current medications</div>
                </div>
                <div class="visit-item" style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: var(--space-8) 0;">
                  <div style="font-weight: var(--font-weight-semibold); color: var(--ignite-white);">08/15/25 - Annual Physical</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">Routine physical examination, labs ordered</div>
                </div>
                <div class="visit-item" style="padding: var(--space-8) 0;">
                  <div style="font-weight: var(--font-weight-semibold); color: var(--ignite-white);">07/20/25 - Lab Review</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">A1C improving, lipid panel within normal limits</div>
                </div>
              </div>
            </div>
            
            <div class="chart-section">
              <h4>Problem List</h4>
              <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12);">
                <div style="padding: var(--space-6) 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                  <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">Hypertension</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">Well controlled on current therapy</div>
                </div>
                <div style="padding: var(--space-6) 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                  <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">Type 2 Diabetes</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">A1C target achieved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
    case 'Orders':
      contentHtml = `
        <div class="orders-section">
          <h3>Orders - ${patient.name}</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16);">
            <div>
              <h4>Pending Orders</h4>
              <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12);">
                <div class="order-item" style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: var(--space-8) 0;">
                  <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">Lab: Basic Metabolic Panel</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">Status: Pending</div>
                </div>
                <div class="order-item" style="padding: var(--space-8) 0;">
                  <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">Prescription: Lisinopril refill</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">Status: Sent to pharmacy</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4>New Order</h4>
              <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12);">
                <select class="form-control" style="margin-bottom: var(--space-12);">
                  <option>Select Order Type</option>
                  <option>Laboratory</option>
                  <option>Radiology</option>
                  <option>Prescription</option>
                  <option>Referral</option>
                </select>
                <button class="btn btn--primary" style="width: 100%;">Create Order</button>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
    case 'Results':
      contentHtml = `
        <div class="results-section">
          <h3>Lab Results - ${patient.name}</h3>
          <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-16);">
            <div class="result-item" style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: var(--space-12); margin-bottom: var(--space-12);">
              <div class="result-header">
                <strong style="color: var(--ignite-white);">Basic Metabolic Panel</strong> - 09/05/25
                <span class="status status--warning">Abnormal</span>
              </div>
              <div class="result-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8);">
                <div style="color: rgba(255, 255, 255, 0.8);">Glucose: 125 mg/dL <span style="color: var(--ignite-warning);">(High - Normal: 70-99)</span></div>
                <div style="color: rgba(255, 255, 255, 0.8);">Creatinine: 1.8 mg/dL <span style="color: var(--ignite-warning);">(High - Normal: 0.7-1.3)</span></div>
                <div style="color: rgba(255, 255, 255, 0.8);">BUN: 22 mg/dL <span style="color: var(--ignite-warning);">(High - Normal: 7-20)</span></div>
                <div style="color: rgba(255, 255, 255, 0.8);">Sodium: 140 mEq/L <span style="color: var(--ignite-success);">(Normal: 136-145)</span></div>
              </div>
            </div>
            
            <div class="result-item">
              <div class="result-header">
                <strong style="color: var(--ignite-white);">Lipid Panel</strong> - 08/15/25
                <span class="status status--success">Normal</span>
              </div>
              <div class="result-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8);">
                <div style="color: rgba(255, 255, 255, 0.8);">Total Cholesterol: 185 mg/dL <span style="color: var(--ignite-success);">(Normal: <200)</span></div>
                <div style="color: rgba(255, 255, 255, 0.8);">HDL: 58 mg/dL <span style="color: var(--ignite-success);">(Normal: >40)</span></div>
                <div style="color: rgba(255, 255, 255, 0.8);">LDL: 112 mg/dL <span style="color: var(--ignite-success);">(Normal: <130)</span></div>
                <div style="color: rgba(255, 255, 255, 0.8);">Triglycerides: 95 mg/dL <span style="color: var(--ignite-success);">(Normal: <150)</span></div>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
    case 'Documents':
      contentHtml = `
        <div class="documents-section">
          <h3>Documents - ${patient.name}</h3>
          <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-16);">
            <div class="document-list">
              <div class="document-item" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8) 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <div>
                  <div class="document-name" style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">Consent for Treatment</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">Signed consent form</div>
                </div>
                <div class="document-date" style="color: rgba(255, 255, 255, 0.7);">09/01/25</div>
              </div>
              <div class="document-item" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8) 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <div>
                  <div class="document-name" style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">Insurance Card Copy</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">Front and back copies</div>
                </div>
                <div class="document-date" style="color: rgba(255, 255, 255, 0.7);">08/15/25</div>
              </div>
              <div class="document-item" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8) 0;">
                <div>
                  <div class="document-name" style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">Referral Letter</div>
                  <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">Cardiology referral</div>
                </div>
                <div class="document-date" style="color: rgba(255, 255, 255, 0.7);">07/20/25</div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: var(--space-16); display: flex; gap: var(--space-8);">
            <button class="btn btn--primary">Upload New Document</button>
            <button class="btn btn--secondary">Scan Document</button>
            <button class="btn btn--outline">Import from Portal</button>
          </div>
        </div>
      `;
      break;
    default:
      contentHtml = `
        <div class="documentation-area">
          <h3>Patient Overview</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16);">
            <div>
              <h4>Current Medications</h4>
              <ul style="margin-bottom: var(--space-16); list-style: none; padding: 0;">
                ${patient.medications.map(med => `<li style="color: var(--ignite-white); margin-bottom: var(--space-4);">• ${med}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h4>Recent Activity</h4>
              <div style="color: rgba(255, 255, 255, 0.8);">
                <div style="margin-bottom: var(--space-4);">Last visit: ${new Date(patient.lastVisit).toLocaleDateString()}</div>
                <div style="margin-bottom: var(--space-4);">Next appointment: Not scheduled</div>
                <div>Care plan: Up to date</div>
              </div>
            </div>
          </div>
        </div>
      `;
  }

  if (elements.patientContent) {
    elements.patientContent.innerHTML = contentHtml;
  }
}

function renderInboxInterface() {
  if (!elements.inboxContent) return;
  
  let filteredItems = appData.inboxItems;

  // Filter by current sub-tab
  if (currentSubTab !== 'Clinical') {
    const filterMap = {
      'Administrative': ['Task'],
      'Messages': ['Message'],
      'Tasks': ['Task'],
      'Alerts': ['Alert', 'Critical Alert']
    };
    
    if (filterMap[currentSubTab]) {
      filteredItems = appData.inboxItems.filter(item => 
        filterMap[currentSubTab].includes(item.type)
      );
    }
  }

  const inboxHtml = filteredItems.map(item => {
    const priorityClass = item.priority === 'High' ? 'inbox-item--critical' : 
                         item.status === 'Unread' ? 'inbox-item--unread' : '';
    const priorityColor = getPriorityColor(item.priority);
    
    return `
      <div class="inbox-item ${priorityClass}" data-item-id="${item.id}">
        <div class="inbox-header">
          <div class="inbox-type" style="color: var(--ignite-${priorityColor});">
            ${item.type.toUpperCase()}
          </div>
          <div class="inbox-timestamp">${item.timestamp}</div>
        </div>
        <div class="inbox-subject">${item.subject}</div>
        <div class="inbox-message">${item.message}</div>
        <div class="inbox-actions-row">
          <button class="btn btn--sm btn--primary" onclick="acknowledgeInboxItem('${item.id}')">
            ${item.type === 'Message' ? 'Quick Reply' : 'Acknowledge'}
          </button>
          <button class="btn btn--sm btn--secondary" onclick="delegateInboxItem('${item.id}')">
            ${item.type === 'Task' ? 'Delegate' : 'Forward'}
          </button>
          <button class="btn btn--sm btn--outline" onclick="snoozeInboxItem('${item.id}')">
            ${item.type === 'Alert' ? 'Dismiss' : 'Snooze'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  elements.inboxContent.innerHTML = inboxHtml || '<div style="text-align: center; padding: var(--space-24); color: rgba(255, 255, 255, 0.6);">No items in this category</div>';
}

function renderCalendarInterface() {
  const calendarInterface = document.getElementById('calendarInterface');
  if (calendarInterface && !calendarInterface.classList.contains('hidden')) {
    if (elements.calendarContent) {
      const calendarHtml = `
        <div style="padding: var(--space-16); background-color: var(--ignite-dark);">
          <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-lg); padding: var(--space-16);">
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background-color: rgba(255, 255, 255, 0.1);">
              ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => `
                <div style="background-color: var(--ignite-gray); padding: var(--space-12); text-align: center; font-weight: var(--font-weight-semibold); color: var(--ignite-white);">${day}</div>
              `).join('')}
              ${generateCalendarDays()}
            </div>
          </div>
        </div>
      `;
      elements.calendarContent.innerHTML = calendarHtml;
    }
  }
}

function generateCalendarDays() {
  return Array.from({length: 35}, (_, i) => {
    const day = i - 2; // Start calendar on Sunday
    const isToday = day === 10;
    const hasAppointments = day === 10 || day === 11 || day === 12;
    
    return `
      <div style="background-color: var(--ignite-dark-card); padding: var(--space-8); min-height: 100px; border: 1px solid rgba(255, 255, 255, 0.05); ${isToday ? 'border-color: var(--ignite-primary);' : ''}">
        <div style="color: ${isToday ? 'var(--ignite-primary)' : 'var(--ignite-white)'}; font-weight: ${isToday ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)'}; margin-bottom: var(--space-4);">${day > 0 && day <= 30 ? day : ''}</div>
        ${hasAppointments && day > 0 && day <= 30 ? `
          <div style="background-color: rgba(255, 107, 53, 0.2); padding: var(--space-2); border-radius: var(--radius-sm); font-size: var(--font-size-xs); color: var(--ignite-primary); margin-bottom: var(--space-2);">
            ${day === 10 ? '18 appointments' : day === 11 ? '12 appointments' : '8 appointments'}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderAdminInterface() {
  const adminInterface = document.getElementById('adminInterface');
  if (adminInterface && !adminInterface.classList.contains('hidden')) {
    if (elements.adminContent) {
      let content = '';
      
      switch(currentSubTab) {
        case 'Users':
          content = `
            <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-lg); padding: var(--space-16); margin-bottom: var(--space-16);">
              <h3 style="color: var(--ignite-white); margin-bottom: var(--space-16);">User Management</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-16);">
                ${appData.providers.map(provider => `
                  <div style="background-color: var(--ignite-gray); border-radius: var(--radius-base); padding: var(--space-12); border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; align-items: center; gap: var(--space-8); margin-bottom: var(--space-8);">
                      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--ignite-primary) 0%, var(--ignite-primary-hover) 100%); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--ignite-white); font-weight: var(--font-weight-bold);">${provider.initials}</div>
                      <div>
                        <div style="color: var(--ignite-white); font-weight: var(--font-weight-semibold);">${provider.name}</div>
                        <div style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">${provider.specialty}</div>
                      </div>
                    </div>
                    <div style="display: flex; justify-content: between; align-items: center;">
                      <span class="status ${provider.status === 'active' ? 'status--success' : provider.status === 'available' ? 'status--info' : 'status--warning'}">${provider.status}</span>
                      <button class="btn btn--sm btn--outline" style="margin-left: auto;">Edit</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
          break;
        case 'Reports':
          content = `
            <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-lg); padding: var(--space-16);">
              <h3 style="color: var(--ignite-white); margin-bottom: var(--space-16);">System Reports</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-16);">
                <div style="background-color: var(--ignite-gray); border-radius: var(--radius-base); padding: var(--space-16); border: 1px solid rgba(255, 255, 255, 0.1);">
                  <h4 style="color: var(--ignite-primary); margin-bottom: var(--space-8);">Daily Activity</h4>
                  <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: var(--space-12);">Appointments, visits, and patient flow metrics</div>
                  <button class="btn btn--sm btn--primary">Generate Report</button>
                </div>
                <div style="background-color: var(--ignite-gray); border-radius: var(--radius-base); padding: var(--space-16); border: 1px solid rgba(255, 255, 255, 0.1);">
                  <h4 style="color: var(--ignite-primary); margin-bottom: var(--space-8);">Quality Measures</h4>
                  <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: var(--space-12);">Clinical quality and performance indicators</div>
                  <button class="btn btn--sm btn--primary">Generate Report</button>
                </div>
                <div style="background-color: var(--ignite-gray); border-radius: var(--radius-base); padding: var(--space-16); border: 1px solid rgba(255, 255, 255, 0.1);">
                  <h4 style="color: var(--ignite-primary); margin-bottom: var(--space-8);">Financial Summary</h4>
                  <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: var(--space-12);">Billing, payments, and revenue analytics</div>
                  <button class="btn btn--sm btn--primary">Generate Report</button>
                </div>
              </div>
            </div>
          `;
          break;
        case 'Settings':
          content = `
            <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-lg); padding: var(--space-16);">
              <h3 style="color: var(--ignite-white); margin-bottom: var(--space-16);">System Settings</h3>
              <div style="display: grid; gap: var(--space-16);">
                <div style="background-color: var(--ignite-gray); border-radius: var(--radius-base); padding: var(--space-16); border: 1px solid rgba(255, 255, 255, 0.1);">
                  <h4 style="color: var(--ignite-white); margin-bottom: var(--space-12);">Practice Information</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12);">
                    <div>
                      <label style="color: rgba(255, 255, 255, 0.7); display: block; margin-bottom: var(--space-4); font-size: var(--font-size-sm);">Practice Name</label>
                      <input type="text" class="form-control" value="IGNITE Health Systems">
                    </div>
                    <div>
                      <label style="color: rgba(255, 255, 255, 0.7); display: block; margin-bottom: var(--space-4); font-size: var(--font-size-sm);">NPI Number</label>
                      <input type="text" class="form-control" value="1234567890">
                    </div>
                  </div>
                </div>
                <div style="background-color: var(--ignite-gray); border-radius: var(--radius-base); padding: var(--space-16); border: 1px solid rgba(255, 255, 255, 0.1);">
                  <h4 style="color: var(--ignite-white); margin-bottom: var(--space-12);">Notification Preferences</h4>
                  <div style="display: flex; flex-direction: column; gap: var(--space-8);">
                    <label style="display: flex; align-items: center; gap: var(--space-8); color: rgba(255, 255, 255, 0.8);">
                      <input type="checkbox" checked> Email notifications for critical alerts
                    </label>
                    <label style="display: flex; align-items: center; gap: var(--space-8); color: rgba(255, 255, 255, 0.8);">
                      <input type="checkbox" checked> SMS reminders for appointments
                    </label>
                    <label style="display: flex; align-items: center; gap: var(--space-8); color: rgba(255, 255, 255, 0.8);">
                      <input type="checkbox"> Daily summary reports
                    </label>
                  </div>
                </div>
              </div>
            </div>
          `;
          break;
        default:
          content = `
            <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-lg); padding: var(--space-16);">
              <h3 style="color: var(--ignite-white); margin-bottom: var(--space-16);">Administrative Dashboard</h3>
              <p style="color: rgba(255, 255, 255, 0.8);">Select a category from the navigation to access administrative functions.</p>
            </div>
          `;
      }
      
      elements.adminContent.innerHTML = content;
    }
  }
}

function renderLeftPanel() {
  if (!elements.leftPanelContent) return;
  
  let content = '';
  
  switch(currentTab) {
    case 'schedule':
      content = `
        <div class="panel-section">
          <h4>Today's Summary</h4>
          <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12); margin-bottom: var(--space-12);">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-8); margin-bottom: var(--space-8);">
              <span style="color: rgba(255, 255, 255, 0.8);">📅 Total Appointments</span>
              <span style="color: var(--ignite-white); font-weight: var(--font-weight-semibold);">${appData.appointments.length}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-8); margin-bottom: var(--space-8);">
              <span style="color: rgba(255, 255, 255, 0.8);">✅ Checked In</span>
              <span style="color: var(--ignite-success); font-weight: var(--font-weight-semibold);">${appData.appointments.filter(a => a.status === 'Checked In').length}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-8); margin-bottom: var(--space-8);">
              <span style="color: rgba(255, 255, 255, 0.8);">🏥 In Room</span>
              <span style="color: var(--ignite-primary); font-weight: var(--font-weight-semibold);">${appData.appointments.filter(a => a.status === 'In Room').length}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-8);">
              <span style="color: rgba(255, 255, 255, 0.8);">❌ No Show</span>
              <span style="color: var(--ignite-error); font-weight: var(--font-weight-semibold);">${appData.appointments.filter(a => a.status === 'No Show').length}</span>
            </div>
          </div>
        </div>
        <div class="panel-section">
          <h4>Quick Actions</h4>
          <button class="btn btn--sm btn--primary" style="width: 100%; margin-bottom: var(--space-8);" onclick="showNotification('Add Appointment clicked')">➕ Add Appointment</button>
          <button class="btn btn--sm btn--secondary" style="width: 100%; margin-bottom: var(--space-8);" onclick="showNotification('Block Time clicked')">🚫 Block Time</button>
          <button class="btn btn--sm btn--outline" style="width: 100%;" onclick="showNotification('View Waitlist clicked')">📋 View Waitlist</button>
        </div>
        <div class="panel-section">
          <h4>Provider Status</h4>
          <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12);">
            ${appData.providers.map(provider => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-8);">
                <div>
                  <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium); font-size: var(--font-size-sm);">${provider.name.split(' ')[1]}</div>
                  <div style="color: rgba(255, 255, 255, 0.6); font-size: var(--font-size-xs);">${provider.specialty}</div>
                </div>
                <span class="status ${provider.status === 'active' ? 'status--success' : provider.status === 'available' ? 'status--info' : 'status--warning'}">${provider.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;
    case 'patient':
      content = `
        <div class="panel-section">
          <h4>Patient Navigation</h4>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <a href="#" class="nav-link" onclick="showNotification('Demographics clicked')">👤 Demographics</a>
            <a href="#" class="nav-link" onclick="showNotification('Problem List clicked')">📋 Problem List</a>
            <a href="#" class="nav-link" onclick="showNotification('Medications clicked')">💊 Medications</a>
            <a href="#" class="nav-link" onclick="showNotification('Allergies clicked')">⚠️ Allergies</a>
            <a href="#" class="nav-link" onclick="showNotification('Vital Signs clicked')">🩺 Vital Signs</a>
            <a href="#" class="nav-link" onclick="showNotification('Lab Results clicked')">🔬 Lab Results</a>
            <a href="#" class="nav-link" onclick="showNotification('Imaging clicked')">📷 Imaging</a>
          </div>
        </div>
        <div class="panel-section">
          <h4>Recent Notes</h4>
          <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12);">
            <div style="font-size: var(--font-size-sm); color: rgba(255, 255, 255, 0.8);">
              <div style="margin-bottom: var(--space-6); padding-bottom: var(--space-6); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">09/01/25 - Annual Physical</div>
                <div style="color: rgba(255, 255, 255, 0.6); font-size: var(--font-size-xs);">Dr. Johnson</div>
              </div>
              <div style="margin-bottom: var(--space-6); padding-bottom: var(--space-6); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">08/15/25 - Follow-up</div>
                <div style="color: rgba(255, 255, 255, 0.6); font-size: var(--font-size-xs);">Dr. Johnson</div>
              </div>
              <div>
                <div style="color: var(--ignite-white); font-weight: var(--font-weight-medium);">07/20/25 - Lab Review</div>
                <div style="color: rgba(255, 255, 255, 0.6); font-size: var(--font-size-xs);">Dr. Johnson</div>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
    case 'inbox':
      content = `
        <div class="panel-section">
          <h4>Inbox Filters</h4>
          <div style="display: flex; flex-direction: column; gap: var(--space-6);">
            <label style="display: flex; align-items: center; gap: var(--space-6); color: rgba(255, 255, 255, 0.8);">
              <input type="checkbox" checked> Unread Only
            </label>
            <label style="display: flex; align-items: center; gap: var(--space-6); color: rgba(255, 255, 255, 0.8);">
              <input type="checkbox"> High Priority
            </label>
            <label style="display: flex; align-items: center; gap: var(--space-6); color: rgba(255, 255, 255, 0.8);">
              <input type="checkbox"> Overdue
            </label>
            <label style="display: flex; align-items: center; gap: var(--space-6); color: rgba(255, 255, 255, 0.8);">
              <input type="checkbox"> My Tasks
            </label>
          </div>
        </div>
        <div class="panel-section">
          <h4>Quick Stats</h4>
          <div style="background-color: var(--ignite-dark-card); border-radius: var(--radius-base); padding: var(--space-12);">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-8); margin-bottom: var(--space-8);">
              <span style="color: rgba(255, 255, 255, 0.8); font-size: var(--font-size-sm);">📧 Unread Messages</span>
              <span style="color: var(--ignite-primary); font-weight: var(--font-weight-semibold);">${appData.inboxItems.filter(i => i.status === 'Unread').length}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-8); margin-bottom: var(--space-8);">
              <span style="color: rgba(255, 255, 255, 0.8); font-size: var(--font-size-sm);">⚠️ Critical Alerts</span>
              <span style="color: var(--ignite-error); font-weight: var(--font-weight-semibold);">${appData.inboxItems.filter(i => i.priority === 'High').length}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-8);">
              <span style="color: rgba(255, 255, 255, 0.8); font-size: var(--font-size-sm);">📋 Pending Tasks</span>
              <span style="color: var(--ignite-warning); font-weight: var(--font-weight-semibold);">${appData.inboxItems.filter(i => i.type === 'Task').length}</span>
            </div>
          </div>
        </div>
      `;
      break;
    default:
      content = `
        <div class="panel-section">
          <h4>${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Navigation</h4>
          <p style="color: rgba(255, 255, 255, 0.7); font-size: var(--font-size-sm);">
            Navigation options for ${currentTab} would appear here.
          </p>
        </div>
      `;
  }
  
  elements.leftPanelContent.innerHTML = content;
}

function renderRightPanel() {
  if (!elements.aiInsights) return;
  
  const insightsHtml = appData.aiInsights.map(insight => {
    const severityClass = insight.severity === 'high' ? 'insight-card--error' : 
                         insight.severity === 'medium' ? 'insight-card--warning' : '';
    
    return `
      <div class="insight-card ${severityClass}">
        <h4>${insight.title}</h4>
        <p>${insight.message}</p>
        <button class="insight-action-btn" onclick="handleInsightAction('${insight.action}')">${insight.action}</button>
      </div>
    `;
  }).join('');
  
  elements.aiInsights.innerHTML = insightsHtml;
}

function navigateDate(direction) {
  if (!elements.datePicker) return;
  const currentDate = new Date(elements.datePicker.value);
  currentDate.setDate(currentDate.getDate() + direction);
  elements.datePicker.value = currentDate.toISOString().split('T')[0];
  showNotification(`Date changed to ${currentDate.toLocaleDateString()}`);
}

function jumpToToday() {
  if (!elements.datePicker) return;
  const today = new Date();
  elements.datePicker.value = today.toISOString().split('T')[0];
  showNotification('Jumped to today');
}

function handleDateChange() {
  if (!elements.datePicker) return;
  const selectedDate = new Date(elements.datePicker.value);
  showNotification(`Viewing schedule for ${selectedDate.toLocaleDateString()}`);
}

function navigateCalendar(direction) {
  const currentMonth = document.getElementById('currentMonth');
  if (currentMonth) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    let [month, year] = currentMonth.textContent.split(' ');
    let monthIndex = months.indexOf(month);
    year = parseInt(year);
    
    monthIndex += direction;
    if (monthIndex < 0) {
      monthIndex = 11;
      year--;
    } else if (monthIndex > 11) {
      monthIndex = 0;
      year++;
    }
    
    currentMonth.textContent = `${months[monthIndex]} ${year}`;
    renderCalendarInterface();
    showNotification(`Calendar moved to ${months[monthIndex]} ${year}`);
  }
}

function toggleRoomView() {
  if (!elements.roomViewToggle) return;
  const isRoomView = elements.roomViewToggle.textContent.trim() === 'Provider View';
  elements.roomViewToggle.textContent = isRoomView ? 'Room View' : 'Provider View';
  
  if (isRoomView) {
    renderScheduleInterface();
    showNotification('Switched to Provider View');
  } else {
    renderRoomHeatmap();
    showNotification('Switched to Room View');
  }
}

function renderRoomHeatmap() {
  const heatmapHtml = `
    <div style="padding: var(--space-16); background-color: var(--ignite-dark);">
      <h3 style="margin-bottom: var(--space-16); color: var(--ignite-white);">Room Utilization Dashboard</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-16);">
        <div style="background: linear-gradient(135deg, var(--ignite-dark-card) 0%, var(--ignite-gray) 100%); border-radius: var(--radius-lg); padding: var(--space-16); border: 1px solid rgba(255, 255, 255, 0.1);">
          <h4 style="color: var(--ignite-white); margin-bottom: var(--space-12);">Room 1</h4>
          <div style="margin: var(--space-12) 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-4);">
              <span style="color: rgba(255, 255, 255, 0.8);">Utilization</span>
              <span style="font-weight: var(--font-weight-semibold); color: var(--ignite-white);">85%</span>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); height: 8px; border-radius: var(--radius-full);">
              <div style="background: linear-gradient(90deg, var(--ignite-success) 0%, var(--ignite-primary) 100%); width: 85%; height: 100%; border-radius: var(--radius-full);"></div>
            </div>
          </div>
          <div style="font-size: var(--font-size-sm); color: rgba(255, 255, 255, 0.7);">
            <div style="margin-bottom: var(--space-4);"><strong style="color: var(--ignite-white);">Current:</strong> Sarah Williams</div>
            <div><strong style="color: var(--ignite-white);">Next:</strong> 10:00 AM - Lisa Anderson</div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, var(--ignite-dark-card) 0%, var(--ignite-gray) 100%); border-radius: var(--radius-lg); padding: var(--space-16); border: 1px solid rgba(255, 255, 255, 0.1);">
          <h4 style="color: var(--ignite-white); margin-bottom: var(--space-12);">Room 2</h4>
          <div style="margin: var(--space-12) 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-4);">
              <span style="color: rgba(255, 255, 255, 0.8);">Utilization</span>
              <span style="font-weight: var(--font-weight-semibold); color: var(--ignite-white);">60%</span>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); height: 8px; border-radius: var(--radius-full);">
              <div style="background: linear-gradient(90deg, var(--ignite-warning) 0%, var(--ignite-primary) 100%); width: 60%; height: 100%; border-radius: var(--radius-full);"></div>
            </div>
          </div>
          <div style="font-size: var(--font-size-sm); color: rgba(255, 255, 255, 0.7);">
            <div style="margin-bottom: var(--space-4);"><strong style="color: var(--ignite-white);">Current:</strong> Available</div>
            <div><strong style="color: var(--ignite-white);">Next:</strong> 10:30 AM - Robert Davis</div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, var(--ignite-dark-card) 0%, var(--ignite-gray) 100%); border-radius: var(--radius-lg); padding: var(--space-16); border: 1px solid rgba(255, 255, 255, 0.1);">
          <h4 style="color: var(--ignite-white); margin-bottom: var(--space-12);">Room 3</h4>
          <div style="margin: var(--space-12) 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-4);">
              <span style="color: rgba(255, 255, 255, 0.8);">Utilization</span>
              <span style="font-weight: var(--font-weight-semibold); color: var(--ignite-white);">40%</span>
            </div>
            <div style="background-color: rgba(255, 255, 255, 0.1); height: 8px; border-radius: var(--radius-full);">
              <div style="background: linear-gradient(90deg, var(--ignite-error) 0%, var(--ignite-warning) 100%); width: 40%; height: 100%; border-radius: var(--radius-full);"></div>
            </div>
          </div>
          <div style="font-size: var(--font-size-sm); color: rgba(255, 255, 255, 0.7);">
            <div style="margin-bottom: var(--space-4);"><strong style="color: var(--ignite-white);">Current:</strong> Available</div>
            <div><strong style="color: var(--ignite-white);">Next:</strong> Available</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (elements.scheduleContent) {
    elements.scheduleContent.innerHTML = heatmapHtml;
  }
}

function togglePanelCollapse(panel) {
  const panelElement = elements[`${panel}Panel`];
  if (panelElement) {
    panelElement.classList.toggle('collapsed');
    showNotification(`${panel} panel ${panelElement.classList.contains('collapsed') ? 'collapsed' : 'expanded'}`);
  }
}

function setupPanelResize() {
  let isResizing = false;
  let currentHandle = null;
  
  document.querySelectorAll('.panel-resize').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      currentHandle = handle;
      document.body.style.cursor = 'col-resize';
      e.preventDefault();
    });
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing || !currentHandle) return;
    
    // Basic resize logic - could be enhanced
    const rect = currentHandle.getBoundingClientRect();
    const parentRect = currentHandle.parentElement.getBoundingClientRect();
    const percentage = ((e.clientX - parentRect.left) / parentRect.width) * 100;
    
    // Apply constraints and update panel sizes
    if (percentage > 20 && percentage < 80) {
      showNotification(`Resizing panel to ${Math.round(percentage)}%`);
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      currentHandle = null;
      document.body.style.cursor = 'default';
    }
  });
}

function handleContextMenu(e) {
  const appointmentCard = e.target.closest('.appointment-card');
  if (appointmentCard) {
    e.preventDefault();
    
    if (elements.contextMenu) {
      elements.contextMenu.style.left = `${e.pageX}px`;
      elements.contextMenu.style.top = `${e.pageY}px`;
      elements.contextMenu.classList.remove('hidden');
      
      // Add click handlers for context menu items
      elements.contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
        item.onclick = () => {
          const action = item.dataset.action;
          showNotification(`${action} selected for appointment`);
          elements.contextMenu.classList.add('hidden');
        };
      });
    }
  }
}

// Utility Functions
function getStatusClass(status) {
  const statusMap = {
    'Scheduled': 'status--info',
    'Confirmed': 'status--info',
    'Checked In': 'status--warning', 
    'In Room': 'status--success',
    'No Show': 'status--error',
    'Completed': 'status--success'
  };
  return statusMap[status] || 'status--info';
}

function getPriorityColor(priority) {
  const colorMap = {
    'High': 'error',
    'Medium': 'warning',
    'Low': 'info'
  };
  return colorMap[priority] || 'info';
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, var(--ignite-primary) 0%, var(--ignite-primary-hover) 100%);
    color: var(--ignite-white);
    padding: var(--space-12) var(--space-16);
    border-radius: var(--radius-base);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    font-weight: var(--font-weight-medium);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(notificationStyle);