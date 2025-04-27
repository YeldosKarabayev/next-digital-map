"use client";

import { useState, useEffect } from "react";
import { YandexMapApi } from "@/components/map/yandexApi";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Operator {
  id: string;
  name: string;
  pointIcon: string;
  points: Point[];
}

interface Point {
  id: string;
  name: string;
  description: string;
  lat: number;
  lon: number;
  photoUrl: string;
  coordinates: number[];
}

interface Provider {
  id: string;
  name: string;
  color: string;
  cables: Cable[];
}

interface Cable {
  id: string;
  name: string;
  color: string;
  path: { lat: number; lon: number }[];
  street: string;
}

export const MapWithControls = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [points, setPoints] = useState<Point[]>([]);
  const [cables, setCables] = useState<Cable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [operatorsSnap, providersSnap] = await Promise.all([
        getDocs(collection(db, "operators")),
        getDocs(collection(db, "providers")),
      ]);

      const operatorsWithPoints = await Promise.all(
        operatorsSnap.docs.map(async (docSnap) => {
          const operator = { id: docSnap.id, ...docSnap.data() } as Operator;
          const pointsSnap = await getDocs(collection(db, `operators/${docSnap.id}/points`));
          const points = pointsSnap.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || "",
            lat: Number(doc.data().lat),
            lon: Number(doc.data().lon),
            description: doc.data().description || "",
            photoUrl: doc.data().photoUrl || "",
            coordinates: [Number(doc.data().lat), Number(doc.data().lon)],
          })) as Point[];
          return { ...operator, points };
        })
      );

      const providersWithCables = await Promise.all(
        providersSnap.docs.map(async (docSnap) => {
          const provider = { id: docSnap.id, ...docSnap.data() } as Provider;
          const cablesSnap = await getDocs(collection(db, `providers/${docSnap.id}/cables`));
          const cables = cablesSnap.docs.map(doc => {
            const coordinates = doc.data().coordinates || [];
            const path = Array.isArray(coordinates)
              ? coordinates.map((coord: { lat: number; lon: number }) => ({
                  lat: Number(coord.lat),
                  lon: Number(coord.lon),
                }))
              : [];

            return {
              id: doc.id,
              name: doc.data().name || "",
              color: doc.data().color || "",
              street: doc.data().street || "",
              path,
            };
          });
          return { ...provider, cables };
        })
      );

      setOperators(operatorsWithPoints);
      setProviders(providersWithCables);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedOperator === "all") {
      // Выбрали "Все" — показываем все точки всех операторов
      const allPoints = operators.flatMap(op => op.points);
      setPoints(allPoints);
    } else if (selectedOperator) {
      // Выбрали конкретного оператора
      const operator = operators.find(op => op.id === selectedOperator);
      setPoints(operator?.points || []);
    } else {
      // Ничего не выбрано
      setPoints([]);
    }
  }, [selectedOperator, operators]);

  useEffect(() => {
    if (selectedProvider === "all") {
      // Выбрали "Все" — показываем все кабели всех провайдеров
      const allCables = providers.flatMap(p => p.cables);
      setCables(allCables);
    } else if (selectedProvider) {
      // Выбрали конкретного провайдера
      const provider = providers.find(p => p.id === selectedProvider);
      setCables(provider?.cables || []);
    } else {
      // Ничего не выбрано
      setCables([]);
    }
  }, [selectedProvider, providers]);

  if (loading) {
    return <div className="text-white p-5">Загрузка карты...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 rounded-xl bg-slate-800 flex gap-4 items-center">
        {/* Фильтр операторов */}
        <div className="flex gap-2 items-center">
          <label htmlFor="operator-select" className="text-white">Фильтр операторов:</label>
          <select
            id="operator-select"
            className="border px-2 py-1 rounded"
            onChange={(e) => setSelectedOperator(e.target.value)}
            value={selectedOperator}
          >
            <option value="">Выберите оператора</option>
            <option value="all">Все операторы</option>
            {operators.map(op => (
              <option key={op.id} value={op.id}>{op.name}</option>
            ))}
          </select>
        </div>

        {/* Фильтр провайдеров */}
        <div className="flex gap-2 items-center">
          <label htmlFor="provider-select" className="text-white">Фильтр провайдеров:</label>
          <select
            id="provider-select"
            className="border px-2 py-1 rounded"
            onChange={(e) => setSelectedProvider(e.target.value)}
            value={selectedProvider}
          >
            <option value="">Выберите провайдера</option>
            <option value="all">Все провайдеры</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>{provider.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Карта */}
      <YandexMapApi
        points={points.map(point => ({
          ...point,
          pointIcon: operators.find(op => op.id === selectedOperator)?.pointIcon || "default-icon.png",
          photoUrl: point.photoUrl || "",
        }))}
        cables={cables.map(cable => ({
          ...cable,
          path: cable.path,
          color: cable.color || "default-color",
          companyName: providers.find(provider => provider.cables.some(c => c.id === cable.id))?.name || "Unknown Company",
          streetName: cable.street || "Unknown Street",
        }))}
      />
    </div>
  );
};
