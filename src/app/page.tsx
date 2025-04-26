'use client'

import { useEffect, useState } from "react";
import { Container } from "@/components/shared/container";
import Header from "@/components/shared/header";
import { MapBlock } from "@/components/shared/map-block";
import { YandexMapApi } from "@/components/map/yandexApi";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapWithControls } from "@/components/shared/MapWithControls";


export default function Home() {

  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Ждём загрузку состояния, чтобы избежать мгновенного редиректа
  useEffect(() => {
    // if (!loading && !user) {
    //   router.push("/sign-in");
    // }
    if (!loading) {
      if (!user) {
        router.push("/sign-in"); // ⬅️ Редирект, если не авторизован
      }
      setIsChecking(false);
    }
  }, [user, loading, router]);

  // Пока загружается состояние аутентификации, показываем заглушку
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Container >
        <MapBlock>
          <MapWithControls />
          {/* <YandexMapApi points={[]} /> */}
          {/* <Dashboard /> */}
        </MapBlock>
      </Container>     
    </>
  );
}
