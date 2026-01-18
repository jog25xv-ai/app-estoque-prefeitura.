
import React, { useState } from 'react';
import { AppState, Transaction, DocType } from '../types.ts';
import { 
  ArrowUpRight, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Calendar,
  AlignLeft
} from 'lucide-react';

interface Props {
  state: AppState;
  onAddTransaction: (tx: Transaction) => void;
}

const RegisterExit: React.FC<Props> = ({ state, onAddTransaction }) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSecId, setSelectedSecId] = useState('');
  const [selectedSectorId, setSelectedSectorId] = useState('');
  const [selectedPrinterId, setSelectedPrinterId] = useState('');
  
  const [docType, setDocType] = useState<DocType>('Ofício');
  const [docNumber, setDocNumber] = useState('');
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0]);
  const [observations, setObservations] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedMaterial = state.materials.find(m => m.id === selectedMaterialId);
  const filteredSectors = state.sectors.filter(s => s.secretariatId === selectedSecId);
  const filteredPrinters = state.printers.filter(p => p.sectorId === selectedSectorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedMaterialId) {
      setError('Por favor, selecione um material.');
      return;
    }

    if (!selectedMaterial) {
      setError('Material não encontrado no sistema.');
      return;
    }

    if (quantity > selectedMaterial.currentQty) {
      setError(`Quantidade indisponível. Saldo atual: ${selectedMaterial.currentQty}`);
      return;
    }

    if (quantity <= 0) {
      setError('A quantidade deve ser maior que zero.');
      return;
    }

    if (!selectedSecId || !selectedSectorId || !selectedPrinterId) {
      setError('Preencha todos os campos de destino.');
      return;
    }

    if (!docNumber) {
      setError('O número do documento é obrigatório para auditoria.');
      return;
    }

    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const newTx: Transaction = {
      id: `TX-OUT-${Date.now()}-${randomSuffix}`,
      materialId: selectedMaterialId,
      type: 'OUT',
      quantity,
      date: new Date().toISOString(),
      userId: state.user?.id || 'unknown',
      destinationSecretariatId: selectedSecId,
      destinationSectorId: selectedSectorId,
      printerId: selectedPrinterId,
      requestDocType: docType,
      requestDocNumber: docNumber,
      requestDate: requestDate,
      exitDate: exitDate,
      observations: observations.trim() || undefined
    };

    onAddTransaction(newTx);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedMaterialId('');
      setQuantity(1);
      setSelectedSecId('');
      setSelectedSectorId('');
      setSelectedPrinterId('');
      setDocNumber('');
      setObservations('');
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-slate-950 shadow-lg transition-colors">
          <ArrowUpRight size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Registrar Saída</h2>
          <p className="text-slate-500 text-sm font-medium">Baixa de materiais com vinculação a Ofício ou Memorando.</p>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-brand/5 border-2 border-brand/10 p-12 rounded-[3rem] text-center space-y-6">
          <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-brand/20 animate-bounce transition-colors">
            <ShieldCheck size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Saída Registrada!</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">
              O protocolo de auditoria foi gerado e o estoque atualizado conforme as regras fiscais.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={18} className="text-brand transition-colors" />
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Documentação e Material</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Suprimento Disponível</label>
                  <select 
                    value={selectedMaterialId}
                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                    required
                  >
                    <option value="">Selecione o material...</option>
                    {state.materials.map(m => (
                      <option key={m.id} value={m.id} disabled={m.currentQty === 0}>
                        {m.name} ({m.brand}) - Saldo: {m.currentQty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo de Documento</label>
                  <select 
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocType)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                    required
                  >
                    <option value="Ofício">Ofício</option>
                    <option value="Memorando">Memorando</option>
                    <option value="Processo Administrativo">Processo Administrativo</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Número do Registro</label>
                  <input 
                    type="text" 
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ex: 042/2023-GAB"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quantidade de Saída</label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Pedido</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="date" 
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Entrega</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="date" 
                        value={exitDate}
                        onChange={(e) => setExitDate(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <AlignLeft size={18} className="text-brand transition-colors" />
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Informações Adicionais</h3>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Observações (Opcional)</label>
                <textarea 
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Descreva detalhes relevantes sobre esta movimentação, se necessário..."
                  rows={3}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-medium text-slate-900 focus:border-brand outline-none transition-all resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border-2 border-rose-100 p-5 rounded-2xl flex items-center gap-4 text-rose-700 animate-in slide-in-from-top-2">
                <AlertCircle size={24} className="shrink-0" />
                <p className="text-xs font-black uppercase tracking-tight">{error}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-brand transition-colors" />
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Destino da Carga</h3>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secretaria Beneficiária</label>
                <select 
                  value={selectedSecId}
                  onChange={(e) => {
                    setSelectedSecId(e.target.value);
                    setSelectedSectorId('');
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                  required
                >
                  <option value="">Selecione...</option>
                  {state.secretariats.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Setor Solicitante</label>
                <select 
                  value={selectedSectorId}
                  disabled={!selectedSecId}
                  onChange={(e) => setSelectedSectorId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none disabled:opacity-50 transition-all"
                  required
                >
                  <option value="">Selecione o Setor</option>
                  {filteredSectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Equipamento Vinculado</label>
                <select 
                  value={selectedPrinterId}
                  disabled={!selectedSectorId}
                  onChange={(e) => setSelectedPrinterId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none disabled:opacity-50 transition-all"
                  required
                >
                  <option value="">Selecione a Impressora</option>
                  {filteredPrinters.map(p => (
                    <option key={p.id} value={p.id}>{p.model} (S/N: {p.serialNumber})</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-brand text-slate-950 font-black py-5 rounded-[2rem] shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              Finalizar Registro de Saída
              <ChevronRight size={20} className="text-slate-950" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterExit;
