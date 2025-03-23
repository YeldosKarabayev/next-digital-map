"use client";

import { useState } from "react";
import { addOperatorPoint } from "@/app/server/api/operators";

export const PointForm = () => {
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addOperatorPoint("Beeline-AMC", {
      name,
      coordinates: [parseFloat(lat), parseFloat(lng)],
      photoUrl,
      description,
    });
    alert(`Точка ${name} добавлена!`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" required />
      <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Широта" required />
      <input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Долгота" required />
      <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Фото URL" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" required />
      <button type="submit">Добавить точку</button>
    </form>
  );
};
