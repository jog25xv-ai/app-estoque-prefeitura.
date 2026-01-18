
import React, { useState } from 'react';
import { AppState } from '../types.ts';
import { Building2, Plus, ArrowRight, MapPin, Trash2, X, Check, Settings2, ShieldAlert } from 'lucide-react';

interface Props {
  state: AppState;
  onAddSecretariat: (name: string) => void;
  onRemoveSecretariat: (id: string) => void;
  onAddSector: (name: string, secretariatId: string) => void;
  onRemoveSector: (id: string) => void;
}

const SecretariatsManager: React.FC<Props> = ({ state, onAddSecretariat, onRemoveSecretariat, onAddSector, onRemoveSector }) => {
  const [configuringSecId, setConfiguringSecId] = useState<string | null>(null);
  const [isAddingSec, setIsAddingSec] = useState(false);
  const [newSecName, setNewSecName] = useState('');
  
  const [newSectorName, setNewSectorName] = useState('');

  const handleAddSec = () => {
    if (newSecName.trim()) {
      onAddSecretariat(newSecName.trim());
      setNewSecName('');
      setIsAddingSec(false);
    }
  };

  const handleRemoveSec = (id: string, name: string) => {
    if (window.confirm(`ATENÇÃO: Excluir a secretaria "${name}" removerá permanentemente TODOS os setores e equipamentos vinculados a ela. Deseja prosseguir com esta exclusão irreversível?`)) {
      onRemoveSecretariat(id);
      if (configuringSecId === id) setConfiguringSecId(null);
    }
  };

  const handleAddSector = (secretariatId: string) => {
    if (newSectorName.trim()) {
      onAddSector(newSectorName.trim(), secretariatId);
      setNewSectorName('');
    }
  };

  const handleRemoveSector = (id: string, name: string) => {
    if (window.confirm(`Confirma a exclusão da unidade "${name}"? Todas as impressoras vinculadas a este setor serão removidas da listagem ativa.`)) {
      onRemoveSector(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Secretarias e Setores</h2>
          <p className="text-slate-500 text-sm font-medium">Estrutura organizacional para destino de materiais.</p>
        </div>
        
        {isAddingSec ? (
          <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
            <input 
              autoFocus
              type="text"
              placeholder="Nome da secretaria..."
              value={newSecName}
              onChange={(e) => setNewSecName(e.target.value)}
              className="bg-white border-2 border-brand rounded-xl px-4 py-3 text-xs font-bold outline-none shadow-lg shadow-brand/10 w-48 md:w-64"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSec()}
            />
            <button onClick={handleAddSec} className="p-3 bg-brand text-white rounded-xl shadow-lg hover:bg-brand/90 transition-all">
              <Check size={18} />
            </button>
            <button onClick={() => { setIsAddingSec(false); setNewSecName(''); }} className="p-3 bg-slate-200 text-slate-500 rounded-xl hover:bg-slate-300 transition-all">
              <X size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingSec(true)}
            className="flex items-center gap-3 bg-brand text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={18} />
            Nova Secretaria
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {state.secretariats.map(sec => {
          const isConfiguring = configuringSecId === sec.id;
          const sectors = state.sectors.filter(s => s.secretariatId === sec.id);

          return (
            <div 
              key={sec.id} 
              className={`
                bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden flex flex-col
                ${isConfiguring ? 'border-brand ring-4 ring-brand/5 shadow-2xl scale-[1.01]' : 'border-slate-200 shadow-sm hover:border-brand/30'}
              `}
            >
              <div className={`p-8 border-b border-slate-100 flex items-center justify-between ${isConfiguring ? 'bg-brand/5' : 'bg-slate-50/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-white rounded-2xl shadow-sm border flex items-center justify-center transition-colors ${isConfiguring ? 'text-brand border-brand' : 'text-slate-400 border-slate-200'}`}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">{sec.name}</h3>
                    {isConfiguring && <span className="text-[9px] font-black text-brand uppercase tracking-widest">Painel Administrativo</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isConfiguring && (
                    <button 
                      onClick={() => handleRemoveSec(sec.id, sec.name)}
                      className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all group/del"
                      title="Excluir Secretaria"
                    >
                      <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                    </button>
                  )}
                  <button 
                    onClick={() => setConfiguringSecId(isConfiguring ? null : sec.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                      ${isConfiguring ? 'bg-slate-900 text-white shadow-lg' : 'text-brand hover:bg-brand/10'}
                    `}
                  >
                    {isConfiguring ? <Check size={14} /> : <Settings2 size={14} />}
                    {isConfiguring ? 'Finalizar' : 'Configurar'}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidades / Departamentos</p>
                  <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-0.5 rounded transition-all">
                    {sectors.length} Ativos
                  </span>
                </div>

                <div className="space-y-3">
                  {sectors.map(sector => (
                    <div key={sector.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-brand/40 transition-all">
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className={`transition-colors ${isConfiguring ? 'text-brand' : 'text-slate-300'}`} />
                        <span className="text-sm font-bold text-slate-600">{sector.name}</span>
                      </div>
                      
                      {isConfiguring ? (
                        <button 
                          onClick={() => handleRemoveSector(sector.id, sector.name)}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all group/sector-del"
                          title="Remover Unidade"
                        >
                          <Trash2 size={16} className="group-hover/sector-del:scale-110 transition-transform" />
                        </button>
                      ) : (
                        <ArrowRight size={14} className="text-slate-200 group-hover:text-brand transition-all" />
                      )}
                    </div>
                  ))}

                  {isConfiguring ? (
                    <div className="pt-4 animate-in slide-in-from-top-2">
                      <div className="relative group">
                        <input 
                          type="text"
                          placeholder="Nome da nova unidade..."
                          value={newSectorName}
                          onChange={(e) => setNewSectorName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSector(sec.id)}
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-4 pr-14 py-4 text-sm font-bold focus:border-brand focus:bg-white outline-none transition-all shadow-inner"
                        />
                        <button 
                          onClick={() => handleAddSector(sec.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-tight text-center">Pressione Enter para salvar</p>
                    </div>
                  ) : sectors.length === 0 ? (
                    <div className="py-8 text-center space-y-3 opacity-20">
                      <ShieldAlert size={32} className="mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma unidade vinculada</p>
                    </div>
                  ) : null}
                </div>
              </div>

              {isConfiguring && (
                <div className="px-8 py-4 bg-brand/5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                  <p className="text-[10px] text-brand font-black uppercase tracking-tight">Alterações sincronizadas no banco local</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecretariatsManager;
