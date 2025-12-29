import { Github } from 'lucide-react';

export function Footer({ version }: { version?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/50 px-6 py-12 relative overflow-hidden">
      <div
        className={
          'absolute inset-0 -z-10 bg-gradient-to-t from-accent/5 '
          + 'via-transparent to-transparent'
        }
      />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              {`© 2023–${year} `}
              <a
                href="https://kuzyak.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-all duration-300"
              >
                Павел Кузякин
              </a>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <a
                href="https://github.com/iposho/holidays-calendar-ru/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-all duration-300"
              >
                Лицензия MIT
              </a>
              {version && ` • v${version}`}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/iposho/holidays-calendar-ru"
              target="_blank"
              rel="noopener noreferrer"
              className={
                'flex items-center gap-2 text-sm text-muted-foreground '
                + 'hover:text-accent transition-all duration-300 group'
              }
            >
              <Github className="h-5 w-5" />
              GitHub
            </a>
            <a
              href="/swagger"
              target="_blank"
              rel="noopener noreferrer"
              className={
                'text-sm text-muted-foreground hover:text-accent '
                + 'transition-all duration-300'
              }
            >
              Swagger UI
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
