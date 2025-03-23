"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

interface MapComponentProps {
  points: {
    lon: number;
    lat: number;
    name: string;
    pointIcon: string;
    photoUrl: string;
  }[];
}

export const YandexMapApi = ({ points }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const isScriptLoaded = useRef(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const clustererRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (window.ymaps) {
      initMap();
      return;
    }

    if (!isScriptLoaded.current) {
      isScriptLoaded.current = true;
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=9798440d-3ed2-4f61-b3c7-fe08a4b58038&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (mapInstance) {
      addPoints(mapInstance);
    }
  }, [points]); // Добавляем точки при изменении `points`

  const initMap = () => {
    if (!mapRef.current || !window.ymaps) return;

    const newMap = new window.ymaps.Map(mapRef.current, {
      center: [42.349170, 69.606002],
      zoom: 13,
      controls: ["zoomControl", "fullscreenControl"],
    });

    clustererRef.current = new window.ymaps.Clusterer({
      preset: "islands#invertedVioletClusterIcons",
      groupByCoordinates: true,
      clusterDisableClickZoom: false,
      clusterOpenBalloonOnClick: true,
      gridSize: 64, // Чем больше значение, тем меньше кластеров
    });

    newMap.geoObjects.add(clustererRef.current);
    setMapInstance(newMap);
    addPoints(newMap);
  };

  const addPoints = (map: any) => {
    if (!map) return;
    map.geoObjects.removeAll(); // Очищаем метки перед добавлением новых

    // points.forEach((point) => {

    //   if (!point || point.lat === undefined || point.lon === undefined) return;

    //   const placemark = new window.ymaps.Placemark(
    //     [point.lon, point.lat],
    //     {
    //       hintContent: point.name,
    //       balloonContent: `
    //                 <div style="
    //                     width: 200px; 
    //                     height: 230px;
    //                     text-align: center;
    //                     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    //                     background-color: #ffffff;
    //                     display: flex;
    //                     flex-direction: column;
    //                     align-items: center;">
    //                     <h4 style="margin: 0 0 10px; font-size: 14px; color: #555;">
    //                         Lon: ${point.lon} Lat: ${point.lat}
    //                     </h4>
    //                     <img src="${point.photoUrl || ''}" alt="Фото" 
    //                         style="width: 90%; height: 70%; border-radius: 6px; margin-bottom: 10px;"/>
    //                     <p style="margin: 0; font-size: 14px; color: #555;">
    //                         ${point.name || 'Дополнительная информация не найдена.'}
    //                     </p>
    //                 </div>
    //             `,
    //     },
    //     {
    //       iconLayout: "default#image",
    //       iconImageHref: point.pointIcon || "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    //       iconImageSize: [30, 30], // Размер иконки
    //       iconImageOffset: [-24, -48], // Смещение, чтобы центрировать иконку
    //       hideIconOnBalloonOpen: false,
    //     }
    //   );
    //   map.geoObjects.add(placemark);
    // })

    // if (points.length > 0 && 
    //     points.every((p) => p && typeof p.lat === "number" && typeof p.lon === "number")
    //   ) {
    //   map.setBounds(
    //     points.map((p) => [p.lat, p.lon]),
    //     { checkZoomRange: true, duration: 300 }
    //   );
    // }

    setTimeout(() => {
      map.container.fitToViewport();
    }, 500);
  };

  return (
    <div className="w-full">
      <div ref={mapRef} className="w-full min-h-[88vh] bg-gray-200 border border-gray-300 rounded-lg" />
    </div>
  )

};
