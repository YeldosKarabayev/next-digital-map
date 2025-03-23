"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      const token = await getIdTokenResult(user);
      setUserRole(typeof token.claims.role === 'string' ? token.claims.role : "user");

      if (token.claims.role !== role) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [role, router]);

  if (!userRole) return <p>Загрузка...</p>;

  return <>{children}</>;
};

export default ProtectedRoute;
