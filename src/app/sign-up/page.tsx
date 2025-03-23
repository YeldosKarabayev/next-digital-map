"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation"; // Импорт роутера

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter(); // Инициализация роутера

  // Регистрация
  const handleSignUp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Предотвращает обновление страницы

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem("user", "true"); // Сохранение пользователя в сессию
      setEmail("");
      setPassword("");

      // ✅ Перенаправление на страницу "/sign-in" после успешной регистрации
      router.push("/sign-in");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="items-center h-screen justify-center flex">
      <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[22%]" onSubmit={handleSignUp}>
        <p className="text-xl text-center w-full mb-4">Регистрация</p>
        
        <input
          className="shadow appearance-none border mb-4 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className="relative w-70">
          <input
            className="shadow appearance-none border mb-4 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Зарегистрироватся
        </button>
      </form>
    </div>
  );
}
