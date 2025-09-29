import './globals.css';

export const metadata = {
  title: {
    default: 'Komunitas Chinese Indonesia',
    template: '%s — Komunitas Chinese Indonesia',
  },
  description:
    'Komunitas Chinese Indonesia (KCI) menjadi ruang kolaborasi untuk melestarikan budaya dan menggerakkan komunitas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
