"use client";


import { useCallback, useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { PlusIcon, PlusSquare, RefreshCcw, RefreshCw, Trash2 } from "lucide-react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Toast from "./ui/Toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { AddOperatorDialog } from "./shared/AddOperatorForm";
import { AddProvider } from "./shared/AddProviderForm";
import CablePointForm from "./CablePointForm";
import EditProviderForm from "./EditProvider";
import { ProviderId } from "firebase/auth";


const ProviderTable = () => {
    interface Provider {
        id: string;
        name: string;
        color: string;
        cables?: []; // Замените any на фактический тип данных, если он известен
    }

    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState<string | null>(null);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const fetachProviders = useCallback(async () => {

        setLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const res = await fetch("/api/admin/providers", { signal });
            if (res.ok) {
                const data = await res.json();
                setProviders(data);
            }
        } catch (error) {
            if ((error as any).name !== "AbortError") {
                console.error("Ошибка при загрузке провайдеров: ", error);
            }
        } finally {
            setLoading(false);
        }

        return () => controller.abort();


    }, []);

    const hanldeDeleteProvider = async (id: string) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, "providers", id));
            alert("Провайдер удален!");
            setProviders((prev) => prev.filter((provider) => provider.id !== id));
            setOpenDialog(null);
        } catch (error) {
            alert("Ошибка при удалении провайдера!");
            console.error("Ошибка при удалении провайдера: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetachProviders();
    }, [fetachProviders]);

    console.log("Количество улиц:", providers.map((provider) => provider.cables?.length || 0));

    return (

        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="p-4"
        >
            <div className="p-1">
                {selectedProvider ? (
                    <CablePointForm
                        providerId={selectedProvider.id}
                        name={selectedProvider.name}
                        color={selectedProvider.color}
                        onBack={() => setSelectedProvider(null)} id={""} street={""} />
                ) : (

                    <>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-8 mb-6">
                                <h1 className="text-2xl font-semibold text-gray-600 mb-2">Провайдеры</h1>
                                <button onClick={fetachProviders} className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900">
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
                            {/* Add Provider Dialog */}
                            <AddProvider
                                open={isDialogOpen}
                                onClose={() => {
                                    setIsDialogOpen(false);
                                    // fetachProviders();
                                }}
                            />
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead >№</TableHead>
                                    <TableHead className="text-center">Название</TableHead>
                                    <TableHead className="text-center">Количество улиц</TableHead>
                                    <TableHead className="text-center">Цвет</TableHead>
                                    <TableHead className="text-center">Редактировать</TableHead>
                                    <TableHead className="text-center">Действие</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            <Toast message="Пожалуйста, подождите" onClose={() => { }} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    providers.map((provider, index) => (
                                        <React.Fragment key={provider.id}>
                                            <TableRow>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell
                                                    className="text-center cursor-pointer"
                                                    onClick={() => setSelectedProvider(provider)}
                                                >
                                                    {provider.name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {provider.cables?.length || 0}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded-full"
                                                            style={{ backgroundColor: provider.color }}
                                                        />
                                                        {provider.color}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <EditProviderForm providerId={provider.id} />
                                                </TableCell>


                                                <TableCell className="text-center">
                                                    <Dialog
                                                        open={openDialog === provider.id}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => setOpenDialog(provider.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Удалить провайдера?</DialogTitle>
                                                                <DialogDescription>
                                                                    Вы уверены что хотите удалить: <span className="text-lg text-blue-800 font-semibold">{provider.name} </span>?
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
                                                                        hanldeDeleteProvider(provider.id);
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

export default ProviderTable;