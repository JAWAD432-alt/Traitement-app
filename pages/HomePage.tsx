import React from 'react';
import { Page } from '../App';
import { DocumentCheckIcon, ClipboardListIcon } from '../components/Icons';
import { SupabaseConnectionHelper } from '../components/SupabaseConnectionHelper';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const NavCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 text-center flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer group"
  >
    <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-wide uppercase">{title}</h2>
    <p className="text-slate-500">{description}</p>
  </div>
);

export function HomePage({ onNavigate }: HomePageProps): React.ReactNode {
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Système de Suivi d'Audit
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Votre tableau de bord central pour la gestion de la conformité</p>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-12">
        <SupabaseConnectionHelper />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <NavCard
            icon={<DocumentCheckIcon className="w-10 h-10" />}
            title="CHECKLIST SDA FSS"
            description="Accéder à la checklist de conformité interactive pour les audits."
            onClick={() => onNavigate('checklist')}
          />
          <NavCard
            icon={<ClipboardListIcon className="w-10 h-10" />}
            title="SCÉNARIO DÉROULEMENT AUDIT"
            description="Suivre le plan d'action et la progression de la préparation à l'audit."
            onClick={() => onNavigate('scenario')}
          />
        </div>
      </main>
    </>
  );
}