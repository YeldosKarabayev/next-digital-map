'use client'

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AdminPanel from "../admin/page";



export default function Page() {

  const [activeTab, setActiveTab] = useState("operators");
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
   const [userData, setUserData] = useState<{ email?: string; role?: string } | null>(null);

  useEffect(() => {
    if (!loading) { // Если состояние загружено
      if (!user) {   // Если пользователь не авторизован
        router.push("/sign-in"); // Редирект на страницу авторизации
      }
      setIsChecking(false); // Завершаем проверку
    }
  }, [user, loading, router]);

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

  // if(userData?.role !== "admin") {
  //   router.push("/");  // Редирект на главную страницу
  // } 


  return (
    <SidebarProvider>
      <AppSidebar setActiveTab={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <AdminPanel activeTab={activeTab} />
      </SidebarInset>
    </SidebarProvider>
  )
}
