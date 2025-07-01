
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Page } from '../App';
import { isSupabaseConnected, supabase } from '../src/supabaseClient';
import { AuditStep, ScenarioAction } from '../types';
import { ArrowLeftIcon } from '../components/Icons';
import { ScenarioTabs } from '../components/scenario/ScenarioTabs';
import { ScenarioTable } from '../components/scenario/ScenarioTable';
import { AUDIT_STEPS_DATA } from '../constants';
import { DataFetchError } from '../components/DataFetchError';


interface ScenarioAuditPageProps {
  onNavigate: (page: Page) => void;
}

export function ScenarioAuditPage({ onNavigate }: ScenarioAuditPageProps): React.ReactNode {
  const [steps, setSteps] = useState<Omit<AuditStep, 'actions'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [localStepsData, setLocalStepsData] = useState<AuditStep[]>(AUDIT_STEPS_DATA);
  const [activeStepActions, setActiveStepActions] = useState<ScenarioAction[]>([]);
  
  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    if (isSupabaseConnected) {
        const { data, error, count } = await supabase.from('scenarios').select('*', { count: 'exact' });

        if (error) {
          console.error("Erreur lors de la récupération des scénarios:", error);
          setFetchError(error);
          setLoading(false);
          return;
        }

        if (count === 0) {
          console.log("Seeding scenarios...");
          const scenariosToInsert = AUDIT_STEPS_DATA.map(({ id, title, completed }) => ({ id, title, completed }));
          const { error: insertError } = await supabase.from('scenarios').insert(scenariosToInsert);
          if (insertError) {
            console.error("Erreur lors de l'insertion des scénarios:", insertError);
            setFetchError(insertError);
          } else {
             const actionsToInsert = AUDIT_STEPS_DATA.flatMap(step => 
              step.actions.map(action => ({...action, scenario_id: step.id }))
             );
             const { error: actionsInsertError } = await supabase.from('scenario_actions').insert(actionsToInsert);
             if(actionsInsertError){
                 console.error("Erreur lors de l'insertion des actions:", actionsInsertError);
                 setFetchError(actionsInsertError);
             } else {
                fetchScenarios(); // Refetch after seeding
             }
          }
        } else {
          setSteps(data.sort((a,b) => a.id - b.id));
        }
    } else {
        const scenarios = localStepsData.map(({id, title, completed}) => ({id, title, completed, created_at: new Date().toISOString()}));
        setSteps(scenarios);
    }
    setLoading(false);
  }, [localStepsData]);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);
  
  const handleToggleCompletion = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    if (isSupabaseConnected) {
      const { error } = await supabase.from('scenarios').update({ completed: newStatus }).eq('id', id);
      if (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
      } else {
        setSteps(prevSteps => prevSteps.map(step => step.id === id ? { ...step, completed: newStatus } : step));
      }
    } else {
      setLocalStepsData(prev => prev.map(s => s.id === id ? {...s, completed: newStatus} : s));
    }
  };
  
  const activeStep = useMemo(() => {
    return steps.find(step => step.id === activeStepId);
  }, [steps, activeStepId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              SCÉNARIO DÉROULEMENT AUDIT
            </h1>
            <p className="text-slate-500 mt-1">Feuille de route pour la préparation de l'audit système</p>
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
            {loading ? (
                <div className="text-center py-4">Chargement des étapes...</div>
            ) : fetchError ? (
                <DataFetchError error={fetchError} onRetry={fetchScenarios} />
            ) : (
                <ScenarioTabs
                    steps={steps}
                    activeStepId={activeStepId}
                    setActiveStepId={setActiveStepId}
                    onToggleCompletion={handleToggleCompletion}
                />
            )}
        </div>
        <div className="mt-6 printable-area">
          {!fetchError && (
             activeStep ? (
              <ScenarioTable 
                  key={activeStep.id} 
                  stepId={activeStep.id}
              />
            ) : !loading && (
              <div className="text-center py-10 bg-white rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold text-slate-600">Veuillez sélectionner une étape.</h3>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}