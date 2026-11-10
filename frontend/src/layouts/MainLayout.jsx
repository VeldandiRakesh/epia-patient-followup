import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { ToastContext } from '../contexts/ToastContext';

const MainLayout = () => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    </ToastContext.Provider>
  );
};

export default MainLayout;
