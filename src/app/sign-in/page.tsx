"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";
import { getIdTokenResult } from "firebase/auth";
import { useRouter } from "next/navigation"; // Импорт роутера
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";


const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter(); // Инициализация роутера
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Авторизация
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Остановка стандартного сабмита формы

    setIsLoggingIn(true); // Запуск анимации

    setTimeout(async () => {
      

      try {
        const res = await signInWithEmailAndPassword(email, password);
        if (!res || !res?.user) throw new Error("Ошибка входа");
    
        // Принудительно обновляем токен пользователя
        const tokenResult = await getIdTokenResult(res.user, true);
    
        console.log("Custom Claims:", tokenResult.claims); // ✅ Проверяем, что приходит
    
        if (tokenResult.claims.role === "admin") {
          router.push("/admin"); 
        } else {
          router.push("/");
        }
      } catch (e) {
        console.error("Ошибка авторизации:", e);
        setIsLoggingIn(false);
      }

    }, 1000);
  };

  return (
    <>
      {/* Анимация загрузки */}
      <AnimatePresence>
        {isLoggingIn && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="items-center h-screen justify-center flex">
        <form
          className="shadow-xl bg-slate-200 rounded-xl px-8 pt-6 pb-8 mb-4 w-[22%]"
          onSubmit={handleSignIn} // ✅ Обработчик события
        >
          <p className="text-xl font-semibold text-center w-full mb-4">Авторизация</p>

          <input
            className="shadow appearance-none border mb-4 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative w-70">
            <input
              className="shadow appearance-none border mb-4 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>

          {/* Ошибка при авторизации */}
          {error && <p className="text-red-500 text-sm text-center">{error.message} Проверьте логин и пароль!</p>}

          <button
            type="submit"
            className="bg-black hover:bg-gray-700 text-white w-full font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mt-2"
            disabled={loading}
          >
           Войти
          </button>
        </form>
      </div>
    </>
  );
};

export default SignIn;
