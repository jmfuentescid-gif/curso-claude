import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <meta name="description" content="Curso completo de Claude — de 0 a nivel Pro Senior" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
