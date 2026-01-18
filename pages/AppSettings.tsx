
import React from 'react';
import { AppState, ThemeType } from '../types.ts';
import { Settings, BellRing, Database, Lock, Palette, CheckCircle2 } from 'lucide-react';

interface Props {
  state: AppState;
  onUpdateSettings: (settings: Partial<AppState['settings']>) => void;
}

const THEME_OPTIONS: { id: ThemeType; label: string; color: string }[] = [
  { id: 'blue', label: 'Azul Executivo', color: '#2563eb' },
  { id: 'emerald', label: 'Verde Sustentável', color: '#059669' },
  { id: 'purple', label: 'Roxo Moderno', color: '#7c3aed' },
  { id: 'slate', label: 'Slate Profissional', color: '#334155' },
  { id: 'orange', label: 'Alerta Laranja', color: '#ea580c' },
];

const AppSettingsPage: React.FC<Props> = ({ state, onUpdateSettings }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configurações</h2>
        <p className="text-slate-700 text-sm font-medium">Personalização e parâmetros globais de auditoria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-brand transition-colors">
            <Palette size={20} />
            <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Identidade Visual</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings({ theme: t.id })}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  state.settings.theme === t.id 
                  ? 'border-brand bg-brand/5 shadow-md scale-[1.02]' 
                  : 'border-slate-200 bg-slate-50 hover:border-brand/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full shadow-inner border border-white/20" style={{ backgroundColor: t.color }}></div>
                  <span className={`text-xs font-black uppercase tracking-tight ${state.settings.theme === t.id ? 'text-brand' : 'text-slate-900'}`}>
                    {t.label}
                  </span>
                </div>
                {state.settings.theme === t.id && <CheckCircle2 size={18} className="text-brand" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-brand transition-colors">
            <BellRing size={20} />
            <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Parâmetros de Alerta</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Estoque Crítico Global</label>
                <span className="px-3 py-1 bg-brand text-white text-xs font-black rounded-full transition-colors">
                  {state.settings.minQtyAlert} unid.
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={state.settings.minQtyAlert} 
                onChange={(e) => onUpdateSettings({ minQtyAlert: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand transition-colors"
              />
              <p className="mt-3 text-[10px] text-slate-700 font-bold leading-relaxed italic uppercase tracking-tight">
                * Novos itens herdarão este valor para alertas.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Notificações por E-mail</p>
                <p className="text-[10px] text-slate-700 font-bold uppercase tracking-tight opacity-70">Alertas diários para admins.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={state.settings.emailNotifications}
                  onChange={(e) => onUpdateSettings({ emailNotifications: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 text-slate-900">
            <Lock size={20} />
            <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Ferramentas de Gestão</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center gap-4 p-5 bg-slate-900 text-white rounded-[2rem] hover:bg-slate-800 transition-all group shadow-xl shadow-slate-200">
              <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-slate-700 transition-colors">
                <Database size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-tight">Backup Completo</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Exportar auditoria (JSON/CSV)</p>
              </div>
            </button>

            <button className="flex items-center gap-4 p-5 border-2 border-rose-200 bg-rose-50/50 text-rose-900 rounded-[2rem] hover:bg-rose-100 transition-all group">
              <div className="p-3 bg-rose-200 rounded-2xl group-hover:bg-rose-300 transition-colors">
                <Lock size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-tight">Sessões Ativas</p>
                <p className="text-[10px] text-rose-700 font-bold uppercase">Encerrar acesso em outros aparelhos</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettingsPage;
