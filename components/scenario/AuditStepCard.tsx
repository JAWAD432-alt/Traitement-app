import React from 'react';
import { AuditStep } from '../../types';
import { CheckIcon, CircleIcon } from '../Icons';

interface AuditStepCardProps {
  step: AuditStep;
  onToggleCompletion: (id: number) => void;
}

export function AuditStepCard({ step, onToggleCompletion }: AuditStepCardProps): React.ReactNode {
  const cardClasses = `
    bg-white rounded-xl shadow-md border transition-all duration-300 ease-in-out flex flex-col h-full
    ${step.completed ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:shadow-lg hover:border-blue-300'}
  `;

  const titleClasses = `
    font-bold text-lg
    ${step.completed ? 'text-emerald-800' : 'text-slate-800'}
  `;

  const textClasses = `
    text-sm prose prose-sm max-w-none
    ${step.completed ? 'text-emerald-700 opacity-80' : 'text-slate-600'}
  `;

  return (
    <div className={cardClasses}>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center mr-4 flex-1">
            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-sm ${step.completed ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
              {step.id}
            </span>
            <h3 className={titleClasses}>{step.title}</h3>
          </div>
          <button
            onClick={() => onToggleCompletion(step.id)}
            aria-label={`Marquer l'étape ${step.id} comme ${step.completed ? 'incomplète' : 'complétée'}`}
            className="flex-shrink-0 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-pressed={step.completed}
          >
            {step.completed ? <CheckIcon className="w-7 h-7 text-emerald-600" /> : <CircleIcon className="w-7 h-7 text-slate-400 hover:text-blue-600" />}
          </button>
        </div>
        <div className="border-t border-dashed border-slate-200 pt-4 mt-auto">
             <div
              className={textClasses}
              dangerouslySetInnerHTML={{ __html: step.actions }}
            />
        </div>
      </div>
    </div>
  );
}