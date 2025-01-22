import {
  CalendarIcon,
  CarIcon,
  ChartBarStackedIcon,
  Home,
  MapPin,
  MessageCircleIcon,
  MessageSquareMoreIcon,
  User2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { paths } from "@/constants/paths";

export const SideBarItems = [
  {
    title: "Dashboard",
    url: paths.DASHBOARD.MAIN,
    icon: Home,
  },
  {
    title: "Users",
    url: paths.DASHBOARD.USERS.LIST,
    icon: User2Icon,
  },
  {
    title: "Car Rents",
    url: paths.DASHBOARD.RENTS.LIST,
    icon: CarIcon,
  },
  {
    title: "Categories",
    url: paths.DASHBOARD.CATEGORIES.LIST,
    icon: ChartBarStackedIcon,
  },
  {
    title: "Locations",
    url: paths.DASHBOARD.LOCATIONS.LIST,
    icon: MapPin,
  },
  {
    title: "Reservations",
    url: paths.DASHBOARD.RESERVATIONS.LIST,
    icon: CalendarIcon,
  },
  {
    title: "Reviews",
    url: paths.DASHBOARD.REVIEWS.LIST,
    icon: MessageSquareMoreIcon,
  },
  {
    title: "Chat",
    url: paths.DASHBOARD.CHAT.VIEW,
    icon: MessageCircleIcon,
  },
];
export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarGroupContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarGroupContent>
    </Sidebar>
  );
};
