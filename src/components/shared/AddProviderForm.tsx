"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebaseConfig"; // Подключаем Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

interface AddProviderDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddProvider = ({ open, onClose }: AddProviderDialogProps) => {

    const [name, setName] = useState("");
    const [color, setColor] = useState("#000000");
    const [loading, setLoading] = useState(false);

    const handleAddProvider = async () => {
        if (!name.trim()) return alert("Введите название провайдера!");
        setLoading(true);

        try {
            await addDoc(collection(db, "providers"), { 
                name,
                color,
                createdAt: new Date().toISOString(), 
            });

            setName("");
            setColor("#000000");
            onClose();
        } catch (error) {
            console.error("Ошибка добавления провайдера:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить провайдера</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Название провайдера"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p className="text-sm text-gray-800">Выберите цвет провайдера:</p>
                    <Input 
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>

                <div className="flex justify-end mt-4">
                    <Button onClick={handleAddProvider} disabled={loading}>
                        {loading ? "Загрузка..." : "Добавить"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );


}
