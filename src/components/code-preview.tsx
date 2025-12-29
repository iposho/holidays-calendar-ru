'use client';

import { useState, useMemo, useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/github-dark.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

// Дополнительные стили для подсветки кода
const codeStyles = `
  .hljs-keyword { color: #ff79c6; font-weight: bold; }
  .hljs-string { color: #50fa7b; }
  .hljs-comment { color: #6272a4; font-style: italic; }
  .hljs-number { color: #bd93f9; }
  .hljs-function { color: #50fa7b; }
  .hljs-built_in { color: #8be9fd; }
  .hljs-title { color: #ffb86c; }
  .hljs-params { color: #ffb86c; }
  .hljs-property { color: #b1b1b1; }
`;

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);

const codeExamples = [
  {
    lang: 'JavaScript',
    language: 'javascript',
    code: '// Получение календаря на 2024 год\n'
      + 'fetch(\'https://calendar.kuzyak.in/api/calendar/2024\')\n'
      + '  .then(res => res.json())\n'
      + '  .then(data => {\n'
      + '    console.log(\'Праздничные дни:\', data.days);\n'
      + '  });',
  },
  {
    lang: 'Python',
    language: 'python',
    code: 'import requests\n\n'
      + '# Запрос данных для конкретного месяца\n'
      + 'url = "https://calendar.kuzyak.in/api/calendar/2024/05"\n'
      + 'response = requests.get(url)\n\n'
      + 'if response.status_code == 200:\n'
      + '    data = response.json()\n'
      + '    print(f"Рабочих дней в мае: {data[\'statistics\'][\'work\']}")',
  },
  {
    lang: 'cURL',
    language: 'bash',
    code: '# Проверка статуса конкретного дня\n'
      + 'curl -X GET \\\n'
      + '  "https://calendar.kuzyak.in/api/calendar/2024/01/01" \\\n'
      + '  -H "Accept: application/json"',
  },
];

export function CodePreview() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hljsLoaded, setHljsLoaded] = useState(false);

  useEffect(() => {
    // Инициализация highlight.js после монтирования компонента
    setHljsLoaded(true);
  }, []);

  const highlightedCode = useMemo(() => {
    if (!hljsLoaded) return codeExamples[activeTab].code;

    const example = codeExamples[activeTab];
    try {
      if (hljs.getLanguage(example.language)) {
        const result = hljs.highlight(example.code, { language: example.language });
        return result.value;
      }
      const result = hljs.highlightAuto(example.code);
      return result.value;
    } catch (e) {
      // Highlight.js error - fallback to plain text
      return example.code;
    }
  }, [activeTab, hljsLoaded]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[activeTab].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback для браузеров без поддержки clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = codeExamples[activeTab].code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        // Fallback copy failed - silently ignore
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: codeStyles }} />
      <section className="px-6 py-20 md:py-32 relative">
        <div
          className={
            'absolute inset-0 -z-10 bg-gradient-to-b from-transparent '
            + 'via-accent/5 to-transparent'
          }
        />

        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Простая интеграция
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Интегрируйте API в свой проект всего несколькими строками кода
            </p>
          </div>

          <Card
            className={
              'p-1 bg-card border-accent/20 shadow-2xl shadow-accent/10 '
              + 'animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200'
            }
          >
            <div
              className={
                'flex gap-2 p-3 border-b border-border bg-gradient-to-r '
                + 'from-transparent via-accent/5 to-transparent relative z-20'
              }
            >
              {codeExamples.map((example, index) => (
                <button
                  key={example.language}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={
                    'px-4 py-2 text-sm font-medium rounded-md transition-all '
                    + `duration-300 ${activeTab === index
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20 scale-105'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`
                  }
                >
                  {example.lang}
                </button>
              ))}
            </div>

            <div className="relative z-10">
              <pre className="p-6 overflow-x-auto min-h-[160px] bg-[#0a0a0a] rounded-b-lg border-t border-border/50">
                <code
                  className={`language-${codeExamples[activeTab].language} text-sm font-mono block text-gray-100 leading-relaxed`}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#f8f8f2', // Светло-серый текст для лучшей видимости
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </pre>

              <Button
                size="sm"
                variant="ghost"
                className={
                  'absolute top-4 right-4 hover:bg-accent/10 hover:text-accent '
                  + 'transition-all duration-300 hover:scale-110 z-30'
                }
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
