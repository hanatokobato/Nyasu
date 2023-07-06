import SideBar from './components/SideBar';
import { ToastContainer } from 'react-toastify';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="mt-3">
        <SideBar />
      </div>
      <div className="container mx-auto mt-12 px-6">
        {children}
        <ToastContainer />
      </div>
    </div>
  );
}
