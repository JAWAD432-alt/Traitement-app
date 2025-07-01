import React, { useState, useEffect } from 'react';
import { supabase } from '../src/supabaseClient';

const Icon = ({ path, className = 'w-5 h-5' }: { path: string, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`absolute top-2.5 right-2.5 px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-100 hover:bg-slate-500'}`}>
      {copied ? 'Copié !' : 'Copier'}
    </button>
  );
};

const DiagnosticInfo = ({ label, value }: { label: string, value: string | undefined }) => {
  const displayValue = value ? `"${value}"` : "Non définie";
  const isDefined = !!value;
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-slate-600">{label}:</span>
      <code className={`px-2 py-0.5 rounded text-xs ${isDefined ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
        {displayValue}
      </code>
    </div>
  );
};

export function SupabaseConnectionHelper(): React.ReactNode {
  const [status, setStatus] = useState<'checking' | 'missing_env' | 'rls_issue' | 'connected'>('checking');
  const [isVisible, setIsVisible] = useState(true);

  // Directly get env vars for diagnostic display
  const detectedUrl = import.meta.env?.VITE_SUPABASE_URL;
  const detectedKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!detectedUrl || !detectedKey) {
      setStatus('missing_env');
      return;
    }

    const checkRls = async () => {
      // We perform a simple query. If it fails with a permission error, it's an RLS issue.
      const { error } = await supabase.from('scenarios').select('id', { count: 'exact', head: true });
      
      if (error && error.message.includes('permission denied')) {
        setStatus('rls_issue');
      } else if (error) {
        // Could be another connection error, but we'll still show RLS as a potential fix.
         setStatus('rls_issue');
      }
      else {
        setStatus('connected');
        setIsVisible(false); // Hide helper on success
      }
    };

    checkRls();
  }, [detectedUrl, detectedKey]);

  if (!isVisible || status === 'connected' || status === 'checking') {
    return null;
  }

  const sqlScript = `-- Activez RLS pour toutes les tables
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Supprimez les anciennes policies pour repartir de zéro
DROP POLICY IF EXISTS "Public access policy" ON public.scenarios;
DROP POLICY IF EXISTS "Public access policy" ON public.scenario_actions;
DROP POLICY IF EXISTS "Public access policy" ON public.checklist_items;

-- Créez des policies qui autorisent toutes les actions (accès public)
CREATE POLICY "Public access policy" ON public.scenarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access policy" ON public.scenario_actions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access policy" ON public.checklist_items FOR ALL USING (true) WITH CHECK (true);`;

  const envContent = `VITE_SUPABASE_URL="https://ohaggwsfwirvbqqilvxf.supabase.co"
VITE_SUPABASE_ANON_KEY="VOTRE_CLE_ANON_PUBLIQUE_ICI"`;

  const renderContent = () => {
    switch(status) {
        case 'missing_env':
            return (
                <>
                    <h4 className="font-bold text-lg text-slate-800">Étape 1: Configurer les Clés API</h4>
                    <p className="mt-1 text-slate-600">L'application ne trouve pas vos clés de connexion Supabase.</p>
                    <div className="mt-4 space-y-3">
                        <p>Créez ou ouvrez le fichier <code className="font-semibold text-blue-600">.env.local</code> à la racine de votre projet et collez-y le contenu ci-dessous.</p>
                        <div className="relative">
                           <pre className="bg-slate-800 text-slate-100 p-4 rounded-md text-sm overflow-x-auto">{envContent}</pre>
                           <CopyButton textToCopy={envContent} />
                        </div>
                        <p>Ensuite, trouvez votre clé API "anon" sur votre <a href="https://supabase.com/dashboard/project/ohaggwsfwirvbqqilvxf/settings/api" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-700">tableau de bord Supabase</a> et collez-la.</p>
                        <p className="font-semibold text-orange-600">N'oubliez pas d'arrêter et de redémarrer le serveur (`npm run dev`) après la modification !</p>
                    </div>
                </>
            );
        case 'rls_issue':
            return (
                 <>
                    <h4 className="font-bold text-lg text-slate-800">Étape 2: Autoriser l'accès</h4>
                    <p className="mt-1 text-slate-600">
                        <span className="font-semibold text-emerald-700">Bravo !</span> L'application est connectée à Supabase, mais les données sont protégées (par défaut).
                    </p>
                    <div className="mt-4 space-y-3">
                        <p>Pour autoriser l'application à lire et écrire les données, exécutez le script SQL ci-dessous dans l'<strong>Éditeur SQL</strong> de votre projet Supabase.</p>
                        <div className="relative">
                            <pre className="bg-slate-800 text-slate-100 p-4 rounded-md text-sm overflow-x-auto">{sqlScript}</pre>
                            <CopyButton textToCopy={sqlScript} />
                        </div>
                        <div className="flex gap-3">
                            <a href="https://supabase.com/dashboard/project/ohaggwsfwirvbqqilvxf/sql/new" target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                Ouvrir l'Éditeur SQL
                            </a>
                        </div>
                        <p className="mt-2 font-semibold text-orange-600">Après avoir exécuté le script, rechargez simplement cette page.</p>
                    </div>
                </>
            );
        default:
            return null;
    }
  }

  return (
    <div className="bg-white border-2 border-blue-200 p-6 rounded-2xl mb-8 shadow-lg relative transition-all duration-300">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Fermer l'aide"
      >
        <Icon path="M6 18L18 6M6 6l12 12" className="h-6 w-6" />
      </button>

      <div className="flex gap-4 items-center mb-4">
        <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-10 h-10 text-blue-500" />
        <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">Assistant de Configuration</h3>
      </div>
      
      <div className="border-t border-slate-200 my-4"></div>

      {renderContent()}

      <div className="border-t border-slate-200 my-4"></div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <h5 className="font-semibold text-slate-700 mb-2">Diagnostic en Temps Réel</h5>
        <div className="space-y-1">
          <DiagnosticInfo label="VITE_SUPABASE_URL" value={detectedUrl} />
          <DiagnosticInfo label="VITE_SUPABASE_ANON_KEY" value={detectedKey} />
        </div>
      </div>
    </div>
  );
}