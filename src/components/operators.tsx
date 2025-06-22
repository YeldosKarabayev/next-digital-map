"use client";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, Link, PlusSquare, RefreshCw, Trash2, UserRoundPlus } from "lucide-react";
import Toast from "./ui/Toast";
import React from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import OperatorPointsForm from "./OperatorPointsForm";
import { AddOperatorDialog } from "./shared/AddOperatorForm";
import EditOperatorForm from "./EditOperatorForm";

const OperatorsTable = () => {
    interface Operator {
        id: string;
        name: string;
        pointIcon: string;
        points?: {
            name: string;
            lat: string;
            lon: string;
            id: string;
            description: string;
            photoUrl: string;
            coordinates: number[]
        }[];
    }

    const [operators, setOperators] = useState<Operator[]>([]);
    const [expandedOperator, setExpandedOperator] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState<string | null>(null);
    const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const fetchOperators = useCallback(async () => {

        setLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const res = await fetch("/api/admin/operators/operator", { signal });
            if (res.ok) {
                const data = await res.json();
                setOperators(data);
            }
        } catch (error) {
            if ((error as any).name !== "AbortError") {
                console.error("Ошибка загрузки операторов:", error);
            }
        } finally {
            setLoading(false);
        }

        return () => controller.abort();
    }, []);

    useEffect(() => {
        fetchOperators();
    }, [fetchOperators]);

    const toggleExpand = async (operatorId: string | null) => {
        if (expandedOperator === operatorId) {
            setExpandedOperator(null);
            return;
        }

        try {
            const res = await fetch(`/api/admin/operators/points?operatorId=${operatorId}`);
            if (res.ok) {
                const data = await res.json();
                setOperators(operators.map(op => op.id === operatorId ? { ...op, points: data.points } : op));
                setExpandedOperator(operatorId);
            }
        } catch (error) {
            console.error("Ошибка загрузки точек оператора:", error);
        }
    };

    const handleDeleteOperator = async (operatorId: string) => {
        try {
            const res = await fetch(`/api/admin/operators/delete/${operatorId}`, {
                method: "DELETE",
            });

            if(!res.ok) {
                throw new Error("Ошибка при удалении оператора");
            }

            console.log("Оператор успешно удален!");
            setOperators(operators.filter(op => op.id !== operatorId));
        } catch (error) {
            console.error("Ошибка удаления оператора:", error);
        } finally {
            setLoading(false);
            setOpenDialog(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="p-4"
        >
            <div className="p-1">
                {selectedOperator ? (
                    <OperatorPointsForm
                        pointId=""
                        operatorId={selectedOperator}
                        operatorName={operators.find(op => op.id === selectedOperator)?.name || ""}
                        operatorIcon={operators.find(op => op.id === selectedOperator)?.pointIcon || ""}
                        onBack={() => setSelectedOperator(null)} photoUrl={""} />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-8 mb-6">
                                <h1 className="text-2xl font-semibold text-gray-600 mb-2">Операторы </h1>
                                <button onClick={fetchOperators} className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900">
                                    <motion.div
                                        animate={{ rotate: loading ? 360 : 0 }}
                                        transition={{ repeat: loading ? Infinity : 0, duration: 0.6, ease: "linear" }}
                                    >
                                        <RefreshCw size={20} />
                                    </motion.div>
                                </button>
                            </div>
                            <button onClick={() => setIsDialogOpen(true)}>
                                <PlusSquare className="size-6" />
                            </button>
                            <AddOperatorDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>№</TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Иконка</TableHead>
                                    <TableHead>Количество точек</TableHead>
                                    <TableHead>Редактировать</TableHead>
                                    <TableHead>Действие</TableHead>
                                    {/* <TableHead>#</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            {/* Загрузка... */}
                                            <Toast message="Загрузка данных..." onClose={() => { }} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    operators.map((operator, index) => (
                                        <React.Fragment key={operator.id}>
                                            <TableRow>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell
                                                    onClick={() => setSelectedOperator(operator.id)}
                                                    className="cursor-pointer text-gray-800 font-semibold"
                                                >
                                                    {operator.name}
                                                </TableCell>
                                                <TableCell>
                                                    <img src={operator.pointIcon} alt={operator.name} className="w-8 h-8" />
                                                </TableCell>
                                                <TableCell>
                                                    {/* <Button  */}
                                                    {/* onClick={() => toggleExpand(operator.id)} */}
                                                    {/* > */}
                                                    {/* {expandedOperator === operator.id ? <ChevronUp /> : <ChevronDown />} */}
                                                    <span className="text-sm">{operator.points?.length || 0}</span>
                                                    {/* </Button> */}
                                                </TableCell>
                                                {/* <TableCell>
                                                <Button
                                                    onClick={() => setSelectedOperator(operator.id)}
                                                >
                                                    Просмотр точек
                                                </Button>
                                            </TableCell> */}
                                                <TableCell>
                                                    <EditOperatorForm 
                                                        operatorId={operator.id}
                                                        name={operator.name}
                                                        pointIcon={operator.pointIcon} onClose={function (): void {
                                                            throw new Error("Function not implemented.");
                                                        } }                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Dialog
                                                        open={openDialog === operator.id}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => setOpenDialog(operator.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Удалить оператора?</DialogTitle>
                                                                <DialogDescription>
                                                                    Вы уверены что хотите удалить: <span className="text-lg text-blue-800 font-semibold">{operator.name} </span>?
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
                                                                        handleDeleteOperator(operator.id);
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
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default OperatorsTable;