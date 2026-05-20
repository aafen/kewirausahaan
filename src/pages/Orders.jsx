import { CheckCircle2, Clock, ChefHat, PackageCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Orders() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state || { name: 'Mie Jebew', price: '10K', qty: 1, total: 8000 };
  const qty = item.qty || 1;

  // State untuk melacak status pesanan secara real-time (simulasi)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Simulasi pergerakan status pesanan secara otomatis setiap 4 detik
    if (currentStepIndex < 3) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex]);

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  
  let finalTotal = item.total;
  if (!finalTotal) {
    const priceNumber = parseInt(item.price.replace(/\D/g, '')) * (item.price.includes('K') ? 1000 : 1);
    const totalOriginal = priceNumber * qty;
    finalTotal = totalOriginal - Math.floor(totalOriginal * 0.2);
  }

  const steps = [
    { id: 1, label: 'Pesanan Diterima', time: 'Baru Saja', icon: CheckCircle2 },
    { id: 2, label: 'Sedang Disiapkan', time: 'Antrean Dapur', icon: ChefHat },
    { id: 3, label: 'Sedang Dimasak', time: 'Proses Memasak', icon: Clock },
    { id: 4, label: 'Siap Diambil / Diantar', time: 'Selesai', icon: PackageCheck },
  ];

  const activeStatus = steps[currentStepIndex];

  return (
    <div className="min-h-full bg-gray-50 pb-8">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">Pesanan Saya</h1>
      </div>

      {/* Active Order Tracking */}
      <div className="p-4 mt-2">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-500">
          {/* Decorative background circle */}
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">XUIN UMKM</h2>
              <p className="text-xs text-gray-500 mt-1">Estimasi selesai: <span className="font-bold text-gray-800">~15 Menit</span></p>
              <p className="text-sm font-bold text-primary mt-2">{qty}x {item.name}</p>
            </div>
            
            {/* Dynamic Status Badge */}
            <div className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transition-colors duration-500 ${
              currentStepIndex === 3 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-primary'
            }`}>
              {activeStatus.label}
            </div>
          </div>

          {/* Timeline UI */}
          <div className="relative pl-6 border-l-2 border-gray-100 space-y-8 ml-2">
            {steps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="relative flex items-center gap-4">
                  {/* Icon Marker */}
                  <div className={`absolute -left-[35px] w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border-2 transition-colors duration-500 ${
                    isActive ? 'border-primary text-primary' : 'border-gray-200 text-gray-300'
                  }`}>
                    <step.icon size={16} className={isCurrent ? 'animate-pulse' : ''} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold transition-colors duration-500 ${
                      isActive ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h4>
                    <p className={`text-xs mt-0.5 transition-colors duration-500 ${
                      isActive ? 'text-gray-500' : 'text-gray-300'
                    }`}>
                      {isActive ? step.time : '--:--'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Riwayat Pemesanan</h2>
        
        <div 
          onClick={() => alert(`Detail riwayat pesanan: ${qty}x ${item.name} seharga ${formatRp(finalTotal)}`)}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase tracking-wider">Selesai</span>
            <span className="text-xs text-gray-500 font-medium">Beberapa hari yang lalu</span>
          </div>
          <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{qty}x {item.name}</p>
          <div className="mt-4 flex justify-between items-center border-t pt-4 border-gray-100">
            <span className="font-bold text-sm text-gray-800">{formatRp(finalTotal)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Mencegah alert dari div parent muncul
                navigate('/cart', { state: item });
              }}
              className="text-primary hover:bg-primary hover:text-white text-xs font-bold px-4 py-1.5 border border-primary rounded-full transition-colors z-10 relative"
            >
              Pesan Lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
