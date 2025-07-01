
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps): React.ReactNode {
  const roundedProgress = Math.round(progress);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-700">Progression</span>
        <span className="text-sm font-medium text-blue-700">{roundedProgress}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${roundedProgress}%` }}
          aria-valuenow={roundedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label="Progression de la préparation de l'audit"
        ></div>
      </div>
    </div>
  );
}
