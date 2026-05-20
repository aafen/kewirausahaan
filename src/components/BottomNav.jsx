import { Home, ShoppingBag, ReceiptText, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Beranda' },
    { to: '/cart', icon: ShoppingBag, label: 'Keranjang' },
    { to: '/orders', icon: ReceiptText, label: 'Pesanan' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-16 px-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors " +
            (isActive ? "text-primary" : "text-gray-400 hover:text-gray-600")
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={"text-[10px] " + (isActive ? "font-semibold" : "font-medium")}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
