"use client";
import * as React from "react";
import {
  ArchiveX,
  Command,
  Database,
  File,
  Inbox,
  Send,
  Trash2,
} from "lucide-react";
import { NewProject } from "@/components/dialogs/new-project";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProjectStore } from "@/store/project";
import { ProjectSkeleton } from "./skeletons/projects";
import { ProjectItem } from "./projectItem";
import EmptyProjectsState from "./states/emptyProjectState";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "./ui/button";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Projects",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Private Storage",
      url: "#",
      icon: Database,
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: Send,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
      isActive: false,
    },
  ],
  mails: [{ email: "akausehj" }],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  const { projects, loading } = useProjectStore();
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="md:h-8 md:p-0 bg-purple-900"
              >
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-900 text-sidebar-primary-foreground">
                    <Command className="size-4 " />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      // className="px-2.5 md:px-2"
                      className={`flex items-center gap-3 rounded-lg px-2.5 md:px-2 text-sm font-medium transition-colors ${
                        activeItem.title === item.title
                          ? "bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <item.icon  />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <NewProject />
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <ProjectSkeleton key={i} />
                ))
              ) : projects.length === 0 ? (
                <EmptyProjectsState />
              ) : (
                projects.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
