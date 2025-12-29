import { Card } from '@/components/ui/card';
import {
  Zap, Shield, Globe, Code2,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Молниеносная скорость',
    description: 'Статические JSON файлы обеспечивают мгновенную загрузку без серверных вычислений',
  },
  {
    icon: Shield,
    title: 'Надёжность',
    description: 'Оптимальное кеширование и CDN-дружественность для глобальной доступности',
  },
  {
    icon: Globe,
    title: 'Гибкие запросы',
    description: 'Получайте данные за год, месяц или конкретный день одним запросом',
  },
  {
    icon: Code2,
    title: 'Для разработчиков',
    description: 'Swagger-документация, примеры кода и простая интеграция из коробки',
  },
];

export function FeaturesSection() {
  return (
    <section className="px-6 py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5" />

      <div className="mx-auto max-w-6xl relative">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Всё необходимое для разработки</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Современное API с акцентом на производительность и удобство использования
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={
                  'p-8 bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 '
                  + 'transition-all duration-500 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 '
                  + 'group animate-in fade-in slide-in-from-bottom-4 duration-700'
                }
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={
                      'p-3 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 '
                      + 'group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-500 '
                      + 'group-hover:scale-110 group-hover:rotate-3'
                    }
                  >
                    <Icon className="h-6 w-6 text-accent animate-glow" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
