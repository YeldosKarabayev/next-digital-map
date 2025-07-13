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


interface Spot {
  id: string;
  name: string;
  color: string;
  coordinates: { lat: number; lng: number }[];
}


export default function Spots() {

  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectRegion, setSelectRegion] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);



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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-8 mb-6">
                <h1 className="text-2xl font-semibold text-gray-600 mb-2">Регионы</h1>
                <button onClick={fetchSpots} className="flex items-center gap-2 rounded-md p-1 border-2 border-gray-900">
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
            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">№</TableHead>
                    <TableHead className="text-center">Название</TableHead>
                    <TableHead className="text-center">Цвет</TableHead>
                    <TableHead className="text-center">Координаты</TableHead>
                    <TableHead className="text-center">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spots.map((spot, index) => (
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
                      <TableCell className="text-center">{spot.coordinates.map(coord => `(${coord.lat}, ${coord.lng})`).join(', ')}</TableCell>
                      <TableCell className="text-center">
                        {/* Действия с точкой */}
                        <Button variant="ghost" size="icon" onClick={() => setSelectRegion(spot.id)}>
                          <ChevronRight />
                        </Button>
                        {/* Здесь можно добавить другие действия, например, редактирование или удаление */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </div>


    </motion.div>
  )
}


