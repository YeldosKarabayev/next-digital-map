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

export const AddRegionArea = ({ open, onClose }: AddProviderDialogProps) => {

    const [name, setName] = useState("");
    const [color, setColor] = useState("#000000");
    const [loading, setLoading] = useState(false);

    const handleAddRegion = async () => {
        if (!name.trim()) return alert("Введите название оператора!");
        setLoading(true);

        try {
            // await addDoc(collection(db, "providers"), { 
            //     name,
            //     color,
            //     createdAt: new Date().toISOString(), 
            // });

            const res = await fetch("/api/admin/regions/region/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, color }),
            });
            
            if(!res.ok){
                const data = await res.json();
                throw new Error(data.error);
            }

            const data = await res.json();

            setName("");
            setColor("#000000");
            onClose();

            alert("Оператор успешно добавлен!");

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
                    <p className="text-sm text-gray-800">Выберите цвет оператора:</p>
                    <Input 
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>

                <div className="flex justify-end mt-4">
                    <Button onClick={handleAddRegion} disabled={loading}>
                        {loading ? "Загрузка..." : "Добавить"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );


}
