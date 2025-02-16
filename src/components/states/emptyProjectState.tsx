import React from 'react';
import { FolderPlus, Sparkles } from 'lucide-react';
import { NewProject } from '@/components/dialogs/new-project';

const EmptyProjectsState = () => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="relative">
        <div className="absolute -left-8 -top-8">
          <Sparkles className="h-6 w-6 animate-pulse text-purple-400" />
        </div>
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <FolderPlus className="h-12 w-12 text-slate-400" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6">
          <Sparkles className="h-5 w-5 animate-pulse text-purple-400" />
        </div>
      </div>

      <div className="max-w-sm space-y-2">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          No projects yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create your first project to get started. You can upload floor plans and manage your designs here.
        </p>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Need help? Check out our{' '}
          <a href="#" className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300">
            getting started guide
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmptyProjectsState;