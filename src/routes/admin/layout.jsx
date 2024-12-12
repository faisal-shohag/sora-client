import { Outlet, useLocation } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/common/ThemeToggle";

export default function Layout() {
 
  const location = useLocation();
  const pathname = location.pathname;

  const path = {
    "/dashboard": "Dashboard",
    "/dashboard/lessons": "Lessons",
    "/dashboard/add-lessons": "Add Lessons",
    "/dashboard/add-vocabularies": "Add Vocabularies",
    "/dashboard/manage-users": "Manage Users",
    "/dashboard/lesson-management": "Lesson Management",
    "/dashboard/vocabulary-management": "Vocabulary Management",
  }

  const pageTitle = path[pathname] || pathname.split('/').pop()?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Dashboard";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="dark:bg-zinc-900 bg-zinc-100 w-full">
        <div className="dark:bg-zinc-950 h-full m-3 rounded-xl p-3 bg-white">
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div>{pageTitle}</div>
            </div>
            <ModeToggle/>
          </header>

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}