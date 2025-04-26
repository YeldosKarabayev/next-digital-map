"use client";

import { useState, useEffect } from "react";
import { YandexMapApi } from "@/components/map/yandexApi";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Operator {
    id: string;
    name: string;
    pointIcon: string;
    points?: {
        name: string;
        lat: number;
        lon: number;
        id: string;
        description: string;
        photoUrl: string;
        coordinates: number[]
    }[];
}

interface Point {
    id: string;
    name: string;
    description: string;
    lon: number;
    lat: number;
    photoUrl: string;
    coordinates: number[];
}

export const MapWithControls = () => {
    const [points, setPoints] = useState<Point[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);
    const [selectedOperator, setSelectedOperator] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await getDocs(collection(db, "operators"));

            const operatorsWithPoints = await Promise.all(
                snapshot.docs.map(async (docSnap) => {
                    const operator = { id: docSnap.id, ...docSnap.data() } as Operator;

                    const pointsSnapshot = await getDocs(collection(db, `operators/${docSnap.id}/points`));
                    const points = pointsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().name || "",
                        lat: parseFloat(doc.data().lat),
                        lon: parseFloat(doc.data().lon),
                        description: doc.data().description || "",
                        photoUrl: doc.data().photoUrl || "",
                        coordinates: [parseFloat(doc.data().lat), parseFloat(doc.data().lon)]
                    })) as Point[];

                    return { ...operator, points };
                })
            );

            console.log("Операторы с точками:", operatorsWithPoints);
            setOperators(operatorsWithPoints);

            if (!selectedOperator) {
                const allPoints = operatorsWithPoints.flatMap(op => op.points || []);
                setPoints(allPoints);
            } else {
                const selected = operatorsWithPoints.find(op => op.id === selectedOperator);
                setPoints(selected?.points || []);
            }
        };

        fetchData();
    }, [selectedOperator]);

    console.log("Точки, передаваемые на карту:", points);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <label htmlFor="operator-select">Фильтр операторов:</label>
                <select
                    id="operator-select"
                    className="border px-2 py-1 rounded"
                    onChange={(e) => setSelectedOperator(e.target.value)}
                    value={selectedOperator}
                >
                    <option value="">Все</option>
                    {operators.map(op => (
                        <option key={op.id} value={op.id}>{op.name}</option>
                    ))}
                </select>
            </div>
            {/* <YandexMapApi points={points.map(point => ({ ...point, pointIcon: "default-icon.png", photoUrl: "" }))} /> */}
            <YandexMapApi
                points={points.map(point => ({
                    ...point,
                    pointIcon: operators.find(op => op.id === selectedOperator)?.pointIcon || "default-icon.png",
                    photoUrl: point.photoUrl || ""
                }))}
            />
        </div>
    );
};
