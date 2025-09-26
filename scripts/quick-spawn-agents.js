#!/usr/bin/env node

/**
 * Quick Agent Spawning Demonstration
 * Shows various agent types and spawning patterns
 */

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

// Available agent types in Claude Code
const AGENTS = {
  // Core Development Agents
  'coder': '🔨 Implementation specialist for writing clean code',
  'reviewer': '👁️ Code review and quality assurance specialist',
  'tester': '🧪 Comprehensive testing specialist',
  'planner': '📋 Strategic planning and task orchestration',
  'researcher': '🔍 Deep research and information gathering',

  // Specialized Development Agents
  'system-architect': '🏗️ System architecture design expert',
  'backend-dev': '⚙️ Backend API development specialist',
  'mobile-dev': '📱 React Native mobile development expert',
  'ml-developer': '🧠 Machine learning model developer',
  'cicd-engineer': '🚀 CI/CD pipeline automation specialist',
  'api-docs': '📚 OpenAPI/Swagger documentation expert',

  // Swarm Coordination Agents
  'hierarchical-coordinator': '👑 Queen-led hierarchical coordination',
  'mesh-coordinator': '🕸️ Peer-to-peer mesh network coordination',
  'adaptive-coordinator': '🔄 Dynamic topology switching coordinator',
  'swarm-init': '🐝 Swarm initialization specialist',
  'smart-agent': '🤖 Intelligent agent coordination',

  // GitHub Integration Agents
  'pr-manager': '📝 Pull request management specialist',
  'code-review-swarm': '👥 Multi-agent code review coordinator',
  'issue-tracker': '🎯 Issue management and tracking',
  'release-manager': '📦 Automated release coordination',
  'workflow-automation': '⚡ GitHub Actions automation',

  // Testing & Quality Agents
  'tdd-london-swarm': '🏴 TDD London School specialist',
  'production-validator': '✅ Production readiness validator',
  'code-analyzer': '🔬 Advanced code quality analyzer',
  'performance-benchmarker': '📊 Performance benchmarking specialist',

  // SPARC Methodology Agents
  'sparc-coord': '🎭 SPARC methodology orchestrator',
  'sparc-coder': '💻 SPARC code transformation specialist',
  'specification': '📄 Requirements analysis specialist',
  'pseudocode': '📝 Algorithm design specialist',
  'architecture': '🏛️ System design specialist',
  'refinement': '✨ Iterative improvement specialist'
};

// Spawning patterns
const PATTERNS = {
  'full-stack': {
    name: '🚀 Full-Stack Development Team',
    agents: ['system-architect', 'backend-dev', 'coder', 'mobile-dev', 'tester', 'cicd-engineer'],
    description: 'Complete team for full-stack application development'
  },
  'api-first': {
    name: '⚙️ API-First Development Team',
    agents: ['planner', 'system-architect', 'backend-dev', 'api-docs', 'tester', 'reviewer'],
    description: 'Team focused on building robust APIs with documentation'
  },
  'ml-pipeline': {
    name: '🧠 Machine Learning Pipeline Team',
    agents: ['researcher', 'ml-developer', 'backend-dev', 'cicd-engineer', 'tester'],
    description: 'Team for building ML models and deployment pipelines'
  },
  'github-automation': {
    name: '🐙 GitHub Automation Team',
    agents: ['pr-manager', 'code-review-swarm', 'issue-tracker', 'release-manager', 'workflow-automation'],
    description: 'Team for complete GitHub workflow automation'
  },
  'quality-first': {
    name: '✨ Quality-First Development Team',
    agents: ['tdd-london-swarm', 'code-analyzer', 'reviewer', 'production-validator', 'performance-benchmarker'],
    description: 'Team focused on code quality and testing'
  },
  'sparc-methodology': {
    name: '🎭 SPARC Methodology Team',
    agents: ['sparc-coord', 'specification', 'pseudocode', 'architecture', 'refinement', 'sparc-coder'],
    description: 'Team following SPARC development methodology'
  },
  'microservices': {
    name: '🔷 Microservices Architecture Team',
    agents: ['system-architect', 'backend-dev', 'backend-dev', 'api-docs', 'cicd-engineer', 'mesh-coordinator'],
    description: 'Team for building microservices architectures'
  },
  'rapid-prototype': {
    name: '⚡ Rapid Prototyping Team',
    agents: ['planner', 'coder', 'coder', 'tester'],
    description: 'Lean team for rapid prototype development'
  }
};

function displayHeader() {
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}                    AGENT SPAWNING PATTERNS${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

function displayAgentTypes() {
  console.log(`${colors.bright}${colors.yellow}📚 Available Agent Types (${Object.keys(AGENTS).length} total)${colors.reset}`);
  console.log(`${colors.bright}${'─'.repeat(70)}${colors.reset}\n`);

  const categories = {
    'Core Development': ['coder', 'reviewer', 'tester', 'planner', 'researcher'],
    'Specialized Development': ['system-architect', 'backend-dev', 'mobile-dev', 'ml-developer', 'cicd-engineer', 'api-docs'],
    'Swarm Coordination': ['hierarchical-coordinator', 'mesh-coordinator', 'adaptive-coordinator', 'swarm-init', 'smart-agent'],
    'GitHub Integration': ['pr-manager', 'code-review-swarm', 'issue-tracker', 'release-manager', 'workflow-automation'],
    'Testing & Quality': ['tdd-london-swarm', 'production-validator', 'code-analyzer', 'performance-benchmarker'],
    'SPARC Methodology': ['sparc-coord', 'sparc-coder', 'specification', 'pseudocode', 'architecture', 'refinement']
  };

  Object.entries(categories).forEach(([category, agents]) => {
    console.log(`${colors.magenta}${category}:${colors.reset}`);
    agents.forEach(agent => {
      if (AGENTS[agent]) {
        console.log(`  • ${colors.green}${agent}${colors.reset}: ${AGENTS[agent]}`);
      }
    });
    console.log();
  });
}

function displaySpawningPatterns() {
  console.log(`${colors.bright}${colors.yellow}🎯 Spawning Patterns (${Object.keys(PATTERNS).length} patterns)${colors.reset}`);
  console.log(`${colors.bright}${'─'.repeat(70)}${colors.reset}\n`);

  Object.entries(PATTERNS).forEach(([key, pattern]) => {
    console.log(`${pattern.name}`);
    console.log(`  ${colors.cyan}Description:${colors.reset} ${pattern.description}`);
    console.log(`  ${colors.cyan}Team Composition:${colors.reset}`);
    pattern.agents.forEach(agent => {
      console.log(`    • ${colors.green}${agent}${colors.reset}: ${AGENTS[agent] || 'Custom agent'}`);
    });
    console.log();
  });
}

function generateSpawnCommand(pattern) {
  console.log(`${colors.bright}${colors.yellow}💻 Example Spawn Commands${colors.reset}`);
  console.log(`${colors.bright}${'─'.repeat(70)}${colors.reset}\n`);

  console.log(`${colors.cyan}1. Using Claude Code's Task Tool (Recommended):${colors.reset}`);
  console.log(`${colors.green}// In a single message, spawn all agents concurrently:${colors.reset}`);

  PATTERNS['full-stack'].agents.forEach(agent => {
    console.log(`Task("${agent} agent", "Implement ${agent} responsibilities", "${agent}")`);
  });

  console.log(`\n${colors.cyan}2. Using MCP Claude-Flow (Coordination):${colors.reset}`);
  console.log(`${colors.green}npx claude-flow@alpha swarm init --topology hierarchical${colors.reset}`);
  PATTERNS['full-stack'].agents.forEach(agent => {
    console.log(`${colors.green}npx claude-flow@alpha agent spawn --type ${agent}${colors.reset}`);
  });

  console.log(`\n${colors.cyan}3. Using TodoWrite for Task Management:${colors.reset}`);
  console.log(`${colors.green}TodoWrite { todos: [${colors.reset}`);
  PATTERNS['full-stack'].agents.forEach(agent => {
    console.log(`  { content: "Spawn ${agent} agent", status: "pending" },`);
  });
  console.log(`${colors.green}]}${colors.reset}`);
}

function displayUsageExamples() {
  console.log(`${colors.bright}${colors.yellow}📖 Usage Examples${colors.reset}`);
  console.log(`${colors.bright}${'─'.repeat(70)}${colors.reset}\n`);

  console.log(`${colors.cyan}Example 1: Full-Stack Development${colors.reset}`);
  console.log(`Use the 'full-stack' pattern for complete application development.`);
  console.log(`This spawns: architect, backend, frontend, mobile, testing, and CI/CD agents.\n`);

  console.log(`${colors.cyan}Example 2: API Development${colors.reset}`);
  console.log(`Use the 'api-first' pattern for API-centric development.`);
  console.log(`This spawns: planner, architect, backend, documentation, testing, and review agents.\n`);

  console.log(`${colors.cyan}Example 3: Machine Learning Project${colors.reset}`);
  console.log(`Use the 'ml-pipeline' pattern for ML projects.`);
  console.log(`This spawns: researcher, ML developer, backend, CI/CD, and testing agents.\n`);

  console.log(`${colors.cyan}Example 4: Quality Enhancement${colors.reset}`);
  console.log(`Use the 'quality-first' pattern to improve existing code.`);
  console.log(`This spawns: TDD, analyzer, reviewer, validator, and benchmarking agents.\n`);
}

function main() {
  displayHeader();
  displayAgentTypes();
  displaySpawningPatterns();
  generateSpawnCommand();
  displayUsageExamples();

  console.log(`${colors.bright}${colors.green}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.green}                    READY TO SPAWN AGENTS${colors.reset}`);
  console.log(`${colors.bright}${colors.green}${'='.repeat(70)}${colors.reset}\n`);

  console.log(`${colors.yellow}🚀 Quick Start:${colors.reset}`);
  console.log(`1. Choose a pattern from above based on your needs`);
  console.log(`2. Use Claude Code's Task tool to spawn agents concurrently`);
  console.log(`3. Agents will coordinate automatically via hooks and memory`);
  console.log(`4. Monitor progress with: ${colors.green}npx claude-flow@alpha swarm status${colors.reset}\n`);

  console.log(`${colors.yellow}💡 Tips:${colors.reset}`);
  console.log(`• Always spawn agents in a single message for parallel execution`);
  console.log(`• Use TodoWrite to track spawning and coordination tasks`);
  console.log(`• Agents automatically coordinate via shared memory`);
  console.log(`• Use appropriate topology (hierarchical, mesh, adaptive) for your task\n`);

  console.log(`${colors.cyan}Ready to build with intelligent agent swarms!${colors.reset} 🐝`);
}

// Run the demonstration
main();