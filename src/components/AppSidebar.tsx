
import { BarChart3, Users, Palette, Building, Home, Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Criar Conteúdo", url: "/criar-conteudo", icon: Plus },
  { title: "Marcas", url: "/marcas", icon: Building },
  { title: "Personas", url: "/personas", icon: Users },
  { title: "Temas", url: "/temas", icon: Palette },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border/40 bg-background">
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-foreground transition-all duration-200 ${
            isCollapsed ? "text-sm text-center" : "text-lg"
          }`}>
            {isCollapsed ? "MC" : "Marketing Creator"}
          </h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {isCollapsed ? "Menu" : "Navegação"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`transition-colors ${
                      isActive(item.url) 
                        ? "bg-accent text-accent-foreground font-medium" 
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
