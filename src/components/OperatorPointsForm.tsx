"use client"

import { useState, useEffect, useCallback, JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RefreshCw, Trash2 } from "lucide-react";
import Toast from "./ui/Toast";
import { MapComponent } from "./shared/MapComponent";
import AddPointForm from "./shared/AddPointForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import EditPountForm from "./EditPointForm";

interface OperatorPointsFormProps {
    operatorId: string;
    operatorName: string;
    operatorIcon: string;
    onBack: () => void;
    photoUrl: string;
    pointId: string;
}

export default function OperatorPointsForm({ operatorId, onBack, operatorName, operatorIcon }: OperatorPointsFormProps): JSX.Element {
    interface Point {
        id: string;
        name: string;
        description: string;
        lon: number;
        lat: number;
    }

    const [points, setPoints] = useState<Point[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchPoints = useCallback(async () => {
        setLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const res = await fetch(`/api/admin/operators/points?operatorId=${operatorId}`, { signal });
            if (res.ok) {
                const data = await res.json();
                setPoints(data.points);
            }
        } catch (error) {
            if ((error as any).name !== "AbortError") {
                console.error("Ошибка загрузки точек:", error);
            }
        } finally {
            setLoading(false);
        }

        return () => controller.abort();
    }, [operatorId]);

    useEffect(() => {
        fetchPoints();
    }, [fetchPoints]);


    const handleDeletePoints = async (operatorId: string, pointId: string) => {
        console.log("Удаление точки:", { operatorId, pointId });

        setLoading(true);
        try {
            await deleteDoc(doc(db, `operators/${operatorId}/points`, pointId));
            setPoints(prevPoints => prevPoints.filter(point => point.id !== pointId));
            console.log("Точка удалена");
        } catch (error) {
            console.error("Ошибка запроса:", error);
        } finally {
            setLoading(false);
        }
    };

    // Пагинация для табличной части *********************************

    const totalPages = Math.ceil(points.length / itemsPerPage);
    const paginatedPoints = points.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Переключение страниц

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    }



    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="p-4"
        >
            <div className="p-1">
                <div className="flex items-center gap-8 mb-6">
                    <Button onClick={onBack}>
                        <ChevronLeft /> Назад
                    </Button>
                    <button onClick={fetchPoints} className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900">
                        <motion.div
                            animate={{ rotate: loading ? 360 : 0 }}
                            transition={{ repeat: loading ? Infinity : 0, duration: 0.6, ease: "linear" }}
                        >
                            <RefreshCw size={20} />
                        </motion.div>
                    </button>
                </div>

                {loading ? (
                    <Toast message="Загрузка..." onClose={() => { }} />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-600 mb-4">
                                Точки оператора: <span className="text-orange-400">{operatorName}</span>
                            </h2>
                            <AddPointForm operatorId={operatorId} onPointAdded={fetchPoints} />
                        </div>
                        <Table className="mt-4">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>№</TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Описание</TableHead>
                                    <TableHead>Координаты</TableHead>
                                    <TableHead>Редактировать</TableHead>
                                    <TableHead>Действие</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {points.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">Точки не найдены</TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedPoints.map((point, index) => (
                                        <motion.tr key={point.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell>{point.name}</TableCell>
                                            <TableCell>{point.description}</TableCell>
                                            <TableCell>Lon: {point.lon}, Lat: {point.lat}</TableCell>
                                            <TableCell>
                                                <EditPountForm operatorId={operatorId} pointId={point.id} />
                                            </TableCell>
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
                                                                    handleDeletePoints(operatorId, point.id);
                                                                    setOpenDialog(null);
                                                                }}
                                                            >
                                                                Удалить
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex justify-start items-center gap-2 mt-4">
                            <button onClick={handlePrevPage} disabled={currentPage === 1}><ChevronLeft /></button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={currentPage === page ? "text-gray-700" : "hover:bg-gray-300 text-gray-400"}>
                                    {page}
                                </button>
                            ))}
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}><ChevronRight /></button>
                        </div>
                    </>
                )}
                <div className="mb-6 mt-[2%] h-[15%] border rounded-lg overflow-hidden">
                    {/* <MapComponent points={points.map(point => ({ ...point, pointIcon: operatorIcon, photoUrl: "" }))} /> */}
                    {/* <MapComponent points={points.map(point => ({ ...point, pointIcon: operatorIcon }))} /> */}
                </div>
            </div>
        </motion.div>
    );
}
