"use client";

import { useState, useRef } from "react";
import { EyeIcon, EyeOffIcon, PlusSquare } from "lucide-react";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "../ui/input";

interface User {
  id: string;
  email: string;
  role: string;
}

const AddUserForm = ({ onUserAdded }: { onUserAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

  const handleAddUser = async () => {
    if (!emailRef.current || !passwordRef.current || !roleRef.current) return;

    const newUser = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      role: roleRef.current.value,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        setOpen(false);
        emailRef.current.value = "";
        passwordRef.current.value = "";
        onUserAdded(); // Вызываем обновление списка пользователей
      } else {
        console.error("Ошибка при добавлении пользователя");
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <PlusSquare />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить пользователя</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Email" required ref={emailRef} />
            <div className="relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                ref={passwordRef}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            <select ref={roleRef} className="border rounded w-full py-2 px-3 text-gray-700">
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
            <Button onClick={handleAddUser} disabled={loading} className="w-full">
              {loading ? "Добавление..." : "Добавить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddUserForm;
