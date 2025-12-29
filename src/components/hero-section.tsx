import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-2 justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div
            className={
              'flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 '
              + 'backdrop-blur-sm border border-accent/20 text-sm font-mono'
            }
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            API v1.15.0
          </div>
        </div>
        <h1
          className={
            'text-3xl md:text-7xl font-bold tracking-tight text-center mb-6 '
            + 'text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'
          }
        >
          Производственный календарь
          {' '}
          РФ
          {' '}
          <span className="gradient-text">
            API
          </span>
        </h1>
        <p
          className={
            'text-xl md:text-2xl text-muted-foreground text-center max-w-3xl '
            + 'mx-auto mb-12 text-pretty animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200'
          }
        >
          Быстрое, простое и удобное REST API для получения производственных календарей России в формате JSON
        </p>
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center
                     animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
        >
          <Button
            asChild
            className={
              'h-10 rounded-md text-base px-8 font-medium bg-gradient-to-r '
              + 'from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 '
              + 'transition-all duration-300 shadow-lg shadow-accent/25 '
              + 'hover:shadow-xl hover:shadow-accent/30 hover:scale-105'
            }
          >
            <a href="#api-endpoints">Начать работу</a>
          </Button>
          <Button
            variant="outline"
            asChild
            className={
              'h-10 rounded-md text-base px-8 font-medium bg-transparent '
              + 'hover:bg-secondary/50 border-accent/30 hover:border-accent/50 '
              + 'transition-all duration-300 hover:scale-105 hover:text-accent'
            }
          >
            <a
              href="https://github.com/iposho/holidays-calendar-ru"
              target="_blank"
              rel="noopener noreferrer"
              title="Открыть документацию на GitHub"
            >
              Документация
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
