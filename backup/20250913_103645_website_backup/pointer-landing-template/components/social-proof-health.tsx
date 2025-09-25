export function SocialProofHealth() {
  return (
    <section className="w-full py-12 md:py-16 px-5">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm font-medium mb-2">
            Trusted by Leading Healthcare Organizations
          </p>
          <h3 className="text-foreground text-2xl font-semibold">
            Join 500+ Clinics Transforming Patient Care
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
          {/* Healthcare Partner Logos - Placeholder divs */}
          <div className="w-32 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">Mayo Clinic</span>
          </div>
          <div className="w-32 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">Cleveland Clinic</span>
          </div>
          <div className="w-32 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">Johns Hopkins</span>
          </div>
          <div className="w-32 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">Cedar-Sinai</span>
          </div>
          <div className="w-32 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">Stanford Health</span>
          </div>
          <div className="w-32 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">Mount Sinai</span>
          </div>
          <div className="w-32 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">NYU Langone</span>
          </div>
          <div className="w-32 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">UCLA Health</span>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <p className="text-sm text-muted-foreground">Reduction in Documentation Time</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <p className="text-sm text-muted-foreground">HIPAA Compliance Rate</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <p className="text-sm text-muted-foreground">Provider Satisfaction Score</p>
          </div>
        </div>
      </div>
    </section>
  )
}