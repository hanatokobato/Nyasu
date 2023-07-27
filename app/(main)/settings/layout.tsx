import SideBar from './components/SideBar';
import { ToastContainer } from 'react-toastify';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full-minus-header">
      <SideBar />
      <div className="container mx-auto pt-12 px-6">
        {children}
        <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      </div>
    </div>
  );
}
