import { useState, useEffect, use } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { EditIcon } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import exp from "constants";

interface EditProviderFormProps {
    providerId: string;
}

export default function EditProviderForm({ providerId }: EditProviderFormProps) {

    const [name, setName] = useState("");
    const [color, setColor] = useState("#000000"); // Цвет провайдера
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false); // Статус открытия диалога

    // useEffect(() => {

    //     const fetchProvider = async () => {
    //         try {
    //             const docRef = doc(db, "providers", providerId);
    //             const docSnap = await getDoc(docRef);

    //             if (docSnap.exists()) {
    //                 setName(docSnap.data().name);
    //                 setColor(docSnap.data().color || "#000000"); // Если нет цвета, ставим черный по умолчанию
    //             } else {
    //                 console.error("Провайдер не найден!");
    //             }
    //         } catch (error) {
    //             console.error("Ошибка загрузки провайдера:", error);
    //         }
    //     };

    //     if (openDialog) {
    //         fetchProvider();
    //     }

    // }, [providerId, openDialog]);


    // const handleUpdateProvider = async () => {
    //     setLoading(true);

    //     try {
    //         await updateDoc(doc(db, "providers", providerId), {
    //             name,
    //             color, // Используем правильное название поля
    //         });

    //         setOpenDialog(false); // Закрываем модалку
    //         alert("Провайдер успешно обновлен!"); // Уведомление об успешном обновлении

    //     } catch (error) {
    //         console.error("Ошибка при обновлении провайдера:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const updateProvider = async () => {
        const res = await fetch("/api/admin/providers/edit-provider", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: providerId,
                name: name,
                color: color,
            }),
        });

        if(!res.ok) {
            console.error("Ошибка:", await res.json());
            return;
        }

        const data = await res.json();
        console.log("Обнавленнный провайдер:", data);
        alert("Провайдер успешно обнавлен!")
    }


    return (
        <>

            <button onClick={() => setOpenDialog(true)}>
                <EditIcon />
            </button>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактировать провайдера</DialogTitle>
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

                    <Button
                        onClick={updateProvider}
                        disabled={loading}
                    >
                        {loading ? "Сохранение..." : "Сохранить"}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );

}

