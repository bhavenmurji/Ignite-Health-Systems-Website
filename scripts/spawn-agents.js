#!/usr/bin/env node

/**
 * Agent Spawning Script
 * Demonstrates various agent spawning patterns and coordination strategies
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Agent types and their descriptions
const AGENT_TYPES = {
  researcher: {
    name: 'Researcher',
    description: 'Deep research and information gathering specialist',
    skills: ['web search', 'data analysis', 'pattern recognition', 'report generation']
  },
  coder: {
    name: 'Coder',
    description: 'Implementation specialist for writing clean, efficient code',
    skills: ['algorithm design', 'code optimization', 'testing', 'debugging']
  },
  reviewer: {
    name: 'Reviewer',
    description: 'Code review and quality assurance specialist',
    skills: ['code analysis', 'security review', 'best practices', 'performance review']
  },
  tester: {
    name: 'Tester',
    description: 'Comprehensive testing and quality assurance specialist',
    skills: ['unit testing', 'integration testing', 'e2e testing', 'load testing']
  },
  planner: {
    name: 'Planner',
    description: 'Strategic planning and task orchestration agent',
    skills: ['project planning', 'task breakdown', 'resource allocation', 'timeline management']
  },
  'system-architect': {
    name: 'System Architect',
    description: 'Expert agent for system architecture design and patterns',
    skills: ['architecture patterns', 'scalability design', 'technology selection', 'integration planning']
  },
  'backend-dev': {
    name: 'Backend Developer',
    description: 'Specialized agent for backend API development',
    skills: ['REST APIs', 'GraphQL', 'database design', 'microservices']
  },
  'mobile-dev': {
    name: 'Mobile Developer',
    description: 'Expert agent for React Native mobile application development',
    skills: ['React Native', 'iOS development', 'Android development', 'mobile optimization']
  },
  'ml-developer': {
    name: 'ML Developer',
    description: 'Specialized agent for machine learning model development',
    skills: ['model training', 'data preprocessing', 'neural networks', 'MLOps']
  },
  'cicd-engineer': {
    name: 'CI/CD Engineer',
    description: 'Specialized agent for GitHub Actions CI/CD pipeline creation',
    skills: ['GitHub Actions', 'deployment automation', 'container orchestration', 'monitoring']
  }
};

// Swarm topologies
const TOPOLOGIES = {
  hierarchical: {
    name: 'Hierarchical',
    description: 'Queen-led hierarchical swarm coordination',
    pattern: 'queen-workers'
  },
  mesh: {
    name: 'Mesh',
    description: 'Peer-to-peer mesh network with distributed decision making',
    pattern: 'peer-to-peer'
  },
  adaptive: {
    name: 'Adaptive',
    description: 'Dynamic topology switching with self-organizing patterns',
    pattern: 'self-organizing'
  },
  collective: {
    name: 'Collective Intelligence',
    description: 'Hive mind with shared consciousness and consensus mechanisms',
    pattern: 'hive-mind'
  }
};

class AgentSpawner {
  constructor() {
    this.activeAgents = [];
    this.swarmId = null;
    this.topology = 'hierarchical';
  }

  // Initialize swarm with specific topology
  async initializeSwarm(topology = 'hierarchical', objective = 'General development tasks') {
    console.log(`${colors.cyan}🚀 Initializing Swarm${colors.reset}`);
    console.log(`${colors.yellow}Topology: ${TOPOLOGIES[topology].name}${colors.reset}`);
    console.log(`${colors.yellow}Objective: ${objective}${colors.reset}\n`);

    try {
      const cmd = `npx claude-flow@alpha swarm init --topology ${topology} --objective "${objective}"`;
      const { stdout } = await execPromise(cmd);

      // Extract swarm ID from output
      const swarmIdMatch = stdout.match(/swarm-\d+-\w+/);
      if (swarmIdMatch) {
        this.swarmId = swarmIdMatch[0];
        console.log(`${colors.green}✅ Swarm initialized: ${this.swarmId}${colors.reset}\n`);
      }

      this.topology = topology;
      return this.swarmId;
    } catch (error) {
      console.error(`${colors.red}❌ Failed to initialize swarm: ${error.message}${colors.reset}`);
      return null;
    }
  }

  // Spawn a single agent
  async spawnAgent(type, task = null) {
    const agent = AGENT_TYPES[type];
    if (!agent) {
      console.error(`${colors.red}❌ Unknown agent type: ${type}${colors.reset}`);
      return null;
    }

    console.log(`${colors.blue}🤖 Spawning ${agent.name} Agent${colors.reset}`);
    console.log(`   Description: ${agent.description}`);
    console.log(`   Skills: ${agent.skills.join(', ')}`);

    try {
      const taskDesc = task || `Perform ${type} tasks`;
      const cmd = `npx claude-flow@alpha agent spawn --type ${type} --task "${taskDesc}"`;
      const { stdout } = await execPromise(cmd);

      const agentIdMatch = stdout.match(/agent-\d+-\w+/);
      if (agentIdMatch) {
        const agentId = agentIdMatch[0];
        this.activeAgents.push({ id: agentId, type, task: taskDesc });
        console.log(`${colors.green}✅ Agent spawned: ${agentId}${colors.reset}\n`);
        return agentId;
      }
    } catch (error) {
      console.error(`${colors.red}❌ Failed to spawn agent: ${error.message}${colors.reset}`);
      return null;
    }
  }

  // Spawn multiple agents in parallel
  async spawnMultipleAgents(agentConfigs) {
    console.log(`${colors.magenta}🎯 Spawning ${agentConfigs.length} Agents in Parallel${colors.reset}\n`);

    const spawnPromises = agentConfigs.map(config =>
      this.spawnAgent(config.type, config.task)
    );

    const results = await Promise.all(spawnPromises);
    return results.filter(id => id !== null);
  }

  // Create a task and distribute to agents
  async createTask(description, priority = 'normal') {
    console.log(`${colors.cyan}📋 Creating Task${colors.reset}`);
    console.log(`   Description: ${description}`);
    console.log(`   Priority: ${priority}`);

    try {
      const cmd = `npx claude-flow@alpha task create --description "${description}" --priority ${priority}`;
      const { stdout } = await execPromise(cmd);

      const taskIdMatch = stdout.match(/task-\d+-\w+/);
      if (taskIdMatch) {
        const taskId = taskIdMatch[0];
        console.log(`${colors.green}✅ Task created: ${taskId}${colors.reset}\n`);
        return taskId;
      }
    } catch (error) {
      console.error(`${colors.red}❌ Failed to create task: ${error.message}${colors.reset}`);
      return null;
    }
  }

  // Get swarm status
  async getSwarmStatus() {
    console.log(`${colors.cyan}📊 Swarm Status${colors.reset}`);

    try {
      const cmd = `npx claude-flow@alpha swarm status`;
      const { stdout } = await execPromise(cmd);
      console.log(stdout);
    } catch (error) {
      console.error(`${colors.red}❌ Failed to get swarm status: ${error.message}${colors.reset}`);
    }
  }

  // Store memory for agent coordination
  async storeMemory(key, value) {
    try {
      const cmd = `npx claude-flow@alpha memory store "${key}" "${value}"`;
      await execPromise(cmd);
      console.log(`${colors.green}💾 Memory stored: ${key}${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ Failed to store memory: ${error.message}${colors.reset}`);
    }
  }

  // Clean up swarm
  async cleanup() {
    console.log(`${colors.yellow}🧹 Cleaning up swarm...${colors.reset}`);

    try {
      if (this.swarmId) {
        const cmd = `npx claude-flow@alpha swarm cleanup --id ${this.swarmId}`;
        await execPromise(cmd);
        console.log(`${colors.green}✅ Swarm cleaned up${colors.reset}`);
      }
    } catch (error) {
      console.error(`${colors.red}❌ Cleanup failed: ${error.message}${colors.reset}`);
    }
  }
}

// Example spawning scenarios
async function runExamples() {
  const spawner = new AgentSpawner();

  console.log(`${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}   AGENT SPAWNING DEMONSTRATION${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}\n`);

  // Scenario 1: Basic Development Team
  console.log(`${colors.bright}📦 Scenario 1: Basic Development Team${colors.reset}`);
  console.log(`${colors.bright}${'─'.repeat(40)}${colors.reset}\n`);

  await spawner.initializeSwarm('hierarchical', 'Build a REST API with authentication');

  const devTeam = [
    { type: 'planner', task: 'Create project roadmap and task breakdown' },
    { type: 'system-architect', task: 'Design API architecture and database schema' },
    { type: 'backend-dev', task: 'Implement REST endpoints and authentication' },
    { type: 'tester', task: 'Write comprehensive test suite' },
    { type: 'reviewer', task: 'Review code quality and security' }
  ];

  await spawner.spawnMultipleAgents(devTeam);
  await spawner.storeMemory('project/type', 'REST API');
  await spawner.storeMemory('project/status', 'in-progress');

  // Scenario 2: Research and Analysis Team
  console.log(`${colors.bright}📊 Scenario 2: Research and Analysis Team${colors.reset}`);
  console.log(`${colors.bright}${'─'.repeat(40)}${colors.reset}\n`);

  const researchTeam = [
    { type: 'researcher', task: 'Research best practices for microservices' },
    { type: 'researcher', task: 'Analyze competitor implementations' },
    { type: 'planner', task: 'Create implementation strategy based on research' }
  ];

  await spawner.spawnMultipleAgents(researchTeam);

  // Scenario 3: Full-Stack Application Team
  console.log(`${colors.bright}🚀 Scenario 3: Full-Stack Application Team${colors.reset}`);
  console.log(`${colors.bright}${'─'.repeat(40)}${colors.reset}\n`);

  const fullStackTeam = [
    { type: 'system-architect', task: 'Design full-stack architecture' },
    { type: 'backend-dev', task: 'Build API and database layer' },
    { type: 'coder', task: 'Implement React frontend' },
    { type: 'mobile-dev', task: 'Create React Native mobile app' },
    { type: 'cicd-engineer', task: 'Setup deployment pipeline' },
    { type: 'tester', task: 'E2E testing across all platforms' }
  ];

  await spawner.spawnMultipleAgents(fullStackTeam);

  // Scenario 4: Machine Learning Pipeline
  console.log(`${colors.bright}🧠 Scenario 4: Machine Learning Pipeline${colors.reset}`);
  console.log(`${colors.bright}${'─'.repeat(40)}${colors.reset}\n`);

  const mlTeam = [
    { type: 'researcher', task: 'Research ML algorithms for the use case' },
    { type: 'ml-developer', task: 'Implement and train ML models' },
    { type: 'backend-dev', task: 'Create model serving API' },
    { type: 'cicd-engineer', task: 'Setup MLOps pipeline' },
    { type: 'tester', task: 'Validate model performance' }
  ];

  await spawner.spawnMultipleAgents(mlTeam);

  // Create high-priority tasks
  await spawner.createTask('Implement user authentication system', 'high');
  await spawner.createTask('Design database schema', 'high');
  await spawner.createTask('Create API documentation', 'normal');

  // Show final status
  await spawner.getSwarmStatus();

  // Display summary
  console.log(`${colors.bright}${colors.green}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}   SPAWNING COMPLETE${colors.reset}`);
  console.log(`${colors.bright}${colors.green}${'='.repeat(60)}${colors.reset}\n`);

  console.log(`${colors.yellow}📈 Summary:${colors.reset}`);
  console.log(`   Total Agents Spawned: ${spawner.activeAgents.length}`);
  console.log(`   Topology: ${spawner.topology}`);
  console.log(`   Swarm ID: ${spawner.swarmId || 'Not initialized'}`);

  console.log(`\n${colors.yellow}Active Agents:${colors.reset}`);
  spawner.activeAgents.forEach((agent, index) => {
    console.log(`   ${index + 1}. ${AGENT_TYPES[agent.type].name} (${agent.id})`);
    console.log(`      Task: ${agent.task}`);
  });

  // Optional cleanup (commented out to keep agents running)
  // await spawner.cleanup();
}

// Run the examples
runExamples().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});