import React from "react";
import { MapPin, Calendar, Users, Target } from "lucide-react";

interface TrialCardProps {
  title: string;
  location: string;
  duration: string;
  sampleSize: string;
  treatmentDesc: string;
  outcomes: string[];
  impact: string;
  children?: React.ReactNode;
}

export function TrialCard({ title, location, duration, sampleSize, treatmentDesc, outcomes, impact, children }: TrialCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 mb-12">
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{title}</h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <MapPin className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Calendar className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Users className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" />
          <span>{sampleSize}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <div>
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-zinc-400" />
            Treatment vs Control
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            {treatmentDesc}
          </p>

          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Key Outcomes</h4>
          <ul className="space-y-2 mb-6">
            {outcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                {outcome}
              </li>
            ))}
          </ul>

          <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50 border-l-4 border-green-600">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <strong className="text-green-800 dark:text-green-400">Practical Impact: </strong>
              {impact}
            </p>
          </div>
        </div>
        
        {/* Optional Data Visualization Area */}
        {children && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 p-4 dark:bg-zinc-800/30 dark:border-zinc-800">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
