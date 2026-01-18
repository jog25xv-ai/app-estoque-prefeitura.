
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  Printer as PrinterIcon, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ShieldCheck,
  Building,
  FileBarChart,
  Smartphone,
  Cpu,
  Copyright
} from 'lucide-react';

import { AppState, User, Transaction, UserRole, Sector, Secretariat, Printer } from './types.ts';
import { 
  INITIAL_MATERIALS, 
  INITIAL_SECRETARIATS, 
  INITIAL_SECTORS, 
  INITIAL_PRINTERS, 
  INITIAL_TRANSACTIONS, 
  MOCK_USER 
} from './constants.tsx';

// Pages
import Dashboard from './pages/Dashboard.tsx';
import Inventory from './pages/Inventory.tsx';
import RegisterExit from './pages/RegisterExit.tsx';
import RegisterEntry from './pages/RegisterEntry.tsx';
import Login from './pages/Login.tsx';
import SecretariatsManager from './pages/SecretariatsManager.tsx';
import PrintersManager from './pages/PrintersManager.tsx';
import UsersManager from './pages/UsersManager.tsx';
import AppSettingsPage from './pages/AppSettings.tsx';
import Reports from './pages/Reports.tsx';

const THEMES = {
  blue: { primary: '#2563eb', secondary: '#3b82f6', bg: '#eff6ff' },
  emerald: { primary: '#059669', secondary: '#10b981', bg: '#ecfdf5' },
  purple: { primary: '#7c3aed', secondary: '#8b5cf6', bg: '#f5f3ff' },
  slate: { primary: '#334155', secondary: '#475569', bg: '#f8fafc' },
  orange: { primary: '#ea580c', secondary: '#f97316', bg: '#fff7ed' }
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('gestao_insumos_state');
    if (saved) return JSON.parse(saved);
    
    return {
      user: MOCK_USER,
      materials: INITIAL_MATERIALS,
      transactions: INITIAL_TRANSACTIONS,
      secretariats: INITIAL_SECRETARIATS,
      sectors: INITIAL_SECTORS,
      printers: INITIAL_PRINTERS,
      settings: {
        minQtyAlert: 5,
        theme: 'blue',
        emailNotifications: true
      }
    };
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('gestao_insumos_state', JSON.stringify(state));
    const activeTheme = THEMES[state.settings.theme as keyof typeof THEMES] || THEMES.blue;
    const metaThemeColor = document.getElementById('theme-color-meta');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', activeTheme.primary);
    }
  }, [state]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const themeStyles = useMemo(() => {
    const activeTheme = THEMES[state.settings.theme as keyof typeof THEMES] || THEMES.blue;
    return `
      :root {
        --brand-primary: ${activeTheme.primary};
        --brand-secondary: ${activeTheme.secondary};
        --brand-bg-light: ${activeTheme.bg};
      }
      .bg-brand { background-color: var(--brand-primary); }
      .text-brand { color: var(--brand-primary); }
      .border-brand { border-color: var(--brand-primary); }
      .ring-brand { --tw-ring-color: var(--brand-primary); }
      .hover\\:bg-brand:hover { background-color: var(--brand-primary); }
      .focus\\:border-brand:focus { border-color: var(--brand-primary); }
    `;
  }, [state.settings.theme]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const handleLogin = (user: User) => setState(prev => ({ ...prev, user }));
  const handleLogout = () => setState(prev => ({ ...prev, user: null }));

  const updateSettings = (newSettings: Partial<AppState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const addTransaction = (tx: Transaction) => {
    setState(prev => {
      const materialIndex = prev.materials.findIndex(m => m.id === tx.materialId);
      if (materialIndex === -1) return prev;

      const newMaterials = [...prev.materials];
      const material = { ...newMaterials[materialIndex] };
      const quantityChange = tx.type === 'IN' ? tx.quantity : -tx.quantity;
      
      material.currentQty = Math.max(0, material.currentQty + quantityChange);
      material.lastUpdated = new Date().toISOString();
      newMaterials[materialIndex] = material;

      return {
        ...prev,
        materials: newMaterials,
        transactions: [tx, ...prev.transactions]
      };
    });
  };

  const addSecretariat = (name: string) => {
    const newSec: Secretariat = { id: `sec-${Date.now()}`, name };
    setState(prev => ({ ...prev, secretariats: [...prev.secretariats, newSec] }));
  };

  const removeSecretariat = (id: string) => {
    setState(prev => {
      const sectorsToRemove = prev.sectors.filter(s => s.secretariatId === id).map(s => s.id);
      return {
        ...prev,
        secretariats: prev.secretariats.filter(s => s.id !== id),
        sectors: prev.sectors.filter(s => s.secretariatId !== id),
        printers: prev.printers.filter(p => !sectorsToRemove.includes(p.sectorId))
      };
    });
  };

  const addSector = (name: string, secretariatId: string) => {
    const newSector: Sector = { id: `set-${Date.now()}`, name, secretariatId };
    setState(prev => ({ ...prev, sectors: [...prev.sectors, newSector] }));
  };

  const removeSector = (id: string) => {
    setState(prev => ({
      ...prev,
      sectors: prev.sectors.filter(s => s.id !== id),
      printers: prev.printers.filter(p => p.sectorId !== id)
    }));
  };

  const addPrinter = (printer: Omit<Printer, 'id'>) => {
    const newPrinter: Printer = { ...printer, id: `p-${Date.now()}` };
    setState(prev => ({ ...prev, printers: [...prev.printers, newPrinter] }));
  };

  const removePrinter = (id: string) => {
    setState(prev => ({ ...prev, printers: prev.printers.filter(p => p.id !== id) }));
  };

  if (!state.user) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdmin = state.user.role === UserRole.ADMIN;

  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <style>{themeStyles}</style>
      <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-100 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg transition-colors">
                  <Building size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-black text-sm leading-tight uppercase tracking-tight text-white">Santa Bárbara</h1>
                  <p className="text-[9px] text-brand font-bold tracking-widest uppercase opacity-80 transition-colors">Gestão de Insumos</p>
                </div>
              </div>
              <button className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400" onClick={() => setIsSidebarOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
              <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Painel de Controle" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/inventario" icon={<Search size={18} />} label="Consultar Estoque" onClick={() => setIsSidebarOpen(false)} />
              
              <div className="pt-6 pb-2">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Movimentações</p>
              </div>
              <SidebarLink to="/saida" icon={<ArrowUpRight size={18} />} label="Registrar Saída" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/entrada" icon={<ArrowDownLeft size={18} />} label="Registrar Entrada" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/relatorios" icon={<FileBarChart size={18} />} label="Relatórios e Auditoria" onClick={() => setIsSidebarOpen(false)} />

              <div className="pt-6 pb-2">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cadastros</p>
              </div>
              <SidebarLink to="/secretarias" icon={<Building2 size={18} />} label="Secretarias" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/impressoras" icon={<PrinterIcon size={18} />} label="Impressoras" onClick={() => setIsSidebarOpen(false)} />
              
              <div className="pt-6 pb-2">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configurações</p>
              </div>
              {isAdmin && <SidebarLink to="/usuarios" icon={<Users size={18} />} label="Usuários" onClick={() => setIsSidebarOpen(false)} />}
              <SidebarLink to="/configuracoes" icon={<Settings size={18} />} label="Parâmetros" onClick={() => setIsSidebarOpen(false)} />

              <div className="pt-10 pb-4 px-4">
                <div className="flex flex-col gap-1.5 opacity-30 hover:opacity-100 transition-all duration-500 group cursor-default p-4 border border-slate-800 rounded-2xl hover:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-brand/10 rounded-lg group-hover:bg-brand transition-colors">
                      <ShieldCheck size={12} className="text-brand group-hover:text-white" />
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-brand transition-colors">Segurança da Informação</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-tight text-white">Raimundo R Souza</p>
                    <p className="text-[7px] font-bold uppercase tracking-widest text-slate-500">Especialista em Segurança • 2026</p>
                  </div>
                </div>
              </div>
            </nav>

            <div className="p-4 bg-slate-950/40 border-t border-slate-800">
              {deferredPrompt && (
                <button 
                  onClick={handleInstall}
                  className="w-full flex items-center gap-3 p-3 bg-emerald-600/10 border border-emerald-600/20 text-emerald-400 rounded-xl mb-4 hover:bg-emerald-600/20 transition-all text-left"
                >
                  <Smartphone size={18} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase leading-tight">Instalar App</p>
                    <p className="text-[8px] font-bold opacity-60">Adicionar à tela inicial</p>
                  </div>
                </button>
              )}

              <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-2xl mb-4 border border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-xs font-bold text-white shadow-lg transition-colors">
                  {state.user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate text-white">{state.user.name}</p>
                  <p className="text-[10px] text-brand font-bold uppercase transition-colors">{state.user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-600/20 rounded-xl transition-all"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-2 lg:gap-4 ml-auto">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand/5 border border-brand/10 rounded-full text-[10px] font-bold text-brand uppercase tracking-tighter transition-colors">
                <ShieldCheck size={14} />
                Auditoria 2026 Ativa
              </div>
              <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-10">
            <Routes>
              <Route path="/" element={<Dashboard state={state} />} />
              <Route path="/inventario" element={<Inventory state={state} />} />
              <Route path="/saida" element={<RegisterExit state={state} onAddTransaction={addTransaction} />} />
              <Route path="/entrada" element={<RegisterEntry state={state} onAddTransaction={addTransaction} />} />
              <Route path="/relatorios" element={<Reports state={state} />} />
              <Route path="/secretarias" element={
                <SecretariatsManager 
                  state={state} 
                  onAddSecretariat={addSecretariat}
                  onRemoveSecretariat={removeSecretariat}
                  onAddSector={addSector} 
                  onRemoveSector={removeSector} 
                />
              } />
              <Route path="/impressoras" element={
                <PrintersManager 
                  state={state} 
                  onAddPrinter={addPrinter} 
                  onRemovePrinter={removePrinter}
                />
              } />
              <Route path="/configuracoes" element={<AppSettingsPage state={state} onUpdateSettings={updateSettings} />} />
              {isAdmin && <Route path="/usuarios" element={<UsersManager state={state} />} />}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
        ${isActive 
          ? 'bg-brand text-white shadow-xl shadow-brand/20' 
          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'}
      `}
    >
      <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand transition-colors'}`}>{icon}</span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </Link>
  );
};

export default App;
