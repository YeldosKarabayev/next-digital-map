"use client"

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { PlusSquare } from "lucide-react";

interface AddPointFormProps {
  operatorId: string;
  onPointAdded: () => void;
}

export default function AddPointForm({ operatorId, onPointAdded }: AddPointFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lon, setLon] = useState("");
  const [lat, setLat] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if(!name || !description || !lon || !lat || !photoUrl) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "operators", operatorId, "points"), {
        name,
        description,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        photoUrl,
      });
      onPointAdded();
      setOpen(false);
      setName("");
      setDescription("");
      setLon("");
      setLat("");
      setPhotoUrl("");
    } catch (error) {
      console.error("Ошибка добавления точки:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <PlusSquare />
      </button>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить точку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input placeholder="Долгота" value={lon} onChange={(e) => setLon(e.target.value)} />
            <Input placeholder="Широта" value={lat} onChange={(e) => setLat(e.target.value)} />
            <Input placeholder="URL фото" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Добавление..." : "Сохранить"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>

  );

}