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
  const [selectedOperator, setSelectedOperator] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [points, setPoints] = useState<Point[]>([]);
  const [cables, setCables] = useState<Cable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [operatorsRes, providersRes] = await Promise.all([
          fetch("/api/admin/operators/operator"),
          fetch("/api/admin/providers"),
        ]);

        const [operatorsJson, providersJson] = await Promise.all([
          operatorsRes.json(),
          providersRes.json(),
        ]);

        const operators = operatorsJson.map((operator: any) => ({
          id: operator.id,
          name: operator.name,
          pointIcon: operator.pointIcon,
          points: operator.points.map((point: any) => ({
            id: point.id,
            name: point.name || "",
            lat: point.lat,
            lon: point.lon,
            description: point.description || "",
            photoUrl: point.photoUrl || "",
            coordinates: [point.lat, point.lon],
          })),
        }));

        const providers = providersJson.map((provider: any) => ({
          id: provider.id,
          name: provider.name,
          color: provider.color,
          cables: Array.isArray(provider.cables)
            ? provider.cables.map((cable: any) => ({
              id: cable.id,
              street: cable.street,
              color: cable.color,
              path: Array.isArray(cable.coordinates)
                ? cable.coordinates.map((coord: any) => ({
                  lat: coord.lat,
                  lon: coord.lon,
                }))
                : [],
            }))
            : [],
        }));

        setOperators(operators);
        setProviders(providers);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        alert("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedOperator === "all") {
      const allPoints = operators.flatMap(op => op.points);
      setPoints(allPoints);
    } else if (selectedOperator) {
      const operator = operators.find(op => op.id === selectedOperator);
      setPoints(operator?.points || []);
    } else {
      setPoints([]);
    }
  }, [selectedOperator, operators]);

  useEffect(() => {
    if (selectedProvider === "all") {
      const allCables = providers.flatMap(p => p.cables);
      setCables(allCables);
    } else if (selectedProvider) {
      const provider = providers.find(p => p.id === selectedProvider);
      setCables(provider?.cables || []);
    } else {
      setCables([]);
    }
  }, [selectedProvider, providers]);

  if (loading) {
    return <div className="text-white p-5">Загрузка карты...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 rounded-xl bg-slate-800 flex gap-4 items-center flex-wrap">
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
        points={points.map(point => {
          const operator = operators.find(op => op.points.some(p => p.id === point.id));
          return {
            ...point,
            pointIcon: operator?.pointIcon || "default-icon.png",
            photoUrl: point.photoUrl || "",
          };
        })}
        cables={cables.map(cable => {
          const provider = providers.find(prov => prov.cables.some(c => c.id === cable.id));
          return {
            ...cable,
            path: cable.path,
            color: cable.color || "default-color",
            companyName: provider?.name || "Unknown Company",
            streetName: cable.street || "Unknown Street",
          };
        })}
      />
    </div>
  );
};
