import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideProps } from "lucide-react";

type Props = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  action: () => void;
  className: string;
};
export default function LeftSidebar({ tools }: { tools: Props[] }) {
  return (
    <div className="min-w-[50px] h-[90vh] flex flex-col gap-1 items-center">
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {tools.map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      onClick={item.action}
                      tooltip={{
                        children: item.label,
                        hidden: false,
                      }}
                      className={`px-2.5 md:px-2`}
                    >
                      <item.icon className={item.className} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
