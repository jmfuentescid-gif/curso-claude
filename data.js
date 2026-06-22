import './globals.css'

export const metadata = {
  title: 'Domina Claude — Curso Pro Senior',
  description: 'El curso más completo para convertirte en experto senior de Claude: prompt engineering, API, agentes, extensiones y proyectos reales.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
