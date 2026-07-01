import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f8fbfe" />
        <meta name="color-scheme" content="light dark" />
        <meta name="application-name" content="Quantory: Inventory Manager" />
        <meta
          name="apple-mobile-web-app-title"
          content="Quantory: Inventory Manager"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'homeventory-theme';
                  var storedTheme = localStorage.getItem(storageKey);
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : systemTheme;
                  var root = document.documentElement;
                  root.dataset.theme = theme;
                  root.style.colorScheme = theme;
                  var meta = document.querySelector('meta[name="theme-color"]');
                  if (meta) {
                    meta.setAttribute('content', theme === 'dark' ? '#0b1020' : '#f8fbfe');
                  }
                } catch (error) {}
              })();
            `,
          }}
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
