
import React from 'react';

export function Header(): React.ReactNode {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Plan d'Action d'Audit
        </h1>
        <p className="text-slate-500 mt-1">Feuille de route pour la préparation de l'audit système</p>
      </div>
    </header>
  );
}
