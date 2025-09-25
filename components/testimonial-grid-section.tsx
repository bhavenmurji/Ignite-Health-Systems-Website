import Image from "next/image"

const testimonials = [
  {
    quote:
      "The real-time code suggestions from Pointer feel like having a senior engineer reviewing every line of code as you write. The accuracy of its recommendations has improved our overall code quality, reduced review time.",
    name: "Annette Black",
    company: "Sony",
    avatar: "/images/avatars/annette-black.png",
    type: "large-teal",
  },
  {
    quote:
      "Integrating Pointer into our stack was smooth, and the MCP server connections saved us days of configuration work",
    name: "Dianne Russell",
    company: "McDonald's",
    avatar: "/images/avatars/dianne-russell.png",
    type: "small-dark",
  },
  {
    quote:
      "Pointer’s multi-agent coding feature has been a game changer. We’re fixing complex bugs in hours instead of spending entire sprints on them.",
    name: "Cameron Williamson",
    company: "IBM",
    avatar: "/images/avatars/cameron-williamson.png",
    type: "small-dark",
  },
  {
    quote:
      "We no longer juggle multiple tools. Pointer brought all our integrations together in one place, which simplified our entire workflow.",
    name: "Robert Fox",
    company: "MasterCard",
    avatar: "/images/avatars/robert-fox.png",
    type: "small-dark",
  },
  {
    quote:
      "We started with the free plan just to test it out, but within a week we upgraded to Pro. Now, we can’t imagine coding without it",
    name: "Darlene Robertson",
    company: "Ferrari",
    avatar: "/images/avatars/darlene-robertson.png",
    type: "small-dark",
  },
  {
    quote:
      "Collaborative coding feels effortless now. With Pointer’s real-time previews, pair programming has become faster and more productive.",
    name: "Cody Fisher",
    company: "Apple",
    avatar: "/images/avatars/cody-fisher.png",
    type: "small-dark",
  },
  {
    quote:
      "Deploying on Vercel with Pointer was not just simple, it felt seamless. We went from coding to seeing our changes live in minutes without worrying about build pipelines or configuration issues.",
    name: "Albert Flores",
    company: "Louis Vuitton",
    avatar: "/images/avatars/albert-flores.png",
    type: "large-light",
  },
]

const TestimonialCard = ({ quote, name, company, avatar, type }) => {
  const isLargeCard = type.startsWith("large")
  const avatarSize = isLargeCard ? 48 : 40
  const avatarBorderRadius = isLargeCard ? "rounded-full" : "rounded-full"
  const padding = isLargeCard ? "p-8" : "p-6"

  let cardClasses = `card-testimonial flex flex-col justify-between items-start overflow-hidden relative ${padding} group hover:shadow-xl transition-all duration-300`
  let quoteClasses = ""
  let nameClasses = ""
  let companyClasses = ""
  let backgroundElements = null
  let cardHeight = ""
  const cardWidth = "w-full"

  if (type === "large-teal") {
    cardClasses += " bg-primary group-hover:bg-primary/95"
    quoteClasses = "heading-4 text-primary-foreground !leading-relaxed mb-6"
    nameClasses = "body-base text-primary-foreground font-medium"
    companyClasses = "body-small text-primary-foreground/70"
    cardHeight = "min-h-[520px]"
    backgroundElements = (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-30 group-hover:opacity-40 transition-opacity duration-300"
        style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
      />
    )
  } else if (type === "large-light") {
    cardClasses += " bg-[rgba(231,236,235,0.12)] group-hover:bg-[rgba(231,236,235,0.16)]"
    quoteClasses = "heading-4 text-foreground !leading-relaxed mb-6"
    nameClasses = "body-base text-foreground font-medium"
    companyClasses = "body-small text-muted-foreground"
    cardHeight = "min-h-[520px]"
    backgroundElements = (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-15 group-hover:opacity-25 transition-opacity duration-300"
        style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
      />
    )
  } else {
    cardClasses += " bg-card/50 group-hover:bg-card/80 border border-card-border"
    quoteClasses = "body-base text-foreground-muted !leading-relaxed mb-4"
    nameClasses = "body-small text-foreground font-medium"
    companyClasses = "body-xs text-muted-foreground"
    cardHeight = "min-h-[280px]"
  }

  return (
    <div className={`${cardClasses} ${cardWidth} ${cardHeight} flex flex-col justify-between`}>
      {backgroundElements}
      
      {/* Quote Section with Better Typography */}
      <div className="relative z-10 flex-1">
        <blockquote className={`${quoteClasses} break-words`}>
          "{quote}"
        </blockquote>
      </div>
      
      {/* Author Section with Enhanced Layout */}
      <div className="relative z-10 flex items-center gap-4 mt-auto">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={`${name} avatar`}
          width={avatarSize}
          height={avatarSize}
          className={`${avatarBorderRadius} ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105`}
        />
        <div className="flex flex-col gap-1">
          <div className={nameClasses}>{name}</div>
          <div className={companyClasses}>{company}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialGridSection() {
  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start py-6 md:py-8 lg:py-14">
      {/* Enhanced Section Header */}
      <div className="self-stretch section-spacing flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
          <h2 className="heading-2 text-center">
            Coding made effortless
          </h2>
          <div className="max-w-2xl">
            <p className="body-large text-center">
              Hear how developers ship products faster, collaborate seamlessly, and build with confidence using Pointer's powerful AI tools
            </p>
          </div>
        </div>
        
        {/* Visual Separator */}
        <div className="divider max-w-xs mx-auto mt-8" />
      </div>
      {/* Enhanced Grid Layout */}
      <div className="w-full pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Column 1 */}
          <div className="flex flex-col gap-6 md:gap-8">
            <TestimonialCard {...testimonials[0]} />
            <TestimonialCard {...testimonials[1]} />
          </div>
          
          {/* Column 2 */}
          <div className="flex flex-col gap-6 md:gap-8">
            <TestimonialCard {...testimonials[2]} />
            <TestimonialCard {...testimonials[3]} />
            <TestimonialCard {...testimonials[4]} />
          </div>
          
          {/* Column 3 */}
          <div className="flex flex-col gap-6 md:gap-8">
            <TestimonialCard {...testimonials[5]} />
            <TestimonialCard {...testimonials[6]} />
          </div>
        </div>
      </div>
    </section>
  )
}
