"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlusSquare, RefreshCw, Trash2 } from "lucide-react";
import Toast from "./ui/Toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import AddCable from "./AddCable";
import AddRegion from "./AddRegion";

interface SpotsPointFormProps { }

interface Point {
    id: string;
    regionId: string;
    color: string;
    name: string;
    onClose: () => void;
    onUpdate: () => Promise<void>;
    onBack: () => void;
    coordinates: { lat: number; lng: number }[];
}


export default function SpotsPointForm({ regionId, onClose, name, onBack }: Point) {
    const [points, setPoints] = useState<Point[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(false);

    const fetchPoints = async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/regions/areas?regionId=${regionId}`, { signal });
            if (!response.ok) console.log("Failed to fetch points");
            const data = await response.json();
            setPoints(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const handleDeletePoint = async (pointId: string) => {
        setLoading(true);
        console.log("Deleting point with ID:", pointId);
        try {
            const response = await fetch(`/api/admin/regions/areas/delete/${pointId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete point");
            await fetchPoints();

            alert("Область успешно удалена!");

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        fetchPoints(signal);

        return () => {
            controller.abort();
        };
    }, []);


    return (
        <>
            {activeTab ? (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4 }}
                    className="p-4"
                >
                    <AddRegion onBack={onBack} />
                </motion.div>
            ) : (

                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="p-4"
                >
                    <div className="p-1">
                        <div className="grid items-center mb-6">
                            <div className="flex items-center gap-8 mb-6">
                                <Button onClick={onBack}>
                                    <ChevronLeft />
                                    {/* Назад */}
                                </Button>
                                <button
                                    onClick={() => fetchPoints()}
                                    className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900"
                                >
                                    <motion.div
                                        animate={{ rotate: loading ? 360 : 0 }}
                                        transition={{ repeat: loading ? Infinity : 0, duration: 0.6, ease: "linear" }}
                                    >
                                        <RefreshCw size={20} />
                                    </motion.div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-semibold text-gray-600 mb-2">
                                    Точки пятен: <span className="text-orange-400">{name}</span>
                                </h1>

                                <button
                                    onClick={() => setActiveTab(true)}
                                >
                                    <PlusSquare className="size-6" />
                                </button>
                            </div>
                        </div>
                        {loading ? (
                            <Toast message="Загрузка..." onClose={() => { }} />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell className="text-center">№</TableCell>
                                        <TableCell className="text-center">Название</TableCell>
                                        <TableCell className="text-center">Действия</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {
                                        Array.isArray(points) && points.map((point, index) => (
                                            <TableRow key={point.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="text-center">{point.name}</TableCell>
                                                <TableCell className="text-center">
                                                    <Dialog
                                                        open={openDialog === point.id}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => setOpenDialog(point.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Удалить точку?</DialogTitle>
                                                                <DialogDescription>
                                                                    Вы уверены что хотите удалить: <span className="text-lg text-blue-800 font-semibold">{point.name} </span>?
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="flex gap-4 justify-end mt-4">
                                                                <Button
                                                                    onClick={() => setOpenDialog(null)}
                                                                    disabled={loading}
                                                                >
                                                                    Отмена
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => {
                                                                        handleDeletePoint(point.id);
                                                                        setOpenDialog(null);
                                                                    }}
                                                                >
                                                                    Удалить
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </motion.div>
            )}
        </>
    );
}