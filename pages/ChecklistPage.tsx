import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Page } from '../App';
import { CHECKLIST_DATA } from '../data/checklistData';
import { ChecklistCategory, ChecklistItem } from '../types';
import { InteractiveTable } from '../components/checklist/InteractiveTable';
import { ChecklistTabs } from '../components/checklist/ChecklistTabs';
import { ArrowLeftIcon } from '../components/Icons';
import { isSupabaseConnected, supabase } from '../src/supabaseClient';
import { DataFetchError } from '../components/DataFetchError';


interface ChecklistPageProps {
  onNavigate: (page: Page) => void;
}

const CATEGORIES: ChecklistCategory[] = ['COMMUNS', 'PERSONNEL', 'INSTALLATIONS', 'LIGNES DE PRODUCTION', 'UTILITÉS'];

export function ChecklistPage({ onNavigate }: ChecklistPageProps): React.ReactNode {
  const [activeTab, setActiveTab] = useState<ChecklistCategory>('COMMUNS');
  const [checklistState, setChecklistState] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const fetchChecklistData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    if (isSupabaseConnected) {
        // More robust check to see if we need to seed data
        const { data: checkData, error: checkError } = await supabase.from('checklist_items').select('id').limit(1);

        if (checkError) {
          console.error("Erreur lors de la vérification des données:", checkError);
          // If RLS is not enabled, this check will fail. We should show the error.
          setFetchError(checkError);
          setLoading(false);
          return;
        }

        if (checkData.length === 0) {
            console.log("Seeding checklist items...");
             // Manually construct objects to ensure `id` is not included in the payload.
            const itemsToInsert = CHECKLIST_DATA.map(item => ({
                original_id: item.id,
                category: item.category,
                volet: item.volet,
                critere: item.critere,
                conformite: item.conformite,
                note: item.note,
                score: item.score,
                constats: item.constats,
                action: item.action,
                resp: item.resp,
                datePrevue: item.datePrevue,
                etat: item.etat
            }));

            const { error: insertError } = await supabase.from('checklist_items').insert(itemsToInsert);
            
            if(insertError) {
                console.error("Erreur lors de l'insertion des items de checklist:", insertError);
                setFetchError(insertError);
                setLoading(false);
                return;
            }
        }
        
        // Refetch data for the active tab after potential seeding
        const { data, error } = await supabase
          .from('checklist_items')
          .select('*')
          .eq('category', activeTab)
          .order('created_at');

        if (error) {
          console.error("Erreur de chargement de la checklist:", error);
          setFetchError(error as Error);
        } else {
          setChecklistState(data);
        }
    } else {
        const localData = CHECKLIST_DATA
            .filter(item => item.category === activeTab);
        setChecklistState(localData.map(item => ({...item, id: item.id || `local-${Math.random()}`, created_at: new Date().toISOString()})));
    }

    setLoading(false);
  }, [activeTab]);


  useEffect(() => {
     fetchChecklistData();
  }, [fetchChecklistData]);
  
  return (
    <>
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight uppercase">
              Checklist SDA FSS
            </h1>
            <p className="text-slate-500 mt-1">Checklist de conformité FSSC 22000 - V00</p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Accueil</span>
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="no-print">
          <ChecklistTabs
            categories={CATEGORIES}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        <div className="mt-6 printable-area">
          {loading ? (
             <div className="text-center py-10">Chargement...</div>
          ) : fetchError ? (
             <DataFetchError error={fetchError} onRetry={fetchChecklistData} />
          ) : (
             <InteractiveTable 
                key={activeTab} 
                data={checklistState}
                setData={setChecklistState}
                category={activeTab}
                refetchData={fetchChecklistData}
             />
          )}
        </div>
      </main>
    </>
  );
}