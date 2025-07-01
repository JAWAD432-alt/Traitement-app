import React, { useState, useRef } from 'react';
import { ChecklistItem, ChecklistCategory } from '../../types';
import { isSupabaseConnected, supabase } from '../../src/supabaseClient';
import { PlusIcon, TrashIcon, PrinterIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, LoaderIcon, CheckIcon, XCircleIcon, ExclamationTriangleIcon, XIcon } from '../Icons';
import { Database } from '../../src/types/database.types';

type ChecklistItemInsert = Database['public']['Tables']['checklist_items']['Insert'];

interface InteractiveTableProps {
  data: ChecklistItem[];
  setData: (data: ChecklistItem[]) => void;
  category: ChecklistCategory;
  refetchData: () => void;
}

export function InteractiveTable({ data, setData, category, refetchData }: InteractiveTableProps): React.ReactNode {
  const [editingCell, setEditingCell] = useState<{ id: string; key: keyof ChecklistItem } | null>(null);
  const [cellSaveStatus, setCellSaveStatus] = useState<Record<string, 'saving' | 'success' | 'error'>>({});
  const importFileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const [newItem, setNewItem] = useState<Omit<ChecklistItem, 'id' | 'created_at' | 'category'>>({
      volet: '',
      critere: '',
      note: '',
      score: '',
      constats: '',
      action: '',
      resp: '',
      datePrevue: '',
      etat: '',
      original_id: null,
  });

  const handleCellChange = (id: string, key: keyof ChecklistItem, value: string | number) => {
    setData(data.map(row => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const handleSaveCell = async (id: string, key: keyof ChecklistItem) => {
    const cellKey = `${id}-${String(key)}`;
    setEditingCell(null);

    if (isSupabaseConnected) {
      const rowToUpdate = data.find(row => row.id === id);
      if (!rowToUpdate) return;
      
      setCellSaveStatus(prev => ({ ...prev, [cellKey]: 'saving' }));
      
      const { error } = await supabase
        .from('checklist_items')
        .update({ [key]: rowToUpdate[key] })
        .eq('id', id);

      if (error) {
        console.error("Erreur de mise à jour:", error);
        setCellSaveStatus(prev => ({ ...prev, [cellKey]: 'error' }));
        refetchData(); // Revert on error
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
    setNewItem({
        volet: '', critere: '', note: '', score: '', constats: '',
        action: '', resp: '', datePrevue: '', etat: '', original_id: null,
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
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSendNewItem = async () => {
    if (!newItem.critere) {
        setFormError("Veuillez remplir au moins le champ 'Critères'.");
        return;
    }
    setFormError(null);
    setIsSubmitting(true);
    setNotification(null);
    
    if (isSupabaseConnected) {
        const newRow: ChecklistItemInsert = { ...newItem, category: category };
        const { error } = await supabase.from('checklist_items').insert(newRow);
        if (error) {
            console.error("Erreur d'ajout:", error);
            setFormError(`Une erreur est survenue: ${error.message}`);
            setNotification({
                type: 'error',
                message: `Erreur de création : ${error.message}. Vérifiez que la sécurité (RLS) est bien ACTIVÉE sur la table et que votre règle autorise l'opération 'INSERT'.`
            });
        } else {
            refetchData();
            setIsAdding(false);
            setNotification({ type: 'success', message: 'Élément créé avec succès !' });
            setTimeout(() => setNotification(null), 5000);
        }
    } else {
        const newRow: ChecklistItem = {
            ...newItem,
            id: `local-${Date.now()}`,
            created_at: new Date().toISOString(),
            category: category,
        };
        setData([...data, newRow]);
        setIsAdding(false);
    }
    setIsSubmitting(false);
  };

  const handleDeleteRow = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
      setNotification(null);
      if (isSupabaseConnected) {
        const { error } = await supabase.from('checklist_items').delete().eq('id', id);
         if(error) {
          console.error("Erreur de suppression:", error);
          setNotification({
              type: 'error',
              message: `Erreur de suppression : ${error.message}. Vérifiez que la sécurité (RLS) est bien ACTIVÉE sur la table et que votre règle autorise l'opération 'DELETE'.`
          });
        } else {
          refetchData();
          setNotification({ type: 'success', message: 'Ligne supprimée avec succès !' });
          setTimeout(() => setNotification(null), 5000);
        }
      } else {
        setData(data.filter(row => row.id !== id));
      }
    }
  };

  const handleExportToCSV = () => {
    const headers = ['N°', 'Catégorie', 'Volet', 'Critère', 'Note', 'Score', 'Constats', 'Action', 'Responsable', 'Date Prévue', 'État'];
    const rows = data.map((row, index) =>
      [index + 1, row.category, row.volet, `"${(row.critere || '').replace(/"/g, '""')}"`, row.note, row.score, `"${(row.constats || '').replace(/"/g, '""')}"`, `"${(row.action || '').replace(/"/g, '""')}"`, row.resp, row.datePrevue, row.etat].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `checklist_${category}.csv`);
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
  
  const renderCell = (row: ChecklistItem, key: keyof ChecklistItem) => {
    const isEditing = editingCell?.id === row.id && editingCell?.key === key;
    const cellKey = `${row.id}-${String(key)}`;
    const status = cellSaveStatus[cellKey];
    const isNumeric = key === 'note' || key === 'score';
    const nonEditableKeys: (keyof ChecklistItem)[] = ['id', 'created_at', 'category', 'original_id'];
    
    if (nonEditableKeys.includes(key)) {
      return <span>{row[key]}</span>
    }

    if (isEditing && !status) {
      return (
        <input
          type={isNumeric ? 'number' : 'text'}
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

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
       <input
        type="file"
        accept=".csv"
        ref={importFileInputRef}
        onChange={handleImportFromCSV}
        className="hidden"
      />
      {notification && (
        <div className={`flex items-start gap-3 p-4 mb-4 rounded-lg border animate-fade-in ${notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <div className="flex-shrink-0">
                {notification.type === 'error' ? <ExclamationTriangleIcon className="w-5 h-5"/> : <CheckIcon className="w-5 h-5"/>}
            </div>
            <div className="flex-1 text-sm font-medium">
                {notification.message}
            </div>
            <button onClick={() => setNotification(null)} className="flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full hover:bg-black/10">
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
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Ajouter un nouveau critère</h3>
          {formError && (
             <div className="flex items-center gap-2 p-3 mb-4 bg-red-100 text-red-800 border border-red-200 rounded-md text-sm">
                <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0"/>
                <span>{formError}</span>
             </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label htmlFor="volet" className="block text-sm font-medium text-slate-600 mb-1">Volet</label>
                <input type="text" name="volet" id="volet" value={newItem.volet || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="critere" className="block text-sm font-medium text-slate-600 mb-1">Critères *</label>
                <textarea name="critere" id="critere" value={newItem.critere || ''} onChange={handleFormInputChange} rows={1} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
                <label htmlFor="note" className="block text-sm font-medium text-slate-600 mb-1">Note</label>
                <input type="text" name="note" id="note" value={newItem.note || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label htmlFor="score" className="block text-sm font-medium text-slate-600 mb-1">Score</label>
                <input type="text" name="score" id="score" value={newItem.score || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label htmlFor="etat" className="block text-sm font-medium text-slate-600 mb-1">État</label>
                <input type="text" name="etat" id="etat" value={newItem.etat || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div className="md:col-span-3">
                <label htmlFor="constats" className="block text-sm font-medium text-slate-600 mb-1">Constats</label>
                <textarea name="constats" id="constats" value={newItem.constats || ''} onChange={handleFormInputChange} rows={2} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div className="md:col-span-3">
                <label htmlFor="action" className="block text-sm font-medium text-slate-600 mb-1">Action</label>
                <textarea name="action" id="action" value={newItem.action || ''} onChange={handleFormInputChange} rows={2} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="resp" className="block text-sm font-medium text-slate-600 mb-1">Responsable</label>
                <input type="text" name="resp" id="resp" value={newItem.resp || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label htmlFor="datePrevue" className="block text-sm font-medium text-slate-600 mb-1">Date Prévue</label>
                <input type="date" name="datePrevue" id="datePrevue" value={newItem.datePrevue || ''} onChange={handleFormInputChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleCancelAdd} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Annuler</button>
              <button onClick={handleSendNewItem} disabled={isSubmitting} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed w-28">
                  {isSubmitting ? <><LoaderIcon className="w-5 h-5"/> Envoi...</> : 'Envoyer'}
              </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-2 border text-center font-semibold w-[50px]">N°</th>
              <th className="p-2 border text-left font-semibold">Volet</th>
              <th className="p-2 border text-left font-semibold w-1/4">Critères</th>
              <th className="p-2 border text-center font-semibold w-[60px]">Note</th>
              <th className="p-2 border text-center font-semibold w-[60px]">Score</th>
              <th className="p-2 border text-left font-semibold">Constats</th>
              <th className="p-2 border text-left font-semibold">Action</th>
              <th className="p-2 border text-center font-semibold w-[100px]">Resp.</th>
              <th className="p-2 border text-center font-semibold w-[110px]">Date Prévue</th>
              <th className="p-2 border text-center font-semibold w-[100px]">État</th>
              <th className="p-2 border text-center font-semibold w-[50px] no-print"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="p-2 border align-top text-center">{index + 1}</td>
                <td className="p-2 border align-top">{renderCell(row, 'volet')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'critere')}</td>
                <td className="p-2 border text-center align-top">{renderCell(row, 'note')}</td>
                <td className="p-2 border text-center align-top">{renderCell(row, 'score')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'constats')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'action')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'resp')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'datePrevue')}</td>
                <td className="p-2 border align-top">{renderCell(row, 'etat')}</td>
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
                <td colSpan={11} className="text-center p-8 text-slate-500 border">
                    <p className="font-semibold">Aucun critère pour cette catégorie.</p>
                    <p className="text-sm mt-1">Cliquez sur le bouton "+ Créer" pour en ajouter un.</p>
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </div>
  );
}