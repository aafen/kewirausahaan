import { User, Settings, HelpCircle, LogOut, ChevronRight, MessageSquare, Phone, X, Save, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Profile() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  
  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const menuItems = [
    { id: 'settings', icon: Settings, label: 'Pengaturan Akun' },
    { id: 'contact', icon: MessageSquare, label: 'Kontak / Chat Bantuan' },
    { id: 'help', icon: HelpCircle, label: 'Pusat Bantuan' },
  ];

  const handleMenuClick = (id) => {
    if (id === 'contact') {
      // Simulasi membuka WhatsApp
      window.open('https://wa.me/6281234567890?text=Halo%20XUIN%20UMKM,%20saya%20butuh%20bantuan', '_blank');
    } else {
      setActiveModal(id);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert('Pengaturan berhasil disimpan!');
    setActiveModal(null);
  };

  return (
    <div className="min-h-full bg-gray-50 pb-8 relative">
      {/* Profile Header */}
      <div className="bg-primary p-6 rounded-b-[2rem] shadow-md text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
        
        <div className="flex items-center gap-4 mt-4 relative z-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-white/50">
            <User size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Mahasiswa UNESA</h1>
            <p className="text-sm opacity-90 mt-0.5">+62 812-3456-7890</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-[-20px] relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex justify-around">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">12</div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-1">Pesanan Selesai</div>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">Gold</div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-1">Level Member</div>
          </div>
        </div>
      </div>

      {/* XUIN UMKM Contact Info */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Kontak Restoran</h2>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-primary">
            <Phone size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-800">XUIN UMKM</h3>
            <p className="text-xs text-gray-500 font-medium">+62 812-3456-7890</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Depan Gedung A10 UNESA</p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-4 space-y-3">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            onClick={() => handleMenuClick(item.id)}
            className="bg-white flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <item.icon size={18} className="text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        ))}
      </div>

      <div className="px-4 mt-8">
        <button onClick={handleLogout} className="w-full bg-white text-red-500 font-bold py-3.5 rounded-xl shadow-sm border border-red-100 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors transform active:scale-95">
          <LogOut size={18} />
          Keluar Aplikasi
        </button>
      </div>

      {/* MODALS */}
      
      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setActiveModal(null)}></div>
          <div className="bg-white rounded-2xl w-full max-w-sm z-10 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Pengaturan Akun</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveSettings}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 mb-2">Nama Lengkap</label>
                <input type="text" defaultValue="Mahasiswa UNESA" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 mb-2">Nomor Telepon</label>
                <input type="tel" defaultValue="+62 812-3456-7890" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-600 mb-2">Kata Sandi Baru</label>
                <input type="password" placeholder="Biarkan kosong jika tidak diubah" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primaryDark active:scale-95 transition-all">
                <Save size={18} /> Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setActiveModal(null)}></div>
          <div className="bg-white rounded-2xl w-full max-w-sm z-10 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Shield className="text-primary" size={20} /> Pusat Bantuan
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-800 mb-1">Bagaimana cara membatalkan pesanan?</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Maaf, pesanan yang sudah dibuat dan masuk ke sistem dapur kami tidak dapat dibatalkan. Harap pastikan pesanan Anda sudah benar sebelum menekan tombol Bayar.</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-800 mb-1">Berapa lama waktu tunggu?</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Rata-rata waktu tunggu adalah 15-20 menit tergantung kepadatan antrean. Anda bisa memantau status pesanan secara langsung di menu "Pesanan".</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-800 mb-1">Metode pembayaran apa saja yang tersedia?</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Kami mendukung pembayaran QRIS (Gopay, ShopeePay, OVO), Saldo DANA, Transfer Bank BCA, dan juga Tunai (Bayar di Tempat).</p>
              </div>
            </div>
            
            <button onClick={() => handleMenuClick('contact')} className="w-full mt-6 bg-green-50 text-green-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-green-100 hover:bg-green-100 transition-colors">
              <MessageSquare size={18} /> Hubungi CS via WhatsApp
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
