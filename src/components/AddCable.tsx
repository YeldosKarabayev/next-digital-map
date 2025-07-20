'use client';

import { JSX, useEffect, useState } from 'react';
import { YMaps, Map, Polyline } from '@pbe/react-yandex-maps';
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from "@/lib/firebaseConfig";
import { SketchPicker } from 'react-color';
import { Button } from './ui/Button';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface Provider {
    id: string;
    name: string;
    color: string;
}

interface CableForm {
    onBack: () => void;
}

export default function AddCable({ onBack }: CableForm): JSX.Element {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
    const [color, setColor] = useState('#7393B3');
    const [operatorId, setOperatorId] = useState('');
    const [street, setStreet] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [manualColor, setManualColor] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        const fetchProviders = async () => {
            const res = await fetch("/api/admin/providers");
            if(res.ok){
                const data = await res.json();
                setProviders(data);
            }
        };

        fetchProviders();
    }, []);

    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setOperatorId(selectedId);

        const selectedProvider = providers.find((p) => p.id === selectedId);
        if (selectedProvider) {
            setColor(selectedProvider.color);
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const handleMapClick = (e: any) => {
        const coords = e.get('coords');
        setPath(prev => [...prev, { lat: coords[0], lng: coords[1] }]);
    };

    const saveCable = async () => {
        if (!operatorId) return alert('Выберите провайдера');
        if (!street.trim()) return alert('Введите название улицы');
        if (path.length < 2) return alert('Нужно минимум 2 точки');

        setLoading(true);

        try {
            // const providerRef = doc(db, 'providers', operatorId);
            // const cablesCollection = collection(providerRef, 'cables');

            // await addDoc(cablesCollection, {
            //     street,
            //     color,
            //     coordinates: path.map(p => ({
            //         lat: p.lat,
            //         lon: p.lng
            //     })),
            //     createdAt: serverTimestamp(),
            // });

            const res = await fetch('/api/admin/providers/cables/addCable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operatorId,
                    street,
                    color,
                    path,
                }),
            });

            if(!res.ok){
                throw new Error('Ошибка при добавлении');
            }


            alert('Кабель успешно добавлен');
            setPath([]);
            setStreet('');
        } catch (e) {
            console.error(e);
            alert(`Ошибка при добавлении: ${e}`,);
        } finally {
            setLoading(false);
        }
    };

    const undoLastPoint = () => {
        setPath(prev => prev.slice(0, -1));
    };

    const clearAllPoints = () => {
        setPath([]);
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
                <div className='flex justify-start gap-6 mb-2 items-center'>
                    <Button  onClick={onBack}>
                        <ChevronLeft /> 
                        {/* Назад */}
                    </Button>
                    <h2 className="text-xl font-semibold">Добавить линию кабеля</h2>
                </div>

                <select
                    className="p-2 border rounded"
                    value={operatorId}
                    onChange={handleProviderChange}
                >
                    <option value="">Выберите провайдера</option>
                    {providers.map((op) => (
                        <option key={op.id} value={op.id}>{op.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Название улицы"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="p-2 border rounded"
                />

                {/* <div className="relative">
                <Button
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    variant="secondary"
                >
                    Выбрать цвет кабеля
                </Button>

                {isPickerOpen && (
                    <div className="absolute z-50 mt-2 shadow-lg">
                        <SketchPicker color={color} onChangeComplete={(c) => setColor(c.hex)} />
                    </div>
                )}
            </div> */}

                <div className="space-y-2 flex items-center gap-3">
                    <label className="text-gray-600 font-medium">Цвет кабеля:</label>

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
                    <Button onClick={saveCable}>
                        Сохранить
                    </Button>
                    <Button variant="secondary" onClick={clearAllPoints}>
                        Очистить все точки
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
