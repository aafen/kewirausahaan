import { Search, Utensils, Coffee, MapPin, ChevronRight, Star, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const promos = [
    { id: 1, title: 'GET 20% OFF', desc: 'Valid until 2 Maret 2026', bg: 'bg-primary' },
    { id: 2, title: 'Buka Sekarang', desc: '08:00 AM - 17:00 PM', bg: 'bg-yellow-500' },
  ];

  const categories = [
    { id: 'main', name: 'Main Dishes', icon: Utensils, color: 'text-primary', bg: 'bg-red-50' },
    { id: 'light', name: 'Light Bites', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'drinks', name: 'Beverages', icon: Coffee, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const mainDishes = [
    { id: 1, name: 'Nasi Ayam Geprek Bakar', price: '15K', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80' },
    { id: 2, name: 'Mie Jebew', price: '10K', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=300&q=80' },
    { id: 3, name: 'Baso Aci', price: '13K', img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&q=80' },
    { id: 4, name: 'Cireng Kuah Keju Creamy', price: '13K', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80' },
  ];

  const lightBites = [
    { id: 5, name: 'Kebab Monster', price: '15K', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80' },
    { id: 6, name: 'Lumpia Beef', price: '12K', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80' },
    { id: 7, name: 'Cuanki Kuah Keju Creamy', price: '13K', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80' },
    { id: 8, name: 'Batagor', price: '8K', img: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?w=300&q=80' },
  ];

  const beverages = [
    { id: 9, name: 'Coffee Latte', price: '15K', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&q=80' },
    { id: 10, name: 'Matcha Latte', price: '15K', img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300&q=80' },
    { id: 11, name: 'Fresh Lemon Tea', price: '10K', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80' },
    { id: 12, name: 'Mineral Water', price: '5K', img: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=300&q=80' },
  ];

  const allItems = [...mainDishes, ...lightBites, ...beverages];
  const filteredItems = allItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="pb-8">
      {/* Header & Search */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={18} className="text-primary" />
          <div className="text-sm font-medium flex-1">
            <span className="text-gray-500 text-xs block font-bold tracking-wide">@xuin_umkm</span>
            Depan Gedung A10 UNESA
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-100 border border-yellow-200 px-2 py-1 rounded">
            <Clock size={12} /> 08:00 - 17:00
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu favoritmu..." 
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <XCircle size={16} />
            </button>
          )}
        </div>
      </div>

      {searchQuery ? (
        // Search Results View
        <div className="px-4 mt-6 min-h-[50vh]">
          <h2 className="text-base font-bold text-gray-800 mb-4">Hasil Pencarian "{searchQuery}"</h2>
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div onClick={() => navigate('/cart', { state: item })} key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors">
                  <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
                    <div className="mt-1 bg-yellow-100 text-yellow-800 inline-block px-2 py-0.5 rounded font-bold text-xs">{item.price}</div>
                  </div>
                  <button className="bg-primary/10 text-primary p-2 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">
                    +
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm font-medium">Menu tidak ditemukan :(</p>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">Tampilkan Semua Menu</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Normal View
        <>
          {/* Promo Banner */}
          <div className="px-4 mt-4 flex gap-4 overflow-x-auto snap-x hide-scrollbar">
            {promos.map(promo => (
              <div key={promo.id} className={`${promo.bg} snap-center shrink-0 w-72 h-32 rounded-2xl p-4 text-white flex flex-col justify-center relative overflow-hidden shadow-md`}>
                <h3 className="font-bold text-2xl relative z-10 drop-shadow-md">{promo.title}</h3>
                <p className="text-white/90 text-sm mt-1 relative z-10 font-medium">{promo.desc}</p>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="grid grid-cols-3 gap-4 px-4 mt-6">
            {categories.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border border-gray-100`}>
                  <cat.icon className={cat.color} size={24} />
                </div>
                <span className="text-[11px] font-bold text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>

          {/* Main Dishes */}
          <div id="main" className="mt-8 px-4 scroll-mt-28">
            <div className="flex items-center justify-between mb-4 border-l-4 border-primary pl-2">
              <h2 className="text-lg font-black text-gray-800">Main Dishes</h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
              {mainDishes.map(rest => (
                <div onClick={() => navigate('/cart', { state: rest })} key={rest.id} className="snap-center shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative">
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full shadow-sm z-10">
                    {rest.price}
                  </div>
                  <img src={rest.img} alt={rest.name} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2 h-10">{rest.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Light Bites */}
          <div id="light" className="mt-4 px-4 scroll-mt-28">
            <div className="flex items-center justify-between mb-4 border-l-4 border-primary pl-2">
              <h2 className="text-lg font-black text-gray-800">Light Bites</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {lightBites.map(item => (
                <div onClick={() => navigate('/cart', { state: item })} key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors">
                  <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
                    <div className="mt-1 bg-yellow-100 text-yellow-800 inline-block px-2 py-0.5 rounded font-bold text-xs">{item.price}</div>
                  </div>
                  <button className="bg-primary/10 text-primary p-2 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Beverages */}
          <div id="drinks" className="mt-8 px-4 scroll-mt-28">
            <div className="flex items-center justify-between mb-4 border-l-4 border-primary pl-2">
              <h2 className="text-lg font-black text-gray-800">Beverages</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
              {beverages.map(rest => (
                <div onClick={() => navigate('/cart', { state: rest })} key={rest.id} className="snap-center shrink-0 w-32 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer relative">
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm z-10 border border-primary/20">
                    {rest.price}
                  </div>
                  <img src={rest.img} alt={rest.name} className="w-full h-24 object-cover" />
                  <div className="p-3 text-center">
                    <h3 className="font-bold text-[11px] text-gray-800 line-clamp-2 h-8">{rest.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
