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
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import EditPountForm from "./EditPointForm";

import { useRouter } from "next/navigation";

interface CablePointFormProps {
    points: { lat: number; lng: number }[];
    color: string;
    operatorId: string;
    cableId: string;
    onDeletePoint: (index: number) => void;
    onUpdatePoint: (index: number, point: { lat: number; lng: number }) => void;
}

export default function CablePointForm({ }) {

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState<string | null>(null);

    return (

        <div className="p-1">
            <div className=" flex justify-between items-center mb-6">
                <div className="flex items-center gap-8 mb-6">
                    <h1 className="text-2xl font-semibold text-gray-600 mb-2">Кабели </h1>
                    <button className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900">
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                        >
                            <RefreshCw size={16} className="text-gray-900" />
                        </motion.div>
                    </button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">ID</TableHead>
                        <TableHead className="text-center">Компания</TableHead>
                        <TableHead className="text-center">Улица</TableHead>
                        <TableHead className="text-center">Цвет</TableHead>
                        <TableHead className="text-center">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                <Toast message="Пожалуйста, подождите" onClose={() => { }} />
                            </TableCell>
                        </TableRow>
                    ) : (
                        <React.Fragment>
                            <TableRow>
                                <TableCell className="text-center">1</TableCell>
                                <TableCell className="text-center">I-Link net</TableCell>
                                <TableCell className="text-center">Байтұрсынова</TableCell>
                                <TableCell className="text-center">Синий</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="destructive" onClick={() => setOpenDialog("delete")}>
                                        <Trash2 size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    )}
                </TableBody>
            </Table>
        </div>

    );
}