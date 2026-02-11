export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border shadow-soft">
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/pots-mark.dim_512x512.png" 
                alt="POTS Community" 
                className="h-16 w-16 rounded-xl shadow-sm"
              />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                POTS Community
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              A supportive space where people with POTS can ask questions, share stories, 
              and support each other through shared experiences.
            </p>
          </div>
          <div className="hidden lg:block">
            <img 
              src="/assets/generated/pots-hero.dim_1600x900.png" 
              alt="Community support illustration" 
              className="w-full h-auto rounded-xl shadow-soft"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
