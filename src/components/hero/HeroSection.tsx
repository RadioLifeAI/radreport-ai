import { ReactNode } from 'react';

interface HeroSectionProps {
  variant?: 'gradient' | 'simple';
  title: ReactNode;
  subtitle: ReactNode;
  actions?: ReactNode;
}

export default function HeroSection({ 
  variant = 'gradient', 
  title, 
  subtitle, 
  actions 
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {variant === 'gradient' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-3xl animate-glow-pulse" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
          </>
        )}
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center py-20">
          <div className="max-w-4xl space-y-8 animate-fade-in">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight gradient-text-medical">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>

            {/* Actions */}
            {actions && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                {actions}
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
