
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../types.ts';
import { 
  Package, 
  AlertCircle, 
  ArrowUpRight, 
  TrendingDown, 
  Clock,
  ChevronRight,
  ShieldCheck,
  Code,
  Cpu
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const totalItems = state.materials.length;
  const lowStockItems = state.materials.filter(m => m.currentQty <= m.minQty);
  const todaysMovements = state.transactions.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.date.startsWith(today);
  }).length;

  const consumptionBySecretariat = state.secretariats.map(sec => {
    const totalOut = state.transactions
      .filter(t => t.type === 'OUT' && t.destinationSecretariatId === sec.id)
      .reduce((sum, t) => sum + t.quantity, 0);
    return { name: sec.name.replace('Secretaria da ', '').replace('Secretaria de ', ''), value: totalOut };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Painel Geral</h2>
          <p className="text-slate-700 text-sm font-medium">Controle central de suprimentos Santa Bárbara • Ciclo 2026.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm uppercase tracking-widest">
          <Clock size={12} className="text-brand" />
          Atualizado: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Itens" value={totalItems} icon={<Package />} color="brand" trend="Estoque Ativo" />
        <StatCard title="Crítico" value={lowStockItems.length} icon={<AlertCircle />} color="red" highlight={lowStockItems.length > 0} trend="Ação Imediata" />
        <StatCard title="Saídas Hoje" value={todaysMovements} icon={<ArrowUpRight />} color="emerald" trend="Movimentação" />
        <StatCard title="Uso Global" value="12%" icon={<TrendingDown />} color="amber" trend="Consumo Médio" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Top 5 Consumo p/ Secretaria</h3>
            <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand w-2/3 transition-all"></div>
            </div>
          </div>
          
          <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
            {isMounted ? (
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={consumptionBySecretariat} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#475569', fontWeight: 800 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#475569', fontWeight: 800 }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={32}>
                    {consumptionBySecretariat.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--brand-primary)' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Calculando dimensões...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-full">
          <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm mb-6">Alertas Críticos</h3>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[350px]">
            {lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-12">
                <ShieldCheck size={48} className="opacity-20" />
                <p className="text-xs font-black text-center uppercase tracking-tight">Nenhum item abaixo do<br/>estoque mínimo.</p>
              </div>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-red-50/80 border border-red-200 rounded-2xl hover:bg-red-100/50 transition-colors group cursor-pointer">
                  <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <AlertCircle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate uppercase">{item.name}</p>
                    <p className="text-[10px] text-red-700 font-black uppercase tracking-tight">Qtd: {item.currentQty} • Mín: {item.minQty}</p>
                  </div>
                  <ChevronRight size={14} className="text-red-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => navigate('/relatorios')}
            className="mt-6 w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            Relatório de Reposição
          </button>
        </div>
      </div>

      <footer className="pt-16 pb-6 flex flex-col items-center justify-center gap-4 opacity-30 hover:opacity-100 transition-all duration-500 group">
        <div className="flex items-center gap-6">
          <div className="h-px w-12 bg-slate-300 group-hover:bg-brand transition-colors" />
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-brand group-hover:text-white transition-all">
                <ShieldCheck size={14} />
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">
                Raimundo R Souza
              </p>
            </div>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
              Especialista em Segurança da Informação • Departamento de TI
            </p>
          </div>
          <div className="h-px w-12 bg-slate-300 group-hover:bg-brand transition-colors" />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight">
            Gestão de Insumos Santa Bárbara do Pará
          </p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 • Auditoria & Controle Governamental.
          </p>
        </div>
      </footer>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  icon: React.ReactElement<any>; 
  color: string;
  trend: string;
  highlight?: boolean;
}> = ({ title, value, icon, color, trend, highlight }) => {
  const bgClasses: Record<string, string> = {
    brand: 'bg-brand',
    red: 'bg-red-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
  };

  return (
    <div className={`p-6 bg-white rounded-[2rem] border transition-all duration-300 ${highlight ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgClasses[color]} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20 transition-colors`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{trend}</span>
      </div>
      <p className="text-slate-600 text-xs font-black uppercase tracking-tight">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{value}</h4>
    </div>
  );
};

export default Dashboard;
