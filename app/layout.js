import './globals.css';

export const metadata = {
  title: 'Conference Navigator',
  description: 'Find conference talks and accessible routes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
