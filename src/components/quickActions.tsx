import React from "react";
import {
  FolderPlus,
  Database,
  Scale,
  Compass,
  Share2,
  MessageSquareMore,
} from "lucide-react";
import { NewProject } from "@/components/dialogs/new-project";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/project";

interface QuickActionCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  action: React.ReactNode;
  comingSoon?: boolean;
  gradient?: string;
}

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  action,
  comingSoon = false,
  gradient = "from-purple-500 to-purple-700",
}: QuickActionCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-white p-6 transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 
      ${
        comingSoon
          ? "opacity-80"
          : "hover:scale-102 hover:border-purple-200 dark:hover:border-purple-800"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            {comingSoon && (
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                Coming Soon
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="pt-2">{action}</div>
      </div>
    </div>
  );
};

const QuickActions = () => {
  const { projects } = useProjectStore();
  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Get started with these common tasks or explore new features
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create New Project */}
        <QuickActionCard
          icon={FolderPlus}
          title="Create New Project"
          description="Start a new architectural project by uploading your floor plans and designs."
          gradient="from-purple-500 to-purple-700"
          action={<NewProject />}
        />

        {/* Private Storage */}
        <QuickActionCard
          icon={Database}
          title="Private Storage"
          description="Access your secure storage for materials, textures, and custom assets."
          gradient="from-blue-500 to-blue-700"
          action={
            <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-200/50 transition-all hover:scale-105 hover:shadow-blue-300/50 dark:shadow-blue-900/50">
              Open Storage
            </button>
          }
        />

        {/* Material Calculator */}
        <QuickActionCard
          icon={Scale}
          title="Material Calculator"
          description="Calculate material quantities and costs for your projects."
          gradient="from-emerald-500 to-emerald-700"
          action={
            <button className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-200/50 transition-all hover:scale-105 hover:shadow-emerald-300/50 dark:shadow-emerald-900/50">
              Calculate Now
            </button>
          }
        />

        <QuickActionCard
          icon={Compass}
          title="3D Visualization"
          description="Transform your 2D plans into interactive 3D visualizations."
          gradient="from-orange-500 to-orange-700"
          comingSoon
          action={
            <button
              disabled
              className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            >
              Coming Soon
            </button>
          }
        />

        {/* Collaboration Hub */}
        <QuickActionCard
          icon={Share2}
          title="Collaboration Hub"
          description="Work together with team members and clients in real-time."
          gradient="from-pink-500 to-pink-700"
          comingSoon
          action={
            <button
              disabled
              className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            >
              Coming Soon
            </button>
          }
        />

        {/* AI Assistant */}
        <QuickActionCard
          icon={MessageSquareMore}
          title="AI Assistant"
          description="Get instant help with design suggestions and optimization."
          gradient="from-violet-500 to-violet-700"
          comingSoon
          action={
            <button
              disabled
              className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            >
              Coming Soon
            </button>
          }
        />
      </div>

      {/* Stats Section */}
      <div className="mt-12 grid gap-6 rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
        <div className="space-y-2 text-center">
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Active Projects
          </h4>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {projects.length}
          </p>
        </div>
        <div className="space-y-2 text-center">
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Storage Used
          </h4>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            0 GB
          </p>
        </div>
        <div className="space-y-2 text-center">
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Team Members
          </h4>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
