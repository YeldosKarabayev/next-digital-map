'use client';

import { useState, useEffect, JSX } from 'react';
import { YMaps, Map, Polygon } from '@pbe/react-yandex-maps';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { ChevronLeft } from 'lucide-react';
import { SketchPicker } from 'react-color';

interface AddRegionProps {
  onBack: () => void;
}

interface Region {
  id: string;
  name: string;
  color: string;
  areas: {
    name: string;
    coordinates: { lat: number; lon: number }[];
  }[];
}

export default function AddRegion({ onBack }: AddRegionProps): JSX.Element {
  const [polygonPoints, setPolygonPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionName, setRegionName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [color, setColor] = useState('#7393B3');
  const [loading, setLoading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);


  useEffect(() => {

    const fetchRegions = async () => {
      const res = await fetch("/api/admin/regions/region");
      if (res.ok) {
        const data = await res.json();
        setRegions(data);
      }
    }

    fetchRegions();
  }, []);


  const handleRegionNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setRegionId(selectedId);

    const selectedRegion = regions.find((r) => r.id === selectedId);
    if (selectedRegion) {
      setColor(selectedRegion.color);
    }

  };


  const handleMapClick = (e: any) => {
    const coords = e.get('coords');
    setPolygonPoints((prev) => [...prev, { lat: coords[0], lng: coords[1] }]);
  };

  const undoLastPoint = () => {
    setPolygonPoints((prev) => prev.slice(0, -1));
  };

  const clearAllPoints = () => {
    setPolygonPoints([]);
  };

  const saveRegion = async () => {
    if (!areaName.trim()) {
      alert('Введите название области');
      return;
    }

    if (polygonPoints.length < 3) {
      alert('Регион должен состоять минимум из 3 точек');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/regions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regionId,
          areaName,
          color,
          areas: polygonPoints.map((p) => ({ lat: p.lat, lon: p.lng })),
        })

      });

      if (!res.ok) throw new Error('Ошибка при создании региона');

      alert('Регион успешно добавлен!');
      clearAllPoints();
      setRegionName('');
    } catch (error) {
      console.error(error);
      alert('Произошла ошибка при добавлении региона');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        undoLastPoint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="p-1"
    >
      <div className="p-1 flex flex-col gap-4">
        <div className="flex justify-start gap-6 mb-2 items-center">
          <Button onClick={onBack}>
            <ChevronLeft />
          </Button>
          <h2 className="text-xl font-semibold">Добавить пятно</h2>
        </div>

        <select
          className="p-2 border rounded"
          value={regionId ?? ''}
          onChange={handleRegionNameChange}
        >
          <option value="">Выберите оператора из списка</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Введите название пятна"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          className="p-2 border rounded"
        />

        {/* <div className="space-y-2">
          <label className="text-gray-600 font-medium">Цвет региона:</label>
          <motion.div
              initial={{ backgroundColor: "#000000" }}
              animate={{ backgroundColor: color }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full border shadow-md"
            />
        </div> */}
        <div className="relative">
          <Button
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            variant="secondary"
          >
            Выбрать цвет пятна
          </Button>

          {isPickerOpen && (
            <div className="absolute z-50 mt-2 shadow-lg">
              <SketchPicker color={color} onChangeComplete={(c) => setColor(c.hex)} />
            </div>
          )}
        </div>

        <div className="space-y-2 flex items-center gap-3">
          <label className="text-gray-600 font-medium">Цвет пятна:</label>

          <motion.div
            initial={{ backgroundColor: "#000000" }}
            animate={{ backgroundColor: color }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-full border shadow-md"
          />

          {/* <input
                                type="color"
                                value={color}
                                onChange={handleColorChange}
                                disabled={!manualColor}
                                className={`w-full p-2 mt-2 ${manualColor ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                            /> */}
        </div>

        <div className="h-[400px]">
          <YMaps>
            <Map
              defaultState={{ center: [42.349170, 69.606002], zoom: 12 }}
              width="100%"
              height="100%"
              onClick={handleMapClick}
            >
              {polygonPoints.length >= 3 && (
                <Polygon
                  geometry={[polygonPoints.map((p) => [p.lat, p.lng])]}
                  options={{
                    fillColor: color + '55',
                    strokeColor: color,
                    strokeWidth: 3,
                    opacity: 0.6,
                  }}
                />
              )}
            </Map>
          </YMaps>
        </div>

        {polygonPoints.length > 0 && (
          <div className="bg-gray-100 p-2 rounded max-h-40 overflow-auto text-sm border">
            <strong>Точки полигона:</strong>
            <ul className="list-disc ml-4 mt-1">
              {polygonPoints.map((p, i) => (
                <li key={i}>
                  [{p.lat.toFixed(5)}, {p.lng.toFixed(5)}]
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button onClick={saveRegion} disabled={loading}>
            Сохранить
          </Button>
          <Button variant="secondary" onClick={clearAllPoints}>
            Очистить
          </Button>
        </div>
      </div>
    </motion.div>
  );
}