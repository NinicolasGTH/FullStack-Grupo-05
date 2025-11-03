import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

export const metadata = {
  title: 'FullStack - Next Front',
  description: 'Frontend Next.js consumindo API Node/Express',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="max-w-6xl mx-auto p-4">{children}</main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
