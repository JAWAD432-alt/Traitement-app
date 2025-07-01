import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { ScenarioAuditPage } from './pages/ScenarioAuditPage';
import { ChecklistPage } from './pages/ChecklistPage';

export type Page = 'home' | 'scenario' | 'checklist';

function App(): React.ReactNode {
  const [page, setPage] = useState<Page>('home');

  const navigate = (targetPage: Page) => {
    setPage(targetPage);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page) {
      case 'scenario':
        return <ScenarioAuditPage onNavigate={navigate} />;
      case 'checklist':
        return <ChecklistPage onNavigate={navigate} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {renderPage()}
    </div>
  );
}

export default App;