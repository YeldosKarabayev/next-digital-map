import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { EditIcon } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { color } from "framer-motion";

interface EditOperatorFormProps {
  operatorId: string;
  name: string;
  pointIcon: string;
  onClose: () => void;
}

export default function EditOperatorForm({ operatorId, name, pointIcon, onClose }: EditOperatorFormProps) {
  const [editedName, setEditedName] = useState("");
  const [editedPointIcon, setEditedPointIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   const fetchOperator = async () => {
  //     try {
  //       const docRef = doc(db, "operators", operatorId);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         setName(docSnap.data().name);
  //         setIconUrl(docSnap.data().pointIcon || ""); // Если нет иконки, ставим пустую строку
  //       } else {
  //         console.error("Оператор не найден!");
  //       }
  //     } catch (error) {
  //       console.error("Ошибка загрузки оператора:", error);
  //     }
  //   };

  //   if (open) {
  //     fetchOperator();
  //   }
  // }, [operatorId, open]);

  // const handleUpdateOperator = async () => {
  //   setLoading(true);

  //   try {
  //     await updateDoc(doc(db, "operators", operatorId), {
  //       name,
  //       pointIcon, // Используем правильное название поля
  //     });

  //     setOpen(false); // Закрываем модалку
  //     alert("Оператор успешно обновлен!"); // Уведомление об успешном обновлении

  //   } catch (error) {
  //     console.error("Ошибка при обновлении оператора:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const updateOperator = async () => {

    setLoading(true);

    try {

      const res = await fetch("/api/admin/operators/operator/edit-operator", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: operatorId,
          name: editedName,
          pointIcon: editedPointIcon,
        }),
      });

      if (!res.ok) {
        console.error("Ошибка:", await res.json());
        return;
      }

      onClose();

      const data = await res.json();
      console.log("Обнавленный оператор:", data);
      alert("Оператор: " + editedName + " успешно обновлен!");



    } catch (error) {

      console.log("Ошибка при обновлении данных оператора!")

    } finally {
      setLoading(false);
      setOpen(false);
    }

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
              Редактирование оператора: <span className="text-gray-600">{name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={name} />
            <Input value={editedName} placeholder="Введите новое название" onChange={(e) => setEditedName(e.target.value)} />
            <Input value={pointIcon} />
            <Input value={editedPointIcon} placeholder="URL иконки" onChange={(e) => setEditedPointIcon(e.target.value)} />
            {/* Предпросмотр иконки */}
            {editedPointIcon &&
              <img
                src={editedPointIcon}
                alt="Иконка оператора"
                className="w-30 h-30 rounded-full mx-auto"
              />}
            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button onClick={updateOperator} disabled={loading}>
                {loading ? "Обновление..." : "Обновить"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
