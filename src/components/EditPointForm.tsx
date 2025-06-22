import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogHeader, DialogContent } from "./ui/dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { EditIcon } from "lucide-react";
import Toast from "./ui/Toast";

interface EditPointFormProps {
    operatorId: string;
    pointId: string;
}

interface Point {
    name: string;
    description?: string;
    photoUrl?: string;
}

export default function EditPointForm({ pointId, operatorId }: EditPointFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [point, setPoint] = useState<Point | null>(null);
    
    // Используем одно состояние для формы
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        photoUrl: ""
    });

    useEffect(() => {
        const fetchPoint = async () => {
            if (!pointId) {
                console.error('ID точки не указан');
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(
                    `/api/admin/operators/points/point/${pointId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(
                        errorData.error || `Ошибка ${res.status}: ${res.statusText}`
                    );
                }

                const data = await res.json();
                setPoint(data);
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    photoUrl: data.photoUrl || ''
                });
                
            } catch (error) {
                console.error('Ошибка загрузки:', error);
                // Toast.error(error.message || 'Не удалось загрузить данные точки');
            } finally {
                setLoading(false);
            }
        };

        if (pointId && open) {
            fetchPoint();
        }
    }, [pointId, open]);

    const handleUpdatePoint = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/operators/points/edit-point", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: pointId,
                    operatorId: operatorId,
                    ...formData
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Ошибка при обновлении");
            }

            const data = await res.json();
            // Toast.success("Точка успешно обновлена!");
            setOpen(false);
            
        } catch (error) {
            console.error("Ошибка при обновлении:", error);
            // Toast.error(error.message || "Не удалось обновить точку");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <button onClick={() => setOpen(true)}>
                <EditIcon />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Редактирование точки: <span className="text-gray-600">{point?.name}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            name="name"
                            value={formData.name}
                            placeholder="Название"
                            onChange={handleChange}
                        />
                        <Input
                            name="description"
                            value={formData.description}
                            placeholder="Описание"
                            onChange={handleChange}
                        />
                        <Input
                            name="photoUrl"
                            value={formData.photoUrl}
                            placeholder="URL фото"
                            onChange={handleChange}
                        />
                        
                        {loading ? (
                            <div className="mx-auto">Загрузка...</div>
                        ) : (
                            formData.photoUrl && (
                                <img 
                                    src={formData.photoUrl}
                                    alt="Фото точки"
                                    className="w-60 h-60 rounded-full mx-auto"
                                />
                            )
                        )}
                        
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
    );
}