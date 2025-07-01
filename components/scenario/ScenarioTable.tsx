import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScenarioAction } from '../../types';
import { isSupabaseConnected, supabase } from '../../src/supabaseClient';
import { PlusIcon, TrashIcon, PrinterIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, LoaderIcon, CheckIcon, XCircleIcon, ExclamationTriangleIcon, XIcon } from '../Icons';
import { Database } from '../../src/types/database.types';
import { AUDIT_STEPS_DATA } from '../../constants';
import { DataFetchError } from '../DataFetchError';

type ScenarioActionInsert = Database['public']['Tables']['scenario_actions']['Insert'];

interface ScenarioTableProps {
  stepId: number;
}

export function ScenarioTable({ stepId }: ScenarioTableProps): React.ReactNode {
  const [data, setData] = useState<ScenarioAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [editingCell, setEditingCell] = useState<{ id: string; key: keyof ScenarioAction } | null>(null);
  const [cellSaveStatus, setCellSaveStatus] = useState<Record<string, 'saving' | 'success' | 'error'>>({});
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'error' | 'success', message: string } | null>(null);
  const [newAction, setNewAction] = useState<Omit<ScenarioAction, 'id' | 'created_at' | 'scenario_id'>>({
      point: '',
      action: '',
      statut: '',
      resp: '',
      datePrevue: '',
      commentaires: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    if (isSupabaseConnected) {
      const { data: actions, error } = await supabase
        .from('scenario_actions')
        .select('*')
        .eq('scenario_id', stepId)
        .order('created_at');

      if (error) {
        console.error("Erreur de chargement des actions:", error);
        setFetchError(error);
        setData([]);
      } else {
        setData(actions);
      }
    } else {
      const stepData = AUDIT_STEPS_DATA.find(s => s.id === stepId);
      setData(stepData ? stepData.actions.map(a => ({...a, id: a.id || `local-${Math.random()}`, created_at: new Date().toISOString(), scenario_id: stepId })) : []);
    }
    setLoading(false);
  }, [stepId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCellChange = (id: string, key: keyof ScenarioAction, value: string) => {
    setData(prevData => prevData.map(row => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const handleSaveCell = async (id: string, key: keyof ScenarioAction) => {
    const cellKey = `${id}-${String(key)}`;
    setEditingCell(null);

    if (isSupabaseConnected) {
      const rowToUpdate = data.find(row => row.id === id);
      if (!rowToUpdate) return;
      
      setCellSaveStatus(prev => ({ ...prev, [cellKey]: 'saving' }));

      const { error } = await supabase
        .from('scenario_actions')
        .update({ [key]: rowToUpdate[key] })
        .eq('id', id);

      if (error) {
        console.error("Erreur de mise à jour:", error);
        setCellSaveStatus(prev => ({ ...prev, [cellKey]: 'error' }));
        fetchData();
      } else {
         setCellSaveStatus(prev => ({ ...prev, [cellKey]: 'success' }));
      }
      
      setTimeout(() => {
        setCellSaveStatus(prev => {
          const { [cellKey]: _, ...rest } = prev;
          return rest;
        });
      }, 2000);
    }
  };

  const handleShowAddForm = () => {
    setNewAction({
      point: '',
      action: '',
      statut: '',
      resp: '',
      datePrevue: '',
      commentaires: '',
    });
    setFormError(null);
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormError(null);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewAction(prev => ({...prev, [name]: value}));
  };
  
  const handleSendNewAction = async () => {
    if (!newAction.point || !newAction.action) {
      setFormError("Veuillez remplir 'Point de Vérification' et 'Actions à Mener'.");
      return;
    }
    
    setFormError(null);
    setIsSubmitting(true);
    setAlert(null);

    if (isSupabaseConnected) {
        const newRow: ScenarioActionInsert = { ...newAction, scenario_id: stepId };
        const { data: insertedData, error } = await supabase.from('scenario_actions').insert(newRow).select().single();
        if (error) {
            console.error("Erreur d'ajout:", error);
            setFormError(`Une erreur est survenue: ${error.message}`);
            setAlert({
                type: 'error',
                message: `Erreur de création : ${error.message}. Vérifiez que la sécurité (RLS) est bien ACTIVÉE sur la table et que votre règle autorise l'opération 'INSERT'.`
            });
        } else if (insertedData) {
            setData(prev => [...prev, insertedData]);
            setIsAdding(false);
            setAlert({ type: 'success', message: 'Action créée avec succès !' });
            setTimeout(() => setAlert(null), 5000);
        }
    } else {
        const newRow: ScenarioAction = {
            ...newAction,
            id: `local-${Date.now()}`,
            created_at: new Date().toISOString(),
            scenario_id: stepId,
        };
        setData(prev => [...prev, newRow]);
        setIsAdding(false);
    }
    setIsSubmitting(false);
  };

  const handleDeleteRow = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
      setAlert(null);
      if (isSupabaseConnected) {
        const { error } = await supabase.from('scenario_actions').delete().eq('id', id);
        if(error) {
          console.error("Erreur de suppression:", error);
           setAlert({
              type: 'error',
              message: `Erreur de suppression : ${error.message}. Vérifiez que la sécurité (RLS) est bien ACTIVÉE sur la table et que votre règle autorise l'opération 'DELETE'.`
          });
        } else {
          setData(prevData => prevData.filter(row => row.id !== id));
          setAlert({ type: 'success', message: 'Ligne supprimée avec succès !' });
          setTimeout(() => setAlert(null), 5000);
        }
      } else {
        setData(prevData => prevData.filter(row => row.id !== id));
      }
    }
  };
  
  const handleExportToCSV = () => {
    const headers = ['N°', 'Point de Vérification', 'Actions à Mener', 'Statut', 'Responsable', 'Date Prévue', 'Commentaires'];
    const rows = data.map((row, index) =>
      [index + 1, `"${(row.point || '').replace(/"/g, '""')}"`, `"${(row.action || '').replace(/"/g, '""')}"`, row.statut, row.resp, row.datePrevue, `"${(row.commentaires || '').replace(/"/g, '""')}"`].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `scenario_etape_${stepId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleImportFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    alert("L'importation CSV doit être mise à jour pour fonctionner avec la base de données.");
  };

  const handlePrint = () => {
    window.print();
  };
  
  const renderCell = (row: ScenarioAction, key: keyof ScenarioAction) => {
    const isEditing = editingCell?.id === row.id && editingCell?.key === key;
    const cellKey = `${row.id}-${String(key)}`;
    const status = cellSaveStatus[cellKey];

    if (isEditing && !status) {
      return (
        <input
          type={key === 'datePrevue' ? 'date' : 'text'}
          value={row[key] || ''}
          onChange={(e) => handleCellChange(row.id, key, e.target.value)}
          onBlur={() => handleSaveCell(row.id, key)}
          onKeyDown={(e) => {
             if (e.key === 'Enter') handleSaveCell(row.id, key);
             if (e.key === 'Escape') setEditingCell(null);
          }}
          autoFocus
          className="w-full p-1 border border-blue-400 rounded bg-blue-50"
        />
      );
    }
    return (
      <div
        onClick={() => !status && setEditingCell({ id: row.id, key: key })}
        className={`w-full min-h-[24px] flex items-center justify-between ${!status ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span>{row[key]}</span>
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {status === 'saving' && <LoaderIcon className="w-4 h-4 text-blue-500" />}
          {status === 'success' && <CheckIcon className="w-5 h-5 text-emerald-500" />}
          {status === 'error' && <XCircleIcon className="w-5 h-5 text-red-500" />}
        </div>
      </div>
    );
  };
  
  if(loading) {
      return <div className="text-center py-10">Chargement des actions...</div>
  }

  if(fetchError){
      return <DataFetchError error={fetchError} onRetry={fetchData} />
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
      <input
        type="file"
        accept=".csv"
        ref={importFileInputRef}
        onChange={handleImportFromCSV}
        className="hidden"
      />
       {alert && (
        <div className={`flex items-start gap-3 p-4 mb-4 rounded-lg border animate-fade-in ${alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <div className="flex-shrink-0">
                {alert.type === 'error' ? <ExclamationTriangleIcon className="w-5 h-5"/> : <CheckIcon className="w-5 h-5"/>}
            </div>
            <div className="flex-1 text-sm font-medium">
                {alert.message}
            </div>
            <button onClick={() => setAlert(null)} className="flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full hover:bg-black/10">
                <XIcon className="w-5 h-5"/>
            </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-4 no-print">
        <button
          onClick={handleShowAddForm}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Créer
        </button>
         <button
          onClick={() => importFileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors"
        >
          <ArrowUpTrayIcon className="w-4 h-4" />
          Importer (Excel)
        </button>
         <button
          onClick={handleExportToCSV}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Exporter (Excel)
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
        >
          <PrinterIcon className="w-4 h-4" />
          Imprimer
        </button>
      </div>

      {isAdding && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Ajouter une nouvelle action</h3>
              {formError && (
                 <div className="flex items-center gap-2 p-3 mb-4 bg-red-100 text-red-800 border border-red-200 rounded-md text-sm">
                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0"/>
                    <span>{formError}</span>
                 </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                      <label htmlFor="point" className="block text-sm font-medium text-slate-600 mb-1">Point de Vérification *</label>
                      <input type="text" name="point" id="point" value={newAction.point || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  <div className="md:col-span-2">
                      <label htmlFor="action" className="block text-sm font-medium text-slate-600 mb-1">Actions à Mener *</label>
                      <textarea name="action" id="action" value={newAction.action || ''} onChange={handleFormInputChange} rows={3} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                  </div>
                  <div>
                      <label htmlFor="statut" className="block text-sm font-medium text-slate-600 mb-1">Statut</label>
                      <input type="text" name="statut" id="statut" value={newAction.statut || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  <div>
                      <label htmlFor="resp" className="block text-sm font-medium text-slate-600 mb-1">Responsable</label>
                      <input type="text" name="resp" id="resp" value={newAction.resp || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  <div>
                      <label htmlFor="datePrevue" className="block text-sm font-medium text-slate-600 mb-1">Date Prévue</label>
                      <input type="date" name="datePrevue" id="datePrevue" value={newAction.datePrevue || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  <div className="md:col-span-2">
                      <label htmlFor="commentaires" className="block text-sm font-medium text-slate-600 mb-1">Commentaires</label>
                      <textarea name="commentaires" id="commentaires" value={newAction.commentaires || ''} onChange={handleFormInputChange} rows={2} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                  </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                  <button onClick={handleCancelAdd} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Annuler</button>
                  <button onClick={handleSendNewAction} disabled={isSubmitting} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed w-32">
                      {isSubmitting ? <><LoaderIcon className="w-5 h-5" /> Envoi...</> : 'Envoyer'}
                  </button>
              </div>
          </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-2 border text-center font-semibold w-[50px]">N°</th>
              <th className="p-2 border text-left font-semibold w-1/5">Point de Vérification</th>
              <th className="p-2 border text-left font-semibold w-1/3">Actions à Mener</th>
              <th className="p-2 border text-center font-semibold w-[100px]">Statut</th>
              <th className="p-2 border text-center font-semibold w-[100px]">Resp.</th>
              <th className="p-2 border text-center font-semibold w-[120px]">Date Prévue</th>
              <th className="p-2 border text-left font-semibold">Commentaires</th>
              <th className="p-2 border text-center font-semibold w-[50px] no-print"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="p-2 border align-top text-center">{index + 1}</td>
                <td className="p-2 border align-top">{renderCell(row, 'point')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'action')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'statut')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'resp')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'datePrevue')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'commentaires')}</td>
                <td className="p-2 border text-center align-top no-print">
                  <button onClick={() => handleDeleteRow(row.id)} className="text-red-500 hover:text-red-700 p-1">
                    <TrashIcon className="w-5 h-5"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {data.length === 0 && !isAdding && (
              <tr>
                <td colSpan={8} className="text-center p-8 text-slate-500 border">
                    <p className="font-semibold">Aucune action pour cette étape.</p>
                    <p className="text-sm mt-1">Cliquez sur le bouton "+ Créer" pour en ajouter une.</p>
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </div>
  );
}