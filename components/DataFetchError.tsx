import React from 'react';
import { ExclamationTriangleIcon } from './Icons';

interface DataFetchErrorProps {
  error: Error;
  onRetry: () => void;
}

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <button onClick={handleCopy} className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-100 hover:bg-slate-500'}`}>
        {copied ? 'Copié !' : 'Copier'}
      </button>
    );
};

export function DataFetchError({ error, onRetry }: DataFetchErrorProps): React.ReactNode {
  const isRlsError = error?.message.includes('permission denied');
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

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg my-6 max-w-4xl mx-auto shadow-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold text-red-800">Erreur de Chargement des Données</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Impossible de communiquer avec la base de données. Voici le détail de l'erreur :</p>
            <pre className="mt-2 p-2 bg-red-100 rounded text-xs font-mono">{error.message}</pre>
          </div>
          {isRlsError && (
             <div className="mt-4">
                 <h4 className="font-bold text-red-900">Cause Probable : Problème de Permissions (RLS)</h4>
                 <p className="mt-1 text-sm text-red-800">
                     Votre base de données est connectée, mais elle bloque l'accès aux données. Pour résoudre ce problème, vous devez autoriser l'accès en exécutant le script SQL suivant dans l'<strong>Éditeur SQL</strong> de votre projet Supabase.
                 </p>
                 <div className="relative mt-3">
                    <pre className="bg-slate-800 text-slate-100 p-4 rounded-md text-sm overflow-x-auto">{sqlScript}</pre>
                    <CopyButton textToCopy={sqlScript} />
                 </div>
                  <a href="https://supabase.com/dashboard/project/ohaggwsfwirvbqqilvxf/sql/new" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Ouvrir l'Éditeur SQL de Supabase
                  </a>
             </div>
          )}
           <div className="mt-6">
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}