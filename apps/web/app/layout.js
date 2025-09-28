import './globals.css';

export const metadata = {
  title: 'KCI CMS',
  description: 'Admin console for Komunitas Chinese Indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
