import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-2xl relative overflow-hidden sm:border-x sm:border-gray-200">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-16 bg-white">
        <Outlet />
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
