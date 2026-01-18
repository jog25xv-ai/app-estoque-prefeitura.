
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';
import { MOCK_USER } from '../constants.tsx';
import { ShieldCheck, Mail, Lock, Building, User as UserIcon, ArrowRight, ArrowLeft, Smartphone, Code, Copyright } from 'lucide-react';

const Login: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: name || 'Novo Usuário',
        email: email,
        role: UserRole.VISUALIZADOR
      };
      onLogin(newUser);
    } else {
      onLogin({
        ...MOCK_USER,
        email: identifier.includes('@') ? identifier : MOCK_USER.email,
        name: !identifier.includes('@') ? identifier : MOCK_USER.name
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/20 blur-[120px] rounded-full transition-colors"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/20 blur-[120px] rounded-full transition-colors"></div>

      <div className="max-w-md w-full space-y-6 animate-in zoom-in-95 duration-700 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-brand/40 rotate-12 hover:rotate-0 transition-all duration-500">
            <Building className="w-10 h-10 text-slate-950" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Gestão de Insumos</h1>
            <p className="text-brand font-bold uppercase text-[10px] tracking-[0.2em] mt-1 transition-colors">
              Prefeitura de Santa Bárbara do Pará • 2026
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 sm:p-10 shadow-2xl border border-slate-200 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">
              {isRegistering ? 'Criar Nova Conta' : 'Acesso Restrito'}
            </h2>
            <p className="text-sm text-slate-700 font-medium">
              {isRegistering ? 'Preencha os dados para solicitar acesso ao almoxarifado.' : 'Identifique-se com seu Nome ou E-mail Institucional'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegistering ? (
              <>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest">Nome Completo</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all placeholder:text-slate-400"
                      placeholder="Ex: Maria Silva"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest">E-mail Institucional</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand transition-colors" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all placeholder:text-slate-400"
                      placeholder="servidor@prefeitura.gov.br"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest">Nome de Usuário ou E-mail</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all placeholder:text-slate-400"
                    placeholder="Ex: joao.almoxarife"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:border-brand outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <button 
                type="submit"
                className="w-full bg-brand text-slate-950 font-black py-5 rounded-[2rem] shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
              >
                {isRegistering ? 'Confirmar Cadastro' : 'Entrar no Sistema'}
                <ArrowRight size={18} className="text-slate-950" />
              </button>

              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full py-2 text-[10px] font-black text-slate-900 hover:text-brand transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                {isRegistering ? (
                  <>
                    <ArrowLeft size={14} className="text-slate-900" /> Voltar ao Início
                  </>
                ) : (
                  'Solicitar Novo Acesso'
                )}
              </button>
            </div>
          </form>

          {deferredPrompt && (
            <div className="pt-2 animate-in slide-in-from-top-4 duration-500">
              <button 
                onClick={handleInstall}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-[1.5rem] shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
              >
                <Smartphone size={16} />
                Baixar App (Instalar no Celular)
              </button>
            </div>
          )}

          <div className="pt-8 border-t border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-900 shrink-0 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <p className="text-[10px] text-slate-700 font-bold leading-relaxed">
              Sistema auditado sob protocolos de Segurança da Informação • Ciclo 2026.
            </p>
          </div>
        </div>
        
        <div className="text-center space-y-2 pb-4">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] opacity-60">
            Prefeitura de Santa Bárbara do Pará
          </p>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full group hover:bg-white/10 transition-all cursor-default shadow-sm backdrop-blur-md">
            <Code size={12} className="text-brand" />
            <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">
              Audit System: <span className="text-brand">Raimundo R Souza</span> • Especialista em Segurança
            </p>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <p className="text-[9px] text-slate-500 font-bold uppercase">2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
