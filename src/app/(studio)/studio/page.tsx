"use client";
import QuickActions from "@/components/quickActions";
export const runtime = "edge";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <QuickActions />
    </div>
  );
}

