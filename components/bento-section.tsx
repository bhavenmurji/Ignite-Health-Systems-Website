import AiCodeReviews from "./bento/ai-code-reviews"
import RealtimeCodingPreviews from "./bento/real-time-previews"
import OneClickIntegrationsIllustration from "./bento/one-click-integrations-illustration"
import MCPConnectivityIllustration from "./bento/mcp-connectivity-illustration" // Updated import
import EasyDeployment from "./bento/easy-deployment"
import ParallelCodingAgents from "./bento/parallel-agents" // Updated import

const BentoCard = ({ title, description, Component }) => (
  <div className="card-enhanced overflow-hidden flex flex-col justify-start items-start relative group hover:shadow-lg transition-all duration-300">
    {/* Enhanced Background with improved blur */}
    <div
      className="absolute inset-0 rounded-2xl transition-all duration-300 group-hover:backdrop-blur-[12px]"
      style={{
        background: "rgba(231, 236, 235, 0.08)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    />
    {/* Enhanced gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Enhanced Content Area */}
    <div className="self-stretch p-6 md:p-8 flex flex-col justify-start items-start relative z-10">
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <h3 className="heading-5 text-foreground leading-tight">
          {title}
        </h3>
        <p className="body-base text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
    
    {/* Component Area with better spacing */}
    <div className="self-stretch h-72 relative z-10 -mt-2">
      <Component />
    </div>
  </div>
)

export function BentoSection() {
  const cards = [
    {
      title: "AI-powered code reviews.",
      description: "Get real-time, smart suggestions for cleaner code.",
      Component: AiCodeReviews,
    },
    {
      title: "Real-time coding previews",
      description: "Chat, collaborate, and instantly preview changes together.",
      Component: RealtimeCodingPreviews,
    },
    {
      title: "One-click integrations",
      description: "Easily connect your workflow with popular dev tools.",
      Component: OneClickIntegrationsIllustration,
    },
    {
      title: "Flexible MCP connectivity",
      description: "Effortlessly manage and configure MCP server access.",
      Component: MCPConnectivityIllustration, // Updated component
    },
    {
      title: "Launch parallel coding agents", // Swapped position
      description: "Solve complex problems faster with multiple AI agents.",
      Component: ParallelCodingAgents, // Updated component
    },
    {
      title: "Deployment made easy", // Swapped position
      description: "Go from code to live deployment on Vercel instantly.",
      Component: EasyDeployment,
    },
  ]

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
        {/* Enhanced Section Header */}
        <div className="self-stretch section-spacing flex flex-col justify-center items-center z-10">
          <div className="flex flex-col justify-start items-center gap-6">
            <h2 className="heading-1 text-center max-w-[655px]">
              Empower Your Workflow with AI
            </h2>
            <div className="max-w-[600px]">
              <p className="body-large text-center">
                Ask your AI Agent for real-time collaboration, seamless integrations, and actionable insights to streamline your operations.
              </p>
            </div>
          </div>
        </div>
        {/* Enhanced Grid with Better Spacing */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 z-10">
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
