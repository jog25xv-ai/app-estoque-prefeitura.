
import React, { useState } from 'react';
import { AppState, Transaction, DocType } from '../types.ts';
import { ArrowDownLeft, FileText, Building, Plus, ShieldCheck, MapPin, Building2, AlertCircle, Calendar, AlignLeft } from 'lucide-react';

interface Props {
  state: AppState;
  onAddTransaction: (tx: Transaction) => void;
}

const RegisterEntry: React.FC<Props> = ({ state, onAddTransaction }) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [invoice, setInvoice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [selectedSecId, setSelectedSecId] = useState('');
  const [selectedSectorId, setSelectedSectorId] = useState('');
  
  const [docType, setDocType] = useState<DocType>('Ofício');
  const [docNumber, setDocNumber] = useState('');
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [observations, setObservations] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const filteredSectors = state.sectors.filter(s => s.secretariatId === selectedSecId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedMaterialId) {
      setError('Por favor, selecione o material que está entrando.');
      return;
    }

    const qtyNum = Number(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('A quantidade deve ser um número válido maior que zero.');
      return;
    }

    if (!invoice.trim() || !supplier.trim()) {
      setError('Número da NF e Fornecedor são obrigatórios para auditoria.');
      return;
    }

    if (!selectedSecId || !selectedSectorId) {
      setError('Por favor, defina a Secretaria e Setor que receberão o item.');
      return;
    }

    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const newTx: Transaction = {
      id: `TX-IN-${Date.now()}-${randomSuffix}`,
      materialId: selectedMaterialId,
      type: 'IN',
      quantity: qtyNum,
      date: new Date().toISOString(),
      userId: state.user?.id || 'unknown',
      invoiceNumber: invoice,
      supplier: supplier,
      destinationSecretariatId: selectedSecId,
      destinationSectorId: selectedSectorId,
      requestDocType: docType,
      requestDocNumber: docNumber.trim() || undefined,
      requestDate: requestDate || undefined,
      observations: observations.trim() || undefined
    };

    onAddTransaction(newTx);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedMaterialId('');
      setQuantity(1);
      setInvoice('');
      setSupplier('');
      setSelectedSecId('');
      setSelectedSectorId('');
      setDocNumber('');
      setObservations('');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-brand/20 transition-colors">
          <ArrowDownLeft size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Registrar Entrada</h2>
          <p className="text-slate-500 text-sm font-medium">Reposição de estoque via Nota Fiscal ou Transferência.</p>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-brand/5 border-2 border-brand/10 p-12 rounded-[3rem] text-center space-y-6">
          <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-brand/20 animate-bounce transition-colors">
            <ShieldCheck size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Entrada Confirmada!</h3>
            <p className="text-slate-600 font-medium max-w-xs mx-auto mt-2">
              O saldo foi atualizado e o registro de auditoria arquivado.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={18} className="text-brand transition-colors" />
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Documentação e Itens</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Material Recebido</label>
                  <select 
                    value={selectedMaterialId}
                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                    required
                  >
                    <option value="">Selecione o material...</option>
                    {state.materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.brand})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quantidade</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Número da NF</label>
                    <input 
                      type="text" 
                      value={invoice}
                      onChange={(e) => setInvoice(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all"
                      placeholder="000.000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fornecedor</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all placeholder:text-slate-400"
                      placeholder="Nome da Empresa"
                      required
                    />
                  </div>
                </div>
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
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={18} className="text-brand transition-colors" />
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Destino Interno</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secretaria Responsável</label>
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
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Setor de Recebimento</label>
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
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-brand text-slate-950 font-black py-5 rounded-[2rem] shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              <Plus size={20} className="text-slate-950" />
              Confirmar Entrada de Material
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterEntry;
