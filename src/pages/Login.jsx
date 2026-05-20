import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, User, X } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLoginAdmin, setIsLoginAdmin] = useState(false);
  const [isRegisterForm, setIsRegisterForm] = useState(false); // Mode Daftar untuk Pelanggan
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGooglePopup, setShowGooglePopup] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Hapus error saat mengetik
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi Keamanan (Wajib Isi)
    if (!formData.email || !formData.password) {
      setError('Email dan Kata Sandi wajib diisi!');
      return;
    }

    if (!isLoginAdmin && isRegisterForm && !formData.name) {
      setError('Nama Lengkap wajib diisi untuk mendaftar!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter demi keamanan.');
      return;
    }

    setIsLoading(true);

    // Simulasi Loading Keamanan Jaringan
    setTimeout(() => {
      setIsLoading(false);
      
      // Logika Role: Jika masuk lewat tab Admin, pastikan email admin
      if (isLoginAdmin) {
        if (formData.email === 'admin@xuin.com' && formData.password === 'josjis123') {
          // Simpan sesi Admin
          localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, role: 'admin' }));
          navigate('/admin');
        } else {
          setError('Kredensial Admin tidak valid! (Petunjuk: admin@xuin.com / josjis123)');
        }
      } else {
        // Logika Pelanggan
        if (isRegisterForm) {
          // Simulasi daftar sukses & langsung masuk
          localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, role: 'customer', name: formData.name, email: formData.email }));
          navigate('/');
        } else {
          // Simulasi login biasa
          localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, role: 'customer', email: formData.email }));
          navigate('/');
        }
      }
    }, 1500);
  };

  const handleGoogleLoginClick = () => {
    // Tampilkan Popup Akun Google
    setShowGooglePopup(true);
  };

  const handleSelectGoogleAccount = (email) => {
    // Tutup popup, mulai simulasi loading login
    setShowGooglePopup(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, role: 'customer', email: email }));
      navigate('/');
    }, 1500);
  };

  const handleSelectNewGoogleAccount = () => {
    // Tutup popup dan arahkan ke mode Daftar
    setShowGooglePopup(false);
    setIsRegisterForm(true);
    setError('');
  };

  const dummyGoogleAccounts = [
    { name: 'Mahasiswa UNESA', email: 'mahasiswa.unesa@gmail.com', avatar: 'M', bg: 'bg-blue-500' },
    { name: 'Budi Santoso', email: 'budi.santoso@gmail.com', avatar: 'B', bg: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative overflow-hidden max-w-md mx-auto sm:border-x sm:border-gray-200 shadow-2xl">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30 transform -rotate-6">
            <span className="text-3xl font-black italic">X</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800">XUIN UMKM</h1>
          <p className="text-gray-500 text-sm mt-1">Sistem Pemesanan Cerdas</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-200 p-1 rounded-xl mb-6 relative">
          <button 
            onClick={() => { setIsLoginAdmin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all duration-300 ${!isLoginAdmin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <User size={16} /> Pelanggan
          </button>
          <button 
            onClick={() => { setIsLoginAdmin(true); setError(''); setIsRegisterForm(false); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all duration-300 ${isLoginAdmin ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        {/* Login/Register Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            {isLoginAdmin 
               ? 'Masuk sebagai Administrator' 
               : (isRegisterForm ? 'Daftar Akun Baru' : 'Masuk sebagai Pelanggan')
            }
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg mb-4 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              {error}
            </div>
          )}

          {/* Name Input (Only for Register) */}
          {!isLoginAdmin && isRegisterForm && (
            <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-gray-600 mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 mb-2">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={isLoginAdmin ? "admin@xuin.com" : "email@anda.com"}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-600 mb-2">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2
              ${isLoginAdmin ? 'bg-primary hover:bg-primaryDark shadow-primary/30' : 'bg-gray-800 hover:bg-black shadow-gray-800/30'}
              ${isLoading ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {isLoading ? (
              <span className="animate-spin border-2 border-white/30 border-t-white w-5 h-5 rounded-full"></span>
            ) : (
               isLoginAdmin ? 'Otorisasi Keamanan' : (isRegisterForm ? 'Daftar Sekarang' : 'Masuk Sekarang')
            )}
          </button>

          {/* Toggle Register / Login */}
          {!isLoginAdmin && (
            <div className="mt-5 text-center">
              <p className="text-xs text-gray-500">
                {isRegisterForm ? 'Sudah punya akun? ' : 'Belum punya akun? '}
                <button 
                  type="button" 
                  onClick={() => { setIsRegisterForm(!isRegisterForm); setError(''); }} 
                  className="text-primary font-bold hover:underline focus:outline-none transition-colors"
                >
                  {isRegisterForm ? 'Masuk di sini' : 'Daftar di sini'}
                </button>
              </p>
            </div>
          )}
          
          {/* Google Login (Only for Customers, and maybe only on Login, but we'll show on both for convenience) */}
          {!isLoginAdmin && (
            <div className="mt-6 animate-in fade-in duration-300">
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t border-gray-200 w-full"></div>
                <div className="bg-white px-3 text-xs font-bold text-gray-400 absolute">ATAU</div>
              </div>
              <button 
                type="button"
                onClick={handleGoogleLoginClick}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-gray-700 bg-white border border-gray-200 shadow-sm flex justify-center items-center gap-3 hover:bg-gray-50 transition-all duration-300 transform active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Lanjutkan dengan Google
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8 relative z-10">
          Sistem Terenkripsi & Aman &copy; 2026 XUIN UMKM
        </p>
      </div>

      {/* Google Account Chooser Popup */}
      {showGooglePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => setShowGooglePopup(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-sm z-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 text-center border-b border-gray-100">
              <div className="flex justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-1">Pilih akun</h2>
              <p className="text-sm text-gray-600">untuk melanjutkan ke XUIN UMKM</p>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
              {dummyGoogleAccounts.map((acc, index) => (
                <div 
                  key={index} 
                  onClick={() => handleSelectGoogleAccount(acc.email)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full ${acc.bg} text-white flex items-center justify-center font-medium text-lg`}>
                    {acc.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{acc.name}</div>
                    <div className="text-xs text-gray-500">{acc.email}</div>
                  </div>
                </div>
              ))}
              
              <div 
                onClick={handleSelectNewGoogleAccount}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium text-lg">
                  <User size={20} />
                </div>
                <div className="font-medium text-gray-800 text-sm">Gunakan akun lain</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
