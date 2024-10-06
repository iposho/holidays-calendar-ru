'use client';

import { useEffect } from 'react';

import Script from 'next/script';

const counterId = process.env.YANDEX_METRIKA_ID || '';

export function Metrika() {
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window?.ym === 'function' && !!counterId) {
      window?.ym(counterId, 'hit', window.location.href);
    }
  }, []);

  return (
    <Script id="yandex-metrika">
      {`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(${counterId}, "init", {
          defer: true,
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
        });
      `}
    </Script>
  );
}
