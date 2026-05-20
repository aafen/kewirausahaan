import { useNavigate } from 'react-router-dom';
import { LogOut, PackageSearch, ChefHat, LayoutDashboard, TrendingUp, CheckCircle2, FileText, Calendar, CalendarDays, CalendarClock, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({ dailyQty: 0, dailyRev: 0, monthlyRev: 0, yearlyRev: 0 });
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' atau 'laporan'
  const [reportFilter, setReportFilter] = useState('harian'); // 'harian', 'bulanan', 'tahunan'

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  useEffect(() => {
    // Load from local storage
    let savedOrders = JSON.parse(localStorage.getItem('xuin_orders') || '[]');

    setOrders(savedOrders);

    // Calculate metrics
    const today = new Date();
    let dQty = 0, dRev = 0, mRev = 0, yRev = 0;

    savedOrders.forEach(order => {
      const orderDate = new Date(order.timestamp);
      
      const isSameDay = orderDate.toDateString() === today.toDateString();
      const isSameMonth = orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
      const isSameYear = orderDate.getFullYear() === today.getFullYear();

      if (isSameDay) {
        dQty += order.qty;
        dRev += order.total;
      }
      if (isSameMonth) {
        mRev += order.total;
      }
      if (isSameYear) {
        yRev += order.total;
      }
    });

    setMetrics({ dailyQty: dQty, dailyRev: dRev, monthlyRev: mRev, yearlyRev: yRev });
  }, []);

  const formatRp = (num) => {
    if (num === 0) return 'Rp 0';
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(1).replace('.0', '').replace('.', ',')} Jt`;
    } else if (num >= 1000) {
      return `Rp ${(num / 1000).toFixed(0)}K`;
    }
    return `Rp ${num}`;
  };

  const handleProcessOrder = (orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'Selesai' };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('xuin_orders', JSON.stringify(updatedOrders));
  };

  const handleResetData = () => {
    const confirm = window.confirm('Anda yakin ingin menghapus seluruh riwayat pesanan dan pendapatan?');
    if (confirm) {
      localStorage.removeItem('xuin_orders');
      setOrders([]);
      setMetrics({ dailyQty: 0, dailyRev: 0, monthlyRev: 0, yearlyRev: 0 });
    }
  };

  const activeOrdersCount = orders.filter(o => o.status !== 'Selesai').length;

  // Logika Filter Laporan
  const completedOrders = orders.filter(o => o.status === 'Selesai');
  const today = new Date();
  
  const filteredReportOrders = completedOrders.filter(order => {
    const orderDate = new Date(order.timestamp);
    if (reportFilter === 'harian') {
      return orderDate.toDateString() === today.toDateString();
    } else if (reportFilter === 'bulanan') {
      return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
    } else if (reportFilter === 'tahunan') {
      return orderDate.getFullYear() === today.getFullYear();
    }
    return true;
  });

  const reportTotalRevenue = filteredReportOrders.reduce((sum, order) => sum + order.total, 0);
  const reportTotalPorsi = filteredReportOrders.reduce((sum, order) => sum + order.qty, 0);

  const handleDownloadReport = () => {
    if (filteredReportOrders.length === 0) {
      alert("Tidak ada data transaksi untuk diunduh pada filter ini.");
      return;
    }

    // Gunakan pemisah titik koma (;) agar rapi dalam kolom di Excel berbahasa Indonesia
    const separator = ";";
    let csvContent = `ID Pesanan${separator}Tanggal${separator}Waktu${separator}Menu${separator}Jumlah Porsi${separator}Total Pendapatan (Rp)${separator}Status\n`;

    filteredReportOrders.forEach(order => {
      const dateStr = new Date(order.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      // Kutip nilai agar mencegah error jika ada spasi atau karakter khusus
      const row = `"${order.id}"${separator}"${dateStr}"${separator}"${order.time}"${separator}"${order.name}"${separator}"${order.qty}"${separator}"${order.total}"${separator}"${order.status}"`;
      csvContent += row + "\n";
    });

    csvContent += `\n${separator}${separator}${separator}${separator}TOTAL PENDAPATAN:${separator}"${reportTotalRevenue}"${separator}\n`;

    // Tambahkan BOM (\uFEFF) di awal agar Excel membaca file ini sebagai UTF-8 dengan format kolom yang benar
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_${reportFilter.toUpperCase()}_XUIN_UMKM.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto sm:border-x sm:border-gray-200 shadow-2xl relative">
      {/* Header Admin */}
      <div className="bg-primary p-6 text-white rounded-b-3xl shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon size={24} />
            <h1 className="font-black text-lg">{activeTab === 'dashboard' ? 'Admin Panel' : 'Laporan Keuangan'}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={handleResetData} className="bg-red-500/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-500/40 transition-colors">
              Reset Data
            </button>
            <button onClick={handleLogout} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
        {activeTab === 'dashboard' ? (
          <>
            <p className="text-sm text-white/80">Selamat datang kembali,</p>
            <p className="text-xl font-bold">Tim XUIN UMKM</p>
          </>
        ) : (
          <>
            <p className="text-sm text-white/80">Total Pendapatan Terfilter</p>
            <p className="text-3xl font-black">{formatRp(reportTotalRevenue)}</p>
          </>
        )}
      </div>

      {activeTab === 'dashboard' ? (
        // ========================== DASHBOARD VIEW ==========================
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 p-4 -mt-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2">
                <PackageSearch size={16} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Pesanan Harian</p>
              <p className="text-lg font-black text-gray-800 mt-1">{metrics.dailyQty} <span className="text-[10px] font-normal text-gray-400">Porsi</span></p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <TrendingUp size={16} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Pendapatan Harian</p>
              <p className="text-lg font-black text-gray-800 mt-1">{formatRp(metrics.dailyRev)}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                <TrendingUp size={16} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Pendapatan Bulanan</p>
              <p className="text-lg font-black text-gray-800 mt-1">{formatRp(metrics.monthlyRev)}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                <TrendingUp size={16} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Pendapatan Tahunan</p>
              <p className="text-lg font-black text-gray-800 mt-1">{formatRp(metrics.yearlyRev)}</p>
            </div>
          </div>

          {/* Active Orders */}
          <div className="px-4 mt-2 flex-1 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800">Pesanan Masuk Aktif</h2>
              <span className={`${activeOrdersCount > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} text-xs font-bold px-3 py-1 rounded-full`}>
                {activeOrdersCount} Antrean
              </span>
            </div>

            <div className="space-y-3 pb-8">
              {activeOrdersCount === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                  <ChefHat className="text-gray-300 mx-auto mb-2" size={32} />
                  <p className="text-sm text-gray-500 font-medium">Belum ada antrean pesanan baru</p>
                </div>
              ) : (
                orders.filter(o => o.status !== 'Selesai').map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-400">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-400">{order.id}</span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-800">{order.qty}x {order.name}</h3>
                    <p className="text-xs font-bold text-primary mt-1">{formatRp(order.total)}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-600`}>
                        {order.status}
                      </span>
                      <button 
                        onClick={() => handleProcessOrder(order.id)} 
                        className="bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-primary hover:text-white transition-colors"
                      >
                        <CheckCircle2 size={14} /> Tandai Selesai
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        // ========================== LAPORAN VIEW ==========================
        <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300 pb-8">
          {/* Filter Toggles */}
          <div className="px-4 -mt-6 relative z-10">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex">
              <button 
                onClick={() => setReportFilter('harian')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex justify-center items-center gap-1 transition-all ${reportFilter === 'harian' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <CalendarClock size={14} /> Harian
              </button>
              <button 
                onClick={() => setReportFilter('bulanan')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex justify-center items-center gap-1 transition-all ${reportFilter === 'bulanan' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <CalendarDays size={14} /> Bulanan
              </button>
              <button 
                onClick={() => setReportFilter('tahunan')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex justify-center items-center gap-1 transition-all ${reportFilter === 'tahunan' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Calendar size={14} /> Tahunan
              </button>
            </div>
          </div>

          {/* Report Summary Card */}
          <div className="px-4 mt-4">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-blue-600 mb-1">
                  {reportFilter === 'harian' ? 'Penjualan Hari Ini' : reportFilter === 'bulanan' ? 'Penjualan Bulan Ini' : 'Penjualan Tahun Ini'}
                </p>
                <p className="text-xl font-black text-gray-800">{reportTotalPorsi} Porsi Terjual</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                <FileText size={24} />
              </div>
            </div>
            
            <button 
              onClick={handleDownloadReport}
              className="w-full mt-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-all shadow-sm"
            >
              <Download size={18} className="text-primary" /> Unduh Laporan (CSV / Excel)
            </button>
          </div>

          {/* Report List */}
          <div className="px-4 mt-6">
            <h2 className="font-bold text-gray-800 mb-3 text-sm">Rincian Transaksi ({filteredReportOrders.length})</h2>
            
            <div className="space-y-3">
              {filteredReportOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Tidak ada riwayat transaksi pada filter ini.</p>
                </div>
              ) : (
                filteredReportOrders.map((order, i) => {
                  const dateStr = new Date(order.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">{order.qty}x {order.name}</h3>
                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                          <span>{order.id}</span>
                          <span>•</span>
                          <span>{dateStr} {order.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-sm">+{formatRp(order.total)}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">Selesai</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Footer Nav Admin */}
      <div className="bg-white border-t border-gray-100 p-4 mt-auto flex justify-around items-center sticky bottom-0 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
         <div 
           onClick={() => setActiveTab('dashboard')}
           className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'dashboard' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
         >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-bold mt-1">Dashboard</span>
         </div>
         <div 
           onClick={() => setActiveTab('laporan')}
           className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'laporan' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
         >
            <FileText size={24} />
            <span className="text-[10px] font-bold mt-1">Laporan</span>
         </div>
      </div>
    </div>
  );
}

// Komponen ikon kecil agar tidak perlu import baru
function ShieldCheckIcon({ size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  );
}
