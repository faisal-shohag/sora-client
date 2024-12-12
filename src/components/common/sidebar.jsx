import { BookOpen, FileCog, FileSliders,GalleryVerticalEnd,Plus, PlusCircle, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"
import { NavUser } from "./nav-user"
import useAuth from "@/hooks/useAuth"

// Menu items.
const items = [
  {
    title: "Lessons",
    url: "lessons",
    icon: BookOpen,
  },
  {
    title: "Add Lessons",
    url: "add-lessons",
    icon: Plus,
  },
  {
    title: "Add Vocabularies",
    url: "add-vocabularies",
    icon: PlusCircle,
  },
  {
    title: "Manage Users",
    url: "manage-users",
    icon: Users,
  },
  {
    title: "Lesson Management",
    url: "lesson-management",
    icon: FileCog ,
  },
  {
    title: "Vocabulary Management",
    url: "vocabulary-management",
    icon: FileSliders ,
  },
]

export function AppSidebar() {

  const { user, logout } = useAuth()
  return (
    <Sidebar className="admin border-none">
      <SidebarHeader>
      <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">(~<span className="text-red-500">日本</span>~ Learn) Dashboard</span>
                <span className="mt-1">Admin</span>
              </div>
           
            </SidebarMenuButton>
     
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
          
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={logout}/>
      </SidebarFooter>
    </Sidebar>
  )
}
