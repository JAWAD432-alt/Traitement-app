
import React from 'react';
import { AuditStep } from '../../types';

interface ScenarioTabsProps {
  steps: Omit<AuditStep, 'actions'>[];
  activeStepId: number;
  setActiveStepId: (id: number) => void;
  onToggleCompletion: (id: number, currentStatus: boolean) => void;
}

export function ScenarioTabs({ steps, activeStepId, setActiveStepId, onToggleCompletion }: ScenarioTabsProps): React.ReactNode {
  return (
    <div className="flex flex-wrap gap-4 justify-center border-b border-slate-200 pb-6">
      {steps.map(step => {
        const isActive = activeStepId === step.id;
        const isCompleted = step.completed;

        const cardWrapperClasses = `
          relative flex-shrink-0 
          w-44 h-32 sm:w-48 sm:h-36
          transition-all duration-300 ease-in-out
        `;
        
        const buttonClasses = `
          p-3 font-medium rounded-xl transition-all duration-300 text-center
          flex flex-col items-center justify-center gap-1 h-full w-full
          border
          ${isActive
            ? 'bg-blue-600 text-white shadow-lg transform -translate-y-1 scale-105 border-blue-700'
            : isCompleted
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 hover:shadow-md hover:border-emerald-300'
            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:shadow-md hover:border-blue-400'
          }
        `;
        
        return (
          <div key={step.id} className={cardWrapperClasses}>
             <button
                onClick={() => setActiveStepId(step.id)}
                className={buttonClasses}
                aria-current={isActive ? 'step' : undefined}
             >
                <span className="font-bold text-xl text-slate-400">{step.id}</span>
                <span className="text-sm leading-tight font-semibold">{step.title}</span>
             </button>
             <div className="absolute top-2.5 right-2.5 z-10">
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleCompletion(step.id, step.completed)}
                    className="h-5 w-5 rounded-md border-slate-400/80 text-emerald-600 focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 cursor-pointer shadow-sm"
                    aria-label={`Marquer l'étape ${step.id} comme complétée`}
                />
             </div>
          </div>
        )
      })}
    </div>
  );
}
