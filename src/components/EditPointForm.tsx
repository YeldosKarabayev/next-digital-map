import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Dialog, DialogTitle, DialogHeader, DialogContent } from "./ui/dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { EditIcon } from "lucide-react";
import Toast from "./ui/Toast";


interface EditPointFormProps {
    operatorId: string;
    pointId: string;
}

export default function EditPountForm({ pointId, operatorId }: EditPointFormProps) {

    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchPoint = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, `operators/${operatorId}/points`, pointId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setName(docSnap.data().name);
                    setDescription(docSnap.data().description || "");
                    setPhotoUrl(docSnap.data().photoUrl || "");
                } else {
                    console.error("Точка оператора не найдена!");
                }
            } catch (error) {
                console.error("Ошибка при загрузке точки оператора:", error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchPoint();
        }
    }, [pointId, operatorId, open]);

    const handleUpdatePoint = async () => {
        setLoading(true)
        try {
            await updateDoc(doc(db, `operators/${operatorId}/points`, pointId), {
                name,
                description,
                photoUrl
            });

            setOpen(false);

        } catch (error) {
            console.log("Ошибка! Не удалось обновить данные точки оператора!", error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <button onClick={() => setOpen(true)}>
                <EditIcon />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактирование точки: <span className="text-gray-600">{name}</span></DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            value={name}
                            placeholder="Название"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            value={description}
                            placeholder="Описание"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Input
                            value={photoUrl}
                            placeholder="URL фото"
                            onChange={(e) => setPhotoUrl(e.target.value)}
                        />
                        {loading ? 
                        <div className="mx-auto">
                            Загрузка...
                        </div>
                            : <>
                                {photoUrl &&
                                    <img src={photoUrl}
                                        alt="Фото точки"
                                        className="w-60 h-60 rounded-full mx-auto"
                                    />}
                            </>
                        }
                        <div className="flex items-center justify-end gap-3">
                            <Button variant="secondary" onClick={() => setOpen(false)}>
                                Отмена
                            </Button>
                            <Button onClick={handleUpdatePoint} disabled={loading}>
                                {loading ? "Обновление..." : "Обновить"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}



