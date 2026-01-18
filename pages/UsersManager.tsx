
import React from 'react';
import { AppState, UserRole } from '../types.ts';
import { Users, UserPlus, Shield, BadgeCheck, XCircle } from 'lucide-react';

const UsersManager: React.FC<{ state: AppState }> = ({ state }) => {
  const allUsers = [
    state.user,
    { id: 'u2', name: 'Maria Silva', email: 'maria.silva@prefeitura.gov.br', role: UserRole.VISUALIZADOR },
    { id: 'u3', name: 'Ricardo Gestor', email: 'ricardo@prefeitura.gov.br', role: UserRole.ADMIN },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Controle de Usuários</h2>
          <p className="text-slate-500 text-sm font-medium">Gerencie permissões e acessos ao sistema de estoque.</p>
        </div>
        <button className="flex items-center gap-3 bg-brand text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all">
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Papel / Nível</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allUsers.map((u, idx) => (
                <tr key={idx} className="hover:bg-brand/5 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-black shadow-inner group-hover:bg-brand group-hover:text-white transition-all">
                        {u?.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{u?.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{u?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-2 w-fit shadow-sm transition-colors ${
                      u?.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 
                      u?.role === UserRole.ALMOXARIFE ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u?.role === UserRole.ADMIN && <Shield size={12} />}
                      {u?.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      <BadgeCheck size={16} /> Ativo
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all" title="Desativar Conta">
                      <XCircle size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;
