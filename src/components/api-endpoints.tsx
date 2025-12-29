import { Card } from '@/components/ui/card';

const endpoints = [
  {
    method: 'GET',
    path: '/api/calendar',
    description: 'Список доступных календарей',
  },
  {
    method: 'GET',
    path: '/api/calendar/{year}',
    description: 'Календарь на год',
  },
  {
    method: 'GET',
    path: '/api/calendar/{year}/holidays',
    description: 'Праздничные и сокращенные дни',
  },
  {
    method: 'GET',
    path: '/api/calendar/{year}/{month}',
    description: 'Календарь на месяц',
  },
  {
    method: 'GET',
    path: '/api/calendar/{year}/{month}/{day}',
    description: 'Информация о конкретном дне',
  },
];

export function ApiEndpoints() {
  return (
    <section
      id="api-endpoints"
      className="px-6 py-20 md:py-32 relative overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-0 -z-10">
        <div
          className={
            'absolute inset-0 bg-gradient-to-b from-transparent '
            + 'via-accent/3 to-transparent'
          }
        />
        <div
          className={
            'absolute top-1/2 left-0 w-96 h-96 bg-accent/10 '
            + 'rounded-full blur-3xl animate-float'
          }
        />
        <div
          className={
            'absolute top-1/3 right-0 w-96 h-96 bg-accent/10 '
            + 'rounded-full blur-3xl animate-float'
          }
          style={{ animationDelay: '-2s' }}
        />
      </div>

      <div className="mx-auto max-w-5xl">
        <div
          className={
            'text-center mb-12 animate-in fade-in '
            + 'slide-in-from-bottom-4 duration-700'
          }
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            API Endpoints
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Простой и понятный REST API для всех ваших потребностей
          </p>
        </div>

        <div className="space-y-3">
          {endpoints.map((endpoint, index) => (
            <Card
              key={endpoint.path}
              className={
                'p-6 bg-card/50 backdrop-blur-sm border-accent/20 '
                + 'hover:border-accent/40 transition-all duration-500 '
                + 'hover:shadow-lg hover:shadow-accent/5 hover:-translate-x-1 '
                + 'group animate-in fade-in slide-in-from-right-4 duration-700'
              }
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span
                  className={
                    'px-3 py-1 text-xs font-mono font-semibold '
                    + 'bg-gradient-to-r from-accent/20 to-accent/10 '
                    + 'text-accent rounded-md w-fit group-hover:from-accent/30 '
                    + 'group-hover:to-accent/20 transition-all duration-300 '
                    + 'group-hover:scale-105'
                  }
                >
                  {endpoint.method}
                </span>
                <code
                  className={
                    'font-mono text-sm flex-1 text-foreground '
                    + 'group-hover:text-accent transition-colors duration-300'
                  }
                >
                  {endpoint.path}
                </code>
                <span className="text-sm text-muted-foreground">
                  {endpoint.description}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div
          className={
            'mt-12 text-center animate-in fade-in '
            + 'slide-in-from-bottom-4 duration-700 delay-500'
          }
        >
          <a
            href="/swagger"
            target="_blank"
            rel="noopener noreferrer"
            className={
              'inline-flex items-center gap-2 text-accent '
              + 'hover:text-accent/80 font-medium transition-all '
              + 'duration-300 hover:gap-3 group'
            }
          >
            Полная документация Swagger
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
