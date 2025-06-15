"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebaseConfig"; // Подключаем Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { create } from "domain";

interface AddOperatorDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddOperatorDialog = ({ open, onClose }: AddOperatorDialogProps) => {
  const [name, setName] = useState("");
  const [pointIcon, setPointIcon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddOperator = async () => {
    if (!name.trim()) return alert("Введите название оператора!");

    setLoading(true);

    try {
      const res = await fetch("/api/admin/operators/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, pointIcon }),
      });

      if(!res.ok){
        const data = await res.json();
        throw new Error(data.error || "Failed to create operator");
      }

      const data = await res.json();

      alert("Оператор успешно добавлен!"); // Уведомление об успешном добавлении
      
    } catch (error) {
      console.error("Ошибка добавления оператора:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить оператора</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Название оператора"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            type="text"
            placeholder="Ссылка на логотип"
            onChange={(e) => setPointIcon(e.target.value)}
           />

          <Button onClick={handleAddOperator} disabled={loading}>
            {loading ? "Добавление..." : "Добавить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
