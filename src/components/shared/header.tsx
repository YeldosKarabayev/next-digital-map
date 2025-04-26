"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Map } from "lucide-react";
import { Container } from "./container";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { doc, getDoc } from "firebase/firestore";
import CustomAvatar from "../ui/customavatar";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<{ email?: string; role?: string } | null>(null);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      await signOut(auth);
      router.push("/sign-in");
    }, 1000);
  };

  return (
    <>
      {isLoggingOut && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      <Container>
        <div className="h-14 min-w-max bg-gray-800 rounded-2xl">
          <div className="flex justify-between items-center h-full px-4">
            <div className="items-center flex justify-between">
              <Map size={30} color="white" />
              <h1 className="text-lg font-bold ml-2 text-white">digital maps</h1>
            </div>
            <div className="flex items-center space-x-4">
              {userData ? (
                <div className="flex items-center mr-5 space-x-2">
                  <CustomAvatar username={userData?.email || ""} userRole={userData?.role || ""} />
                  <div className="flex flex-col items-start">
                    <span className="text-white">{userData?.email}</span>
                    <span className="text-gray-300 text-[12px] ">{userData?.role}</span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-100 mr-2">Загрузка...</span>
              )}
              {/* {userData?.role === "admin" && (
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                size="sm"
              > Панель администратора </Button>
              )}
              <Button onClick={handleLogout}>Выйти</Button> */}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Header;
