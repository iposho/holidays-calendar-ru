'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const CALENDAR_URL = 'https://calendar.kuzyak.in/api/calendar/ics';
const WEBCAL_URL = 'webcal://calendar.kuzyak.in/api/calendar/ics';
const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(WEBCAL_URL)}`;

export function CalendarSubscription() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CALENDAR_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <section id="calendar-subscription" className="px-6 py-16 md:py-24 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <Card className="p-8 md:p-12 bg-card/60 backdrop-blur-md border-accent/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div
                className={
                  'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 '
                  + 'border border-accent/20 text-accent text-xs font-mono mb-3'
                }
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>iCalendar • Webcal</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
                Подписка на календарь
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
                Подключите производственный календарь в один клик. Праздничные дни, сокращенные смены
                и переносы выходных будут синхронизироваться автоматически при выходе новых постановлений.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5 text-accent" />
                <span>Автообновление (раз в неделю)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                <span>Все доступные годы (2023–2027+)</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Button
              asChild
              className={
                'h-12 text-sm font-medium bg-gradient-to-r from-accent to-accent/80 '
                + 'hover:from-accent/90 hover:to-accent/70 shadow-lg shadow-accent/20 transition-all hover:scale-[1.02]'
              }
            >
              <a href={WEBCAL_URL} title="Подписаться в Apple Calendar или Outlook">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Apple Calendar / Outlook</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className={
                'h-12 text-sm font-medium border-accent/30 hover:border-accent/60 '
                + 'hover:bg-accent/10 transition-all hover:scale-[1.02]'
              }
            >
              <a
                href={GOOGLE_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Добавить в Google Календарь"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <span>Google Календарь</span>
              </a>
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleCopy}
              className="h-12 text-sm font-medium transition-all hover:scale-[1.02] sm:col-span-2 lg:col-span-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-green-500">Ссылка скопирована!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  <span>Скопировать ссылку</span>
                </>
              )}
            </Button>
          </div>

          <div
            className={
              'p-4 rounded-lg bg-secondary/40 border border-border/50 flex flex-col '
              + 'sm:flex-row items-center justify-between gap-3 text-sm'
            }
          >
            <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono shrink-0">
                URL подписки:
              </span>
              <code className="text-xs md:text-sm font-mono truncate text-accent selection:bg-accent/20">
                {CALENDAR_URL}
              </code>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              Подходит для Яндекс Календаря и любых caldav/ics-клиентов
            </span>
          </div>
        </Card>
      </div>
    </section>
  );
}
