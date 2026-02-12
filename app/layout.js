export const metadata = {
  title: 'Calificador de CV',
  description: 'Asistente de recursos humanos para evaluar CVs',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
