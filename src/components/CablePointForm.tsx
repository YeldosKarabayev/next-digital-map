"use client"

import React, { useState, useEffect, useCallback, JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RefreshCw, Trash2 } from "lucide-react";
import Toast from "./ui/Toast";
import { MapComponent } from "./shared/MapComponent";
import AddPointForm from "./shared/AddPointForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import EditPountForm from "./EditPointForm";

import { useRouter } from "next/navigation";

interface ProviderCablesFormProps {
    id: string;
    street: string;
    providerId: string;
    name: string;
    color: string;
    onBack: () => void;
    cableId?: string;
}

export default function CablePointForm({ providerId, onBack, name, color }: ProviderCablesFormProps): JSX.Element {

    const [cables, setCables] = useState<ProviderCablesFormProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState<string | null>(null);

    const fetchCables = async () => {
    
        const controller = new AbortController();
        const signal = controller.signal;
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/providers/cables?providerId=${providerId}`);
            if (res.ok) {
                const data = await res.json();
                setCables(data.cables);
            } else {
                console.error("Ошибка при загрузке кабелей: ", res.statusText);
            }
        } catch (error) {
            console.error("Ошибка при загрузке кабелей: ", error);
        } finally {
            setLoading(false);
        }
    };

    console.log("name", name);

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, "cables", id));
            setCables(prev => prev.filter(c => c.id !== id));
            setOpenDialog(null);
            alert("Кабель успешно удален!");
        } catch (error) {
            console.log("Ошибка при удалении кабеля: ", error);
            alert("Ошибка при удалении кабеля!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCables();
    }, []);

    const handleOpenDialog = (id: string) => {
        setOpenDialog(id);
    };


    function deleteCable(setSelectedCableId: (arg0: null) => void) {
        throw new Error("Function not implemented.");
    }



    return (

        <div className="p-1">
            <div className="grid items-center mb-6">
                <div className="flex items-center gap-8 mb-6">
                    <Button onClick={onBack}>
                        <ChevronLeft /> Назад
                    </Button>
                    <button onClick={fetchCables} className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900">
                        <motion.div
                            animate={{ rotate: loading ? 360 : 0 }}
                            transition={{ repeat: loading ? Infinity : 0, duration: 0.6, ease: "linear" }}
                        >
                            <RefreshCw size={20} />
                        </motion.div>
                    </button>
                </div>
                <h1 className="text-2xl font-semibold text-gray-600 mb-2">
                    Кабели провайдера: <span className="text-orange-400">{name} </span>
                </h1>

            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>№</TableHead>
                        <TableHead className="text-center">Компания</TableHead>
                        <TableHead className="text-center">Улица</TableHead>
                        <TableHead className="text-center">Цвет</TableHead>
                        <TableHead className="text-center">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cables.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                <Toast message="Кабели не найдены" onClose={() => { }} />
                            </TableCell>
                        </TableRow>
                    ) : (
                        <React.Fragment>
                            {Array.isArray(cables) && cables.map((cable, index) => (
                                <TableRow key={cable.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="text-center">{name}</TableCell>
                                    <TableCell className="text-center">{cable.street}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: cable.color }}
                                            />
                                            {cable.color}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Dialog
                                            open={openDialog === cable.id}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => setOpenDialog(cable.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Удалить кабель?</DialogTitle>
                                                    <DialogDescription>
                                                        Вы уверены что хотите удалить: <span className="text-lg text-blue-800 font-semibold">{cable.street} </span>?
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
                                                            handleDelete(cable.id);
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
                        </React.Fragment>
                    )}
                </TableBody>
            </Table>
        </div>

    );
}