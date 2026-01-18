
import React, { useState } from 'react';
import { AppState, Material } from '../types.ts';
import { 
  Search, 
  History, 
  Package, 
  Droplets, 
  X,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  AlignLeft
} from 'lucide-react';

const Inventory: React.FC<{ state: AppState }> = ({ state }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [selectedMaterialForHistory, setSelectedMaterialForHistory] = useState<Material | null>(null);

  const filteredMaterials = state.materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Todos' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getMaterialTransactions = (materialId: string) => {
    return state.transactions.filter(t => t.materialId === materialId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Inventário Geral</h2>
          <p className="text-slate-500 text-sm font-medium">Controle auditado por modelo e número de série.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar material..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:border-brand outline-none w-full md:w-64 transition-all"
            />
          </div>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black text-slate-600 focus:border-brand outline-none cursor-pointer uppercase tracking-tight transition-all"
          >
            <option>Todos</option>
            <option>Toner</option>
            <option>Tinta</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[1000px] border-separate border-spacing-0">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Suprimento</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Marca</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Modelo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estoque</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMaterials.map((m, index) => {
                const isLowStock = m.currentQty <= m.minQty;
                return (
                  <tr 
                    key={m.id} 
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`
                      transition-all duration-300 group relative
                      animate-in fade-in slide-in-from-left-4
                      ${isLowStock ? 'bg-red-50/40 hover:bg-red-50' : 'hover:bg-brand/5'}
                    `}
                  >
                    <td className="px-8 py-5 relative">
                      {/* Subtle indicator bar on hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                      
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 ${
                          isLowStock 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-brand/10 text-brand'
                        }`}>
                          {m.type === 'Toner' ? <Package size={20} /> : <Droplets size={20} />}
                        </div>
                        <div>
                          <p className={`text-sm font-black uppercase tracking-tight transition-colors ${isLowStock ? 'text-red-900' : 'text-slate-800'} group-hover:text-brand`}>
                            {m.name}
                          </p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest transition-opacity ${isLowStock ? 'text-red-400' : 'text-slate-400'}`}>
                            {m.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-500 uppercase">{m.brand}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-500">{m.model}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-lg font-black transition-all group-hover:scale-125 inline-block ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
                        {m.currentQty}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {m.currentQty === 0 ? (
                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase tracking-widest">Esgotado</span>
                      ) : m.currentQty <= m.minQty ? (
                        <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest animate-pulse">Crítico</span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black rounded-full uppercase tracking-widest">Regular</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelectedMaterialForHistory(m)}
                        className={`
                          p-3 text-slate-400 rounded-2xl transition-all duration-300
                          hover:text-brand hover:bg-brand/10 hover:shadow-lg hover:shadow-brand/10
                          active:scale-90 group/btn
                        `}
                      >
                        <History size={20} className="group-hover/btn:rotate-[-45deg] transition-transform duration-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit History Modal */}
      {selectedMaterialForHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand/20 transition-colors">
                  <History size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedMaterialForHistory.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-brand font-black uppercase tracking-widest transition-colors">Linha do Tempo de Auditoria</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{selectedMaterialForHistory.brand} • {selectedMaterialForHistory.model}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedMaterialForHistory(null)} className="p-3 hover:bg-slate-200 rounded-2xl text-slate-400 transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {getMaterialTransactions(selectedMaterialForHistory.id).length === 0 ? (
                <div className="text-center py-20 opacity-20">
                  <History size={80} className="mx-auto mb-4" />
                  <p className="font-black uppercase tracking-widest">Sem movimentações</p>
                </div>
              ) : getMaterialTransactions(selectedMaterialForHistory.id).map((tx) => {
                const secretariat = state.secretariats.find(s => s.id === tx.destinationSecretariatId);
                const sector = state.sectors.find(s => s.id === tx.destinationSectorId);
                
                return (
                  <div key={tx.id} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row gap-8 hover:border-brand/30 transition-all group">
                    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-sm ${tx.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-brand/10 text-brand'} transition-colors`}>
                      {tx.type === 'IN' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${tx.type === 'IN' ? 'bg-emerald-600 text-white' : 'bg-brand text-white'} transition-colors shadow-sm`}>
                            {tx.type === 'IN' ? 'Entrada Fiscal' : 'Saída Administrativa'}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                            <Calendar size={12} className="text-brand transition-colors" /> {formatDateTime(tx.date)}
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">ID: {tx.id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Quantidade</p>
                          <p className="text-xl font-black text-slate-900">{tx.quantity} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Unidades</span></p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Referência</p>
                          <p className="text-sm font-black text-brand transition-colors truncate">
                            {tx.type === 'OUT' ? `${tx.requestDocType || 'Doc'}: ${tx.requestDocNumber || '---'}` : `NF: ${tx.invoiceNumber || '---'}`}
                          </p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Responsável</p>
                          <p className="text-xs font-bold text-slate-700 truncate capitalize">{tx.userId}</p>
                        </div>
                      </div>

                      {tx.observations && (
                        <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10 transition-colors">
                           <div className="flex items-center gap-2 mb-1">
                             <AlignLeft size={12} className="text-brand transition-colors" />
                             <p className="text-[9px] text-brand font-black uppercase tracking-widest transition-colors">Notas Internas</p>
                           </div>
                           <p className="text-xs text-slate-600 font-medium italic">"{tx.observations}"</p>
                        </div>
                      )}

                      {tx.type === 'OUT' && (
                        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Secretaria Destino</p>
                            <p className="text-xs font-black text-slate-800">{secretariat?.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Unidade / Setor</p>
                            <p className="text-xs font-bold text-slate-600">{sector?.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedMaterialForHistory(null)} 
                className="px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-200"
              >
                Concluir Auditoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
