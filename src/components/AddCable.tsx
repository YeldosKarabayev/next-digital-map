'use client';

import { useEffect, useState } from 'react';
import { YMaps, Map, Polyline } from '@pbe/react-yandex-maps';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from "@/lib/firebaseConfig";
import { SketchPicker } from 'react-color';
import { Button } from './ui/Button';

const operators = [
    { id: 'beeline', name: 'Beeline' },
    { id: 'tele2', name: 'Tele2' },
    { id: 'kcell', name: 'Kcell' },
];

export default function AddCable() {
    const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
    const [color, setColor] = useState('#ff0000');
    const [operatorId, setOperatorId] = useState('beeline');
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const handleMapClick = (e: any) => {
        const coords = e.get('coords');
        setPath([...path, { lat: coords[0], lng: coords[1] }]);
    };

    const saveCable = async () => {
        if (path.length < 2) return alert('Нужно минимум 2 точки');
        try {
            await addDoc(collection(db, 'cables'), {
                operatorId,
                color,
                path,
                createdAt: serverTimestamp(),
            });
            alert('Кабель успешно добавлен');
            setPath([]);
        } catch (e) {
            console.error(e);
            alert('Ошибка при добавлении');
        }
    };

    const undoLastPoint = () => {
        setPath((prev) => prev.slice(0, -1));
    };

    const clearAllPoints = () => {
        setPath([]);
    };

    // 🔁 Удаление последней точки по ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPath((prev) => prev.slice(0, -1)); // удалить последнюю точку
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="p-4 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Добавить линию кабеля</h2>

            <select
                className="p-2 border rounded"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
            >
                {operators.map((op) => (
                    <option key={op.id} value={op.id}>{op.name}</option>
                ))}
            </select>

            <div className="relative">
                <Button
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                >
                    Выбрать цвет кабеля
                </Button>

                {isPickerOpen && (
                    <div className="absolute z-50 mt-2 shadow-lg">
                        <SketchPicker color={color} onChangeComplete={(c) => setColor(c.hex)} />
                    </div>
                )}
            </div>

            <div className="h-[400px]">
                <YMaps>
                    <Map                         // 43.238949, 76.889709
                        defaultState={{ center: [42.349170, 69.606002], zoom: 12 }}
                        width="100%"
                        height="100%"
                        onClick={handleMapClick}
                    >
                        {path.length > 0 && (
                            <Polyline
                                geometry={path.map((p) => [p.lat, p.lng])}
                                options={{
                                    strokeColor: color,
                                    strokeWidth: 4,
                                }}
                            />
                        )}
                    </Map>
                </YMaps>
            </div>

            {path.length > 0 && (
                <div className="bg-gray-100 p-2 rounded max-h-40 overflow-auto text-sm border">
                    <strong>Точки маршрута:</strong>
                    <ul className="list-disc ml-4 mt-1">
                        {path.map((p, i) => (
                            <li key={i}>
                                [{p.lat.toFixed(5)}, {p.lng.toFixed(5)}]
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex gap-2 flex-wrap">
                <Button
                    onClick={saveCable}
                >
                    Сохранить
                </Button>
                <Button
                    variant="secondary"
                    onClick={clearAllPoints}
                >
                    Очистить все точки
                </Button>
            </div>
        </div>
    );
}
