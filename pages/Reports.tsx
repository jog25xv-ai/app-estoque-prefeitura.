
import React, { useState } from 'react';
import { AppState, Transaction } from '../types.ts';
import { 
  FileBarChart, 
  Printer as PrintIcon, 
  Printer as PrinterIcon,
  Building2, 
  MapPin, 
  ArrowDownLeft, 
  ArrowUpRight,
  Package,
  Droplets,
  Cpu,
  ShieldCheck
} from 'lucide-react';

type ScopeType = 'Geral' | 'Secretaria' | 'Setor';

const Reports: React.FC<{ state: AppState }> = ({ state }) => {
  const [filterType, setFilterType] = useState<ScopeType>('Geral');
  const [selectedSecId, setSelectedSecId] = useState('');
  const [selectedSectorId, setSelectedSectorId] = useState('');

  const filteredTransactions = state.transactions.filter(t => {
    if (filterType === 'Secretaria' && selectedSecId) {
      return t.destinationSecretariatId === selectedSecId;
    }
    if (filterType === 'Setor' && selectedSectorId) {
      return t.destinationSectorId === selectedSectorId;
    }
    return true;
  });

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR');

  const getMaterial = (id: string) => {
    return state.materials.find(m => m.id === id);
  };

  const getPrinter = (id?: string) => {
    if (!id) return null;
    return state.printers.find(p => p.id === id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Relatórios e Auditoria</h2>
          <p className="text-slate-500 text-sm font-medium">Gere documentos oficiais de movimentação para prestação de contas (Ciclo 2026).</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
        >
          <PrintIcon size={18} />
          Imprimir Relatório
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap items-end gap-6 print:hidden">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Escopo do Relatório</label>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ScopeType)}
            className="w-48 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:border-brand outline-none transition-all"
          >
            <option value="Geral">Geral (Tudo)</option>
            <option value="Secretaria">Por Secretaria</option>
            <option value="Setor">Por Setor</option>
          </select>
        </div>

        {filterType !== 'Geral' && (
          <div className="space-y-2 animate-in slide-in-from-left-4 duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secretaria</label>
            <select 
              value={selectedSecId}
              onChange={(e) => {
                setSelectedSecId(e.target.value);
                setSelectedSectorId('');
              }}
              className="w-64 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:border-brand outline-none transition-all"
            >
              <option value="">Selecione...</option>
              {state.secretariats.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}

        {filterType === 'Setor' && (
          <div className="space-y-2 animate-in slide-in-from-left-4 duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Setor</label>
            <select 
              value={selectedSectorId}
              disabled={!selectedSecId}
              onChange={(e) => setSelectedSectorId(e.target.value)}
              className="w-64 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:border-brand outline-none disabled:opacity-50 transition-all"
            >
              <option value="">Selecione o Setor</option>
              {state.sectors.filter(s => s.secretariatId === selectedSecId).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="hidden print:flex flex-col items-center justify-center p-12 border-b-4 border-slate-900 text-center space-y-4 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Prefeitura Municipal de Santa Bárbara do Pará</h1>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Almoxarifado Central • Gestão de Insumos de Informática • Auditoria 2026</p>
          <div className="w-full flex justify-between pt-10 text-[10px] font-black uppercase text-slate-400">
            <span className="flex items-center gap-2"><ShieldCheck size={12} /> Escopo: {filterType}</span>
            <span>Data de Emissão: {formatDate(new Date().toISOString())}</span>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between mb-2 print:hidden">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Histórico Consolidado de Movimentações</h3>
            <span className="text-[10px] font-black text-brand bg-brand/10 px-4 py-1.5 rounded-full uppercase tracking-widest transition-colors">
              {filteredTransactions.length} registros auditados
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[1100px]">
              <thead>
                <tr className="border-b-2 border-slate-100 bg-slate-50/50 print:bg-transparent">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Suprimento / Tipo</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operação</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quant.</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destino / Equipamento</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTransactions.map(tx => {
                  const material = getMaterial(tx.materialId);
                  const printer = getPrinter(tx.printerId);
                  
                  return (
                    <tr key={tx.id} className="print:break-inside-avoid hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 text-xs font-bold text-slate-500">{formatDate(tx.date)}</td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                            {material?.name || 'Material Removido'}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                              material?.type === 'Toner' ? 'bg-slate-800 text-white' : 'bg-brand/20 text-brand'
                            }`}>
                              {material?.type === 'Toner' ? <Package size={10} /> : <Droplets size={10} />}
                              {material?.type || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-sm transition-colors ${
                          tx.type === 'IN' ? 'bg-emerald-600 text-white' : 'bg-brand text-white'
                        }`}>
                          {tx.type === 'IN' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center font-black text-slate-900">{tx.quantity}</td>
                      <td className="px-6 py-5">
                        {tx.type === 'OUT' ? (
                          <div className="space-y-2">
                            <div className="space-y-0.5">
                              <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">
                                {state.secretariats.find(s => s.id === tx.destinationSecretariatId)?.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {state.sectors.find(s => s.id === tx.destinationSectorId)?.name}
                              </p>
                            </div>
                            {printer && (
                              <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl w-fit group">
                                <PrinterIcon size={12} className="text-brand transition-colors" />
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-slate-800 uppercase leading-none">{printer.model}</span>
                                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-tighter">S/N: {printer.serialNumber}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-tight">{tx.supplier || 'AUDITADO'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Repos. Almoxarifado</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg w-fit">
                          {tx.type === 'OUT' ? (tx.requestDocNumber || '---') : `NF:${tx.invoiceNumber || '---'}`}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="py-24 text-center space-y-4 opacity-30">
              <FileBarChart size={64} className="mx-auto" />
              <p className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Sem dados para este filtro</p>
            </div>
          )}
        </div>

        <div className="hidden print:grid grid-cols-2 gap-20 px-20 pt-32 pb-10 text-center relative">
          <div className="border-t-2 border-slate-900 pt-6">
            <p className="text-xs font-black uppercase tracking-widest">Responsável pelo Almoxarifado</p>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Matrícula e Assinatura</p>
          </div>
          <div className="border-t-2 border-slate-900 pt-6">
            <p className="text-xs font-black uppercase tracking-widest">Recebedor do Suprimento</p>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Nome Legível e Unidade</p>
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 text-center opacity-70">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center gap-2">
                <div className="p-1 bg-slate-900 text-white rounded shadow-sm">
                  <ShieldCheck size={10} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">
                  Raimundo R Souza • Especialista em Segurança da Informação
                </p>
              </div>
              <p className="text-[7px] font-bold uppercase text-slate-500 tracking-widest">
                Software de Auditoria e Controle de Estoque • Ciclo 2026 • Santa Bárbara do Pará
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: landscape; margin: 1cm; }
          body { background: white !important; font-size: 10pt; color: black; }
          main { padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          .bg-brand, .text-brand { color: black !important; border-color: black !important; }
          table { width: 100% !important; border-collapse: collapse; }
          th, td { border-bottom: 1px solid #000 !important; }
          .bg-slate-50 { background-color: transparent !important; }
          .rounded-xl { border-radius: 4px !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default Reports;
