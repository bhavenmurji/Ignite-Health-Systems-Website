export function LargeTestimonialHealth() {
  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14">
      <div className="self-stretch flex flex-col justify-center items-center gap-4">
        <div className="p-2 bg-gradient-to-b from-primary/20 to-primary/10 rounded-2xl">
          <div className="p-8 bg-background/95 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">DR</span>
              </div>
              
              <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6 leading-relaxed">
                "Ignite Health has completely transformed my practice. I've reclaimed 3 hours every day that I used to spend on documentation. 
                Now I can focus on what matters most - my patients. The AI accuracy is remarkable, and the HIPAA compliance gives me peace of mind."
              </blockquote>
              
              <div className="flex flex-col items-center gap-1">
                <p className="font-semibold text-foreground">Dr. Robert Chen</p>
                <p className="text-sm text-muted-foreground">Internal Medicine, Cedar Medical Group</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-primary fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/10 w-full">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">95%</p>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">99.9%</p>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-sm text-muted-foreground">HIPAA Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}