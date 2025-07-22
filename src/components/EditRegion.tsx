import { useEffect, useState } from "react";
import { EditIcon } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";

interface EditRegionFormProps {
    spotId: string;
}

export default function EditRegionForm({ spotId }: EditRegionFormProps) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#000000");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
  console.log("spotId внутри EditRegionForm:", spotId);
}, [spotId]);
    
    const updateRegion = async () => {
        const res = await fetch("/api/admin/regions/edit", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: spotId,
                name: name,
                color: color,
            }),
        });

        if(!res.ok) {
            console.error("Ошибка:", await res.json());
            return;
        }

        const data = await res.json();
        console.log("Обнавленный оператор:", data);
        alert("Оператор успешно обнавлен!");
    }
    console.log("Оператор", spotId);

    return (
        <>
            <button onClick={() => setOpenDialog(true)}>
                <EditIcon />
            </button>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактировать пятна оператора</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <Input
                            type="text"
                            placeholder="Название провайдера"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p className="text-sm text-gray-800">Выберите цвет пятна:</p>
                        <Input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={updateRegion}
                        disabled={loading}
                    >
                        {loading ? "Сохранение..." : "Сохранить"}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}