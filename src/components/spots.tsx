'use client';

import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlusSquare, RefreshCcw, RefreshCw, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/router";
import Toast from "./ui/Toast";
import CablePointForm from "./CablePointForm";
import SpotsPointForm from "./SpotsPointsForm";
import { AddProvider } from "./shared/AddProviderForm";
import AddRegion from "./AddRegion";
import { AddRegionArea } from "./shared/AddRegionArea";


interface Spot {
  id: string;
  name: string;
  color: string;
  coordinates: { lat: number; lng: number }[];
  onBack: () => void;
}


export default function Spots() {

  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addRegion, setAddRegion] = useState(false);
  const [selectRegion, setSelectRegion] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<string | null>(null);



  const fetchSpots = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/regions/region');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных');
      }
      const data = await response.json();
      setSpots(data);
    } catch (error) {
      console.error('Ошибка при загрузке точек:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);



  function onBack(): void {
    setAddRegion(false);
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/regions/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Ошибка при удалении пятна');
      }

      const data = await res.json();

      alert(data.message || 'Пятно успешно удалено');

      setSpots((prev) => prev.filter((spot) => spot.id !== id));
      setOpenDialog(null);
      fetchSpots(); // Обновляем список пятен после удаления

    } catch (error) {
      console.error('Ошибка при удалении пятна:', error);
      alert('Произошла ошибка при удалении пятна');
    }
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
        {selectRegion ? (
          <SpotsPointForm
            regionId={selectRegion}
            onClose={() => setSelectRegion(null)}
            onBack={() => setSelectRegion(null)}
            onUpdate={fetchSpots} id={""} color={""} name={""} coordinates={[]} />

        ) : (
          <>
            {addRegion ? (
              <AddRegionArea 
                open={addRegion}
                onClose={() => setAddRegion(false)}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-8 mb-6">
                    <h1 className="text-2xl font-semibold text-gray-600 mb-2">Белые пятна</h1>
                    <button onClick={fetchSpots} className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900">
                      <motion.div
                        animate={{ rotate: loading ? 360 : 0 }}
                        transition={{ repeat: loading ? Infinity : 0, duration: 0.6, ease: "linear" }}
                      >
                        <RefreshCw size={20} />
                      </motion.div>
                    </button>
                  </div>

                  <button onClick={() => setAddRegion(true)}>
                    <PlusSquare className="size-6" />
                  </button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">№</TableHead>
                      <TableHead className="text-center">Название</TableHead>
                      <TableHead className="text-center">Цвет</TableHead>
                      <TableHead className="text-center">Действия</TableHead>
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
                      spots.map((spot, index) => (
                        <TableRow key={spot.id}>
                          <TableCell className="text-center">{index + 1}</TableCell>
                          <TableCell className="text-center">{spot.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: spot.color }}
                              />
                            </div>
                          </TableCell>
                          {/* <TableCell className="text-center">{spot.coordinates.map(coord => `(${coord.lat}, ${coord.lng})`).join(', ')}</TableCell> */}

                          <TableCell className="text-center">
                            <Dialog open={openDialog === spot.id}
                            // onOpenChange={() => setOpenDialog(null)}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => setOpenDialog(spot.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Удалить кабель?</DialogTitle>
                                  <DialogDescription>
                                    Вы уверены, что хотите удалить:
                                    <span className="text-lg text-blue-800 font-semibold">{spot.name}</span>?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex gap-4 justify-end mt-4">
                                  <Button
                                    variant="secondary"
                                    onClick={() => setOpenDialog(null)}
                                    disabled={loading}
                                  >
                                    Отмена
                                  </Button>
                                  <Button
                                    onClick={() => handleDelete(spot.id)}
                                    disabled={loading}

                                  >
                                    Удалить
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              onClick={() => setSelectRegion(spot.id)}
                            >
                              <ChevronRight size={16} />
                            </Button>
                          </TableCell>

                        </TableRow>
                      )
                      ))}
                  </TableBody>
                </Table>
              </>
            )}
          </>
        )}
      </div>

    </motion.div>
  )
}

