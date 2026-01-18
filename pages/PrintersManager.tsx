
import React, { useState } from 'react';
import { AppState, Printer } from '../types.ts';
import { 
  Printer as PrinterIcon, 
  Plus, 
  Hash, 
  Tag, 
  MapPin, 
  QrCode, 
  X, 
  Download, 
  Printer as PrintIcon,
  ShieldCheck,
  Trash2,
  Check,
  ExternalLink
} from 'lucide-react';

interface Props {
  state: AppState;
  onAddPrinter: (printer: Omit<Printer, 'id'>) => void;
  onRemovePrinter: (id: string) => void;
}

const PrintersManager: React.FC<Props> = ({ state, onAddPrinter, onRemovePrinter }) => {
  const [selectedPrinterForQr, setSelectedPrinterForQr] = useState<Printer | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newModel, setNewModel] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newPatrimony, setNewPatrimony] = useState('');
  const [newSectorId, setNewSectorId] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newModel && newSerial && newPatrimony && newSectorId) {
      onAddPrinter({
        model: newModel,
        serialNumber: newSerial,
        patrimony: newPatrimony,
        sectorId: newSectorId
      });
      setIsAdding(false);
      setNewModel('');
      setNewSerial('');
      setNewPatrimony('');
      setNewSectorId('');
    }
  };

  const handleRemove = (id: string, model: string) => {
    if (window.confirm(`Deseja remover permanentemente a impressora "${model}" do sistema de auditoria?`)) {
      onRemovePrinter(id);
    }
  };

  const generateQrUrl = (printer: Printer) => {
    const sector = state.sectors.find(s => s.id === printer.sectorId);
    const secretariat = state.secretariats.find(sec => sec.id === sector?.secretariatId);
    const qrData = `PREFEITURA DE SANTA BÁRBARA\nEQUIPAMENTO: ${printer.model}\nPATRIMÔNIO: ${printer.patrimony}\nS/N: ${printer.serialNumber}\nLOCAL: ${sector?.name} - ${secretariat?.name}`;
    return `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=${encodeURIComponent(qrData)}&choe=UTF-8&chld=M|2`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestão de Impressoras</h2>
          <p className="text-slate-500 text-sm font-medium">Cadastro de equipamentos e localização física para auditoria.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-brand text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all"
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />}
          {isAdding ? 'Cancelar Cadastro' : 'Cadastrar Equipamento'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-8 rounded-[2.5rem] border-2 border-brand shadow-xl animate-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modelo do Equipamento</label>
              <input value={newModel} onChange={e => setNewModel(e.target.value)} placeholder="Ex: HP LaserJet P1102" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Número de Série (S/N)</label>
              <input value={newSerial} onChange={e => setNewSerial(e.target.value)} placeholder="Ex: ABC123XYZ" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patrimônio</label>
              <input value={newPatrimony} onChange={e => setNewPatrimony(e.target.value)} placeholder="Ex: 102030" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade/Setor Responsável</label>
              <select value={newSectorId} onChange={e => setNewSectorId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" required>
                <option value="">Selecione...</option>
                {state.sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="mt-6 w-full py-4 bg-brand text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-brand/90 transition-all">
            <Check size={14} /> Salvar Equipamento na Base
          </button>
        </form>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipamento</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">S/N e Patrimônio</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações de Identificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {state.printers.map(printer => {
                const sector = state.sectors.find(s => s.id === printer.sectorId);
                const secretariat = state.secretariats.find(sec => sec.id === sector?.secretariatId);
                
                return (
                  <tr key={printer.id} className="hover:bg-brand/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-brand transition-colors shadow-inner">
                          <PrinterIcon size={20} />
                        </div>
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{printer.model}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Hash size={12} className="text-brand" /> <span className="font-mono font-bold text-slate-600">S/N: {printer.serialNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Tag size={12} className="text-slate-400" /> <span className="font-mono font-bold text-slate-400">Pat: {printer.patrimony}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{sector?.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{secretariat?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => setSelectedPrinterForQr(printer)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 hover:bg-brand hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm group/qr"
                          title="Gerar Etiqueta"
                        >
                          <QrCode size={14} className="group-hover/qr:scale-110 transition-transform" />
                          Gerar QR
                        </button>
                        <button 
                          onClick={() => handleRemove(printer.id, printer.model)}
                          className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal - Redesenhado como Etiqueta de Patrimônio */}
      {selectedPrinterForQr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-800">
                <ShieldCheck size={18} className="text-brand" />
                <h3 className="text-xs font-black uppercase tracking-tight">Etiqueta de Identificação</h3>
              </div>
              <button onClick={() => setSelectedPrinterForQr(null)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-8 text-center bg-white print:p-0">
              {/* Card da Etiqueta */}
              <div className="p-6 border-4 border-slate-900 rounded-[2rem] space-y-4 shadow-sm bg-white">
                <div className="space-y-1">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Prefeitura de Santa Bárbara</h4>
                   <div className="h-0.5 w-12 bg-brand mx-auto rounded-full" />
                </div>
                
                <div className="mx-auto w-fit p-3 bg-white border border-slate-100 rounded-2xl">
                  <img 
                    src={generateQrUrl(selectedPrinterForQr)} 
                    alt="Identificação QR" 
                    className="w-40 h-40 block" 
                  />
                </div>

                <div className="space-y-1">
                  <h5 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">
                    {selectedPrinterForQr.model}
                  </h5>
                  <div className="flex flex-col gap-0.5 mt-2">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                      S/N: <span className="font-mono text-slate-900 font-black">{selectedPrinterForQr.serialNumber}</span>
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                      Patrimônio: <span className="font-mono text-slate-900 font-black">{selectedPrinterForQr.patrimony}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
                  <MapPin size={10} />
                  <span className="text-[8px] font-black uppercase tracking-widest truncate max-w-[200px]">
                    {state.sectors.find(s => s.id === selectedPrinterForQr.sectorId)?.name}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-brand/5 rounded-2xl border border-brand/10 flex items-center gap-3 text-left">
                 <div className="w-8 h-8 bg-brand text-white rounded-lg flex items-center justify-center shrink-0">
                    <QrCode size={16} />
                 </div>
                 <p className="text-[9px] text-brand font-black uppercase tracking-tight leading-relaxed">
                   Aponte a câmera para consultar o histórico de suprimentos vinculado a este equipamento.
                 </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.print()} 
                className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <PrintIcon size={14} /> Imprimir
              </button>
              <a 
                href={generateQrUrl(selectedPrinterForQr)} 
                download={`etiqueta-${selectedPrinterForQr.serialNumber}.png`} 
                className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 text-slate-800 text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
              >
                <Download size={14} /> Baixar
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0, .fixed.inset-0 * { visibility: visible; }
          .fixed.inset-0 { position: absolute; left: 0; top: 0; width: 100%; height: auto; background: white !important; }
          .fixed.inset-0 button, .fixed.inset-0 a { display: none !important; }
          .bg-slate-900\\/60 { background: transparent !important; backdrop-filter: none !important; }
          .rounded-\\[2\\.5rem\\], .rounded-2xl { border-radius: 0 !important; border: none !important; box-shadow: none !important; }
          .p-8, .p-6 { padding: 0 !important; }
          .modal-container { margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default PrintersManager;
