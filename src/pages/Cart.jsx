import { ArrowLeft, MapPin, Ticket, ChevronRight, Utensils, X, CheckCircle2, QrCode } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data Pesanan
  const item = location.state || { 
    name: 'Nasi Ayam Geprek Bakar', 
    price: '15K', 
    img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=100&q=80' 
  };

  // State
  const [qty, setQty] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState('pickup'); // 'pickup' atau 'delivery'
  const [deliveryAddress, setDeliveryAddress] = useState('Depan Gedung A10 UNESA');
  
  const [selectedPayment, setSelectedPayment] = useState({
    id: 'qris', name: 'Gopay / ShopeePay', type: 'QRIS', color: 'text-orange-600', bg: 'bg-orange-100'
  });

  const paymentOptions = [
    { id: 'qris', name: 'Gopay / ShopeePay', type: 'QRIS', color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'dana', name: 'Saldo DANA', type: 'E-Wallet', color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'cod', name: 'Bayar di Tempat (COD)', type: 'CASH', color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'transfer', name: 'Transfer Bank BCA', type: 'BANK', color: 'text-blue-800', bg: 'bg-blue-50' },
  ];

  const increaseQty = () => setQty(prev => prev + 1);
  const decreaseQty = () => setQty(prev => prev > 1 ? prev - 1 : 1);

  // Perhitungan Harga
  const priceNumber = parseInt(item.price.replace(/\D/g, '')) * (item.price.includes('K') ? 1000 : 1);
  const totalOriginal = priceNumber * qty;
  const discount = Math.floor(totalOriginal * 0.2); // Diskon 20%
  const deliveryFee = deliveryType === 'delivery' ? 5000 : 0;
  const total = totalOriginal - discount + deliveryFee;

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const saveOrderToDB = () => {
    const newOrder = {
      id: `#ORD-${Math.floor(Math.random() * 900) + 100}`,
      name: item.name,
      qty: qty,
      total: total,
      status: 'Sedang Disiapkan',
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    const existingOrders = JSON.parse(localStorage.getItem('xuin_orders') || '[]');
    localStorage.setItem('xuin_orders', JSON.stringify([newOrder, ...existingOrders]));
  };

  const handleCheckout = () => {
    if (selectedPayment.id === 'cod') {
      // Jika COD, simpan order & langsung ke halaman pesanan
      saveOrderToDB();
      navigate('/orders', { state: { ...item, qty, total } });
    } else {
      // Jika QRIS/Transfer, tampilkan instruksi pembayaran
      setShowInstruction(true);
    }
  };

  // Tampilan Halaman Instruksi Pembayaran (Menutupi Keranjang)
  if (showInstruction) {
    return (
      <div className="min-h-full bg-white relative pb-24 z-50 animate-in slide-in-from-right-full duration-300">
        <div className="bg-white p-4 sticky top-0 shadow-sm flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setShowInstruction(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Pembayaran</h1>
        </div>
        
        <div className="p-4 flex flex-col items-center text-center mt-2">
          <h2 className="text-gray-500 font-medium text-sm">Total Tagihan</h2>
          <div className="text-3xl font-black text-primary mt-1">{formatRp(total)}</div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 w-full mt-6 shadow-inner">
            {selectedPayment.id === 'qris' && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6">
                  <QrCode className="text-primary" size={24} />
                  <h3 className="font-bold text-gray-800">Scan QRIS ini</h3>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
                  <img src="/qris.jpg" alt="QRIS" className="w-full max-w-[200px] object-contain rounded-xl" />
                </div>
                <p className="text-sm font-bold text-gray-800 mt-6">MUHAMMAD HASAN APINI MAULANA</p>
                <p className="text-xs text-gray-500 mt-1">NMID: ID1025437310598</p>
              </div>
            )}
            
            {(selectedPayment.id === 'transfer' || selectedPayment.id === 'dana') && (
              <div className="flex flex-col items-center">
                <h3 className="font-bold text-gray-800 mb-4">Transfer ke Rekening Berikut</h3>
                <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 w-full flex justify-between items-center shadow-sm">
                  <div className="text-left">
                    <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{selectedPayment.name}</div>
                    <div className="font-black text-lg tracking-widest text-gray-800 mt-1">
                      {selectedPayment.id === 'transfer' ? '4291040912' : '085808701624'}
                    </div>
                  </div>
                  <button className="text-primary font-bold text-[11px] bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                    Salin
                  </button>
                </div>
                <p className="text-sm font-bold text-gray-800 mt-5">Atas Nama: MUHAMMAD HASAN APINI MAULANA</p>
                <p className="text-xs text-gray-500 mt-1">Verifikasi otomatis dalam 10 menit</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="fixed bottom-16 w-full max-w-md bg-white border-t border-gray-100 p-4 z-20">
          <button onClick={() => { saveOrderToDB(); navigate('/orders', { state: { ...item, qty, total } }); }} className="w-full bg-primary hover:bg-primaryDark text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 transition-transform transform active:scale-95 text-base">
            Saya Sudah Bayar
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Utama Keranjang
  return (
    <div className="min-h-full bg-gray-50 pb-24 relative">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Keranjang</h1>
      </div>

      {/* Delivery Address */}
      <div 
        onClick={() => setIsLocationModalOpen(true)}
        className="bg-white p-4 mt-2 cursor-pointer active:bg-gray-50 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MapPin className="text-primary" size={24} />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-800">
              {deliveryType === 'delivery' ? 'Lokasi Pengiriman' : 'Lokasi Pengambilan'}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{deliveryAddress}</p>
          </div>
          <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Ubah</div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-4 mt-2">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <Utensils size={18} className="text-primary" />
          <h2 className="font-bold text-sm text-gray-800">XUIN UMKM</h2>
        </div>
        
        <div className="flex gap-3 items-center">
          <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
            <p className="text-xs text-gray-500 mt-1">Pilihan Utama</p>
            <div className="text-primary font-black text-sm mt-1">{formatRp(priceNumber)}</div>
          </div>
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1 shadow-inner">
            <button onClick={decreaseQty} className={`font-bold text-lg px-1 ${qty > 1 ? 'text-gray-800 hover:text-primary' : 'text-gray-300'}`}>-</button>
            <span className="text-sm font-bold text-gray-800 w-4 text-center">{qty}</span>
            <button onClick={increaseQty} className="text-primary font-bold text-lg px-1 hover:text-primaryDark">+</button>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="bg-white p-4 mt-2">
        <div className="flex items-center justify-between border border-primary/20 bg-red-50 rounded-xl p-3 cursor-pointer hover:border-primary transition-colors">
          <div className="flex items-center gap-2">
            <Ticket size={20} className="text-primary" />
            <span className="text-sm font-bold text-primary">Diskon 20% Aktif</span>
          </div>
          <ChevronRight size={16} className="text-primary" />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-4 mt-2">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Metode Pembayaran</h3>
        <div 
          onClick={() => setIsPaymentModalOpen(true)}
          className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`${selectedPayment.bg} ${selectedPayment.color} font-bold text-[10px] px-2 py-1 rounded shadow-sm`}>
              {selectedPayment.type}
            </div>
            <span className="text-sm font-medium text-gray-800">{selectedPayment.name}</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-4 mt-2">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Ringkasan Pembayaran</h3>
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Harga ({qty} barang)</span>
          <span>{formatRp(totalOriginal)}</span>
        </div>
        <div className="flex justify-between text-xs text-green-600 mb-2 font-medium">
          <span>Diskon 20% OFF</span>
          <span>-{formatRp(discount)}</span>
        </div>
        {deliveryType === 'delivery' && (
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Biaya Pengiriman</span>
            <span>{formatRp(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-black text-gray-800 border-t pt-3">
          <span>Total Pembayaran</span>
          <span>{formatRp(total)}</span>
        </div>
      </div>

      {/* Checkout Bar */}
      <div className="fixed bottom-16 w-full max-w-md bg-white border-t border-gray-100 p-3 flex items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div>
          <div className="text-xs text-gray-500">Total Pembayaran</div>
          <div className="text-lg font-black text-primary">{formatRp(total)}</div>
        </div>
        <button onClick={handleCheckout} className="bg-primary hover:bg-primaryDark text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/30 transition-transform transform active:scale-95">
          Pesan Sekarang
        </button>
      </div>

      {/* Payment Selection Modal (Bottom Sheet) */}
      {isPaymentModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
            onClick={() => setIsPaymentModalOpen(false)}
          ></div>
          
          {/* Bottom Sheet */}
          <div className="fixed bottom-0 w-full max-w-md bg-white rounded-t-3xl z-[70] p-5 pb-8 shadow-2xl transform transition-transform animate-in slide-in-from-bottom-full">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Pilih Metode Pembayaran</h2>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {paymentOptions.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => {
                    setSelectedPayment(option);
                    setIsPaymentModalOpen(false);
                  }}
                  className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedPayment.id === option.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${option.bg} ${option.color} font-bold text-[10px] px-2 py-1 rounded w-16 text-center`}>
                      {option.type}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{option.name}</span>
                  </div>
                  {selectedPayment.id === option.id && (
                    <CheckCircle2 size={20} className="text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsLocationModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-sm z-10 shadow-2xl p-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Ubah Lokasi</h2>
              <button onClick={() => setIsLocationModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
              <button 
                onClick={() => {
                  setDeliveryType('pickup');
                  setDeliveryAddress('Depan Gedung A10 UNESA');
                }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${deliveryType === 'pickup' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
              >
                Ambil Sendiri
              </button>
              <button 
                onClick={() => {
                  setDeliveryType('delivery');
                  setDeliveryAddress('');
                }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${deliveryType === 'delivery' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
              >
                Pesan Antar
              </button>
            </div>
            
            {deliveryType === 'delivery' ? (
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 mb-2">Masukkan Alamat Pengiriman</label>
                <textarea 
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Contoh: Gedung T6 Fakultas Bahasa dan Seni, Ruang 102"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-[80px]"
                />
                <p className="text-[10px] text-gray-400 mt-2">*Biaya pengiriman Rp 5.000 akan ditambahkan pada ringkasan</p>
              </div>
            ) : (
              <div className="mb-4 bg-red-50 p-3 rounded-xl border border-red-100">
                <p className="text-sm font-bold text-primary mb-1">Titik Pengambilan:</p>
                <p className="text-xs text-gray-700">Depan Gedung A10 UNESA. Silakan tunjukkan pesanan Anda ke petugas.</p>
              </div>
            )}
            
            <button 
              onClick={() => {
                if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
                  alert('Harap masukkan alamat pengiriman secara detail!');
                  return;
                }
                setIsLocationModalOpen(false);
              }}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primaryDark transition-all"
            >
              Konfirmasi Lokasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
