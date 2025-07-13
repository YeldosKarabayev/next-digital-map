"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Cable,
  Command,
  Frame,
  LifeBuoy,
  Map,
  MapPin,
  Palette,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import CustomAvatar from "./ui/customavatar"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react"



const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Пользователи",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Все пользователи",
          url: "#",
        },
        {
          title: "Добавить",
          url: "#",
        },
        {
          title: "Настройки",
          url: "#",
        },
      ],
    },
    {
      title: "Операторы",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Все операторы",
          url: "#",
        },
        {
          title: "Точки",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
}



interface AppSidebarProps {
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ setActiveTab, ...props }: AppSidebarProps) {

  const [userData, setUserData] = useState<{ email?: string; role?: string } | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data() as { email?: string; role?: string });
        }
      };
      fetchUserData();
    }
  }, [user]);

  const router = useRouter();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Map className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Map Service</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain}  />
        <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("users")}>
              <Users2 className="mr-2 size-4" />
              Пользователи
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setActiveTab("operators")}
              
            >
              <MapPin className="mr-2" size={24} />
              Операторы
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setActiveTab("addCable")}
              
            >
              <Cable className="mr-2" size={24} />
              Провайдеры
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("spots")}>
              <Palette className="mr-2 size-4" />
              Белые пятна
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/")}>
              <Map className="mr-2 size-4" />
              Карта
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("settings")}>
              <Settings2 className="mr-2 size-4" />
              Настройки
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <div className="flex items-center mr-5 space-x-2">
          <CustomAvatar username={userData?.email || ""} userRole={userData?.role || ""} />
          <div className="flex flex-col items-start">
            <span className="text-black">{userData?.email}</span>
            <span className="text-gray-700 text-[12px] ">{userData?.role}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
