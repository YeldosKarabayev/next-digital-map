"use client"

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Toast from "./ui/Toast";
import { RefreshCw, Trash2, UserRound, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation"; // Импорт роутера
import UserForm from "./add-user";
import dynamic from 'next/dynamic'
import { motion } from "framer-motion";
const AddUserForm = dynamic(() => import('@/components/shared/AddUserForm'), { ssr: false })

interface User {
  id: string;
  email: string;
  role: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Флаг загрузки
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter(); // Инициализация роутера
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);



  const fetchUsers = useCallback(async () => {
    setIsLoading(true); // Начинаем загрузку
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const res = await fetch("/api/admin/users", { signal });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      if ((error as any).name !== "AbortError") {
        console.error("Ошибка загрузки пользователей:", error);
      }
    } finally {
      setIsLoading(false); // Завершаем загрузку
    }

    return () => controller.abort();
  }, [setUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  // Меняем роль пользователя
  const handleRoleChange = async (userId: any, currentRole: string) => {
    setLoading(userId);
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await fetch("/api/admin/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.log("Ошибка при обнавлении роли пользователья!")
    } finally {
      setLoading(null);
    }

  };

  // Удаляем пользователя
  const handleDeleteUser = async (userId: string) => {
    await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    setUsers(users.filter(user => user.id !== userId));
    setIsLoading(false);
  };

  // Добавляем нового пользователя
  const handleAddUser = async () => {
    if (!emailRef.current?.value || !passwordRef.current?.value || !roleRef.current?.value) return;

    const newUser = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      role: roleRef.current.value,
    };

    await fetch("/api/admin/add-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    setUsers([...users, { id: Math.random().toString(), ...newUser }]);
    emailRef.current.value = "";
    passwordRef.current.value = "";
  };

  // if (isLoading) {
  //   return <Toast message={""} onClose={function (): void {
  //     throw new Error("Function not implemented.");
  //   }} />; // Вместо некорректного SSR-рендера
  // }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
        className="p-4"
      >
        <div className="p-1">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-8 mb-6">
              <h1 className="text-2xl font-semibold text-gray-700 mb-2">Все пользователи</h1>
              <button onClick={fetchUsers} className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900">
                <motion.div
                  animate={{ rotate: isLoading ? 360 : 0 }}
                  transition={{ repeat: isLoading ? Infinity : 0, duration: 0.6, ease: "linear" }}
                >
                  <RefreshCw size={20} />
                </motion.div>
              </button>
            </div>
            <AddUserForm onUserAdded={function (): void {
              throw new Error("Function not implemented.");
            }} />
          </div>
          <Card>
            <CardContent>
              {isLoading ? (
                <Toast message={""} onClose={function (): void {
                  throw new Error("Function not implemented.");
                }} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Действие</TableHead>
                      <TableHead>#</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleRoleChange(user.id, user.role)}
                            disabled={loading === user.id}
                          >
                            {loading === user.id ? "Изменение..." : "См. роль"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog
                            open={openDialog === user.id}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                onClick={() => setOpenDialog(user.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Удалить кабель?</DialogTitle>
                                <DialogDescription>
                                  Вы уверены что хотите удалить: <span className="text-lg text-blue-800 font-semibold">{user.email} </span>?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-4 justify-end mt-4">
                                <Button
                                  onClick={() => setOpenDialog(null)}
                                  disabled={loading === user.id}
                                >
                                  Отмена
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    handleDeleteUser(user.id);
                                    setOpenDialog(null);
                                  }}
                                >
                                  Удалить
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
};

export default Users;
