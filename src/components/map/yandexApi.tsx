"use client";

import { useEffect, useRef, useState } from "react";

interface OperatorPoint {
  lon: number;
  lat: number;
  name: string;
  pointIcon: string;
  photoUrl: string;
}

interface ProviderCable {
  street: any;
  path: { lat: number; lon: number }[];
  color: string;
  companyName: string;
  streetName: string;
}

interface MapComponentProps {
  points: OperatorPoint[];
  cables: ProviderCable[];
  regions?: RegionPolygon[];
}

interface RegionPolygon {
  name: string;
  color: string;
  areas: {
    name: string;
    coordinates: { lat: number; lon: number }[];
  }[];
}




export const YandexMapApi = ({ points, cables, regions }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const isScriptLoaded = useRef(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

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
      renderMapObjects(mapInstance);
    }
  }, [points, cables, regions]);

  const initMap = () => {
    if (!mapRef.current || !window.ymaps) return;

    const newMap = new window.ymaps.Map(mapRef.current, {
      center: [42.349170, 69.606002],
      zoom: 13,
      controls: ["zoomControl", "fullscreenControl"],
    });

    setMapInstance(newMap);
    renderMapObjects(newMap);
  };

  const renderMapObjects = (map: any) => {
    if (!map || !window.ymaps) return;

    map.geoObjects.removeAll();

    // Создаем кластеризатор
    const clusterer = new window.ymaps.Clusterer({
      preset: 'islands#invertedBlueClusterIcons',
      groupByCoordinates: false,
      clusterDisableClickZoom: false,
      clusterOpenBalloonOnClick: true,
    });

    // Создаем метки для точек
    const placemarks = points.map((point) => {
      return new window.ymaps.Placemark(
        [point.lon, point.lat],
        {
          hintContent: point.name,
          balloonContent: `
            <div style="width: 200px; height: 230px; text-align: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); background-color: #ffffff; display: flex; flex-direction: column; align-items: center;">
              <h4 style="margin: 0 0 10px; font-size: 14px; color: #555;">Lon: ${point.lon}  Lat: ${point.lat}</h4>
              <img src="${point.photoUrl || ''}" alt="Фото" style="width: 90%; height: 70%; border-radius: 6px; margin-bottom: 10px;"/>
              <p style="margin: 0; font-size: 14px; color: #555;">${point.name || 'Дополнительная информация не найдена.'}</p>
            </div>
          `,
        },
        {
          iconLayout: "default#image",
          iconImageHref: point.pointIcon || "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          iconImageSize: [100, 100],
          iconImageOffset: [-48, -24],
          hideIconOnBalloonOpen: false,
        }
      );
    });

    // Добавляем точки в кластеризатор
    clusterer.add(placemarks);

    // Добавляем кластеризатор на карту
    map.geoObjects.add(clusterer);

    // Добавляем линии кабелей
    cables.forEach((cable) => {
      if (!cable.path || cable.path.length < 2) return;

      const polyline = new window.ymaps.Polyline(
        cable.path.map(coord => [coord.lat, coord.lon]),
        {
          hintContent: `${cable.companyName} - ${cable.street}`,
          balloonContent: `<strong>${cable.companyName}</strong><br/>${cable.street}`,
        },
        {
          strokeColor: cable.color || "#0000FF",
          strokeWidth: 2.5,
          strokeOpacity: 0.8,
        }
      );

      map.geoObjects.add(polyline);
    });

    console.log("Regions на яндексе:", regions);

    // Рисуем полигоны регионов
    // if (regions && regions.length > 0) {
    //   regions.forEach(region => {
    //     const coords = region.coordinates.map(coord => [coord.lat, coord.lon]);

    //     if (coords.length > 2) {
    //       const polygon = new window.ymaps.Polygon(
    //         [coords], // <== ВАЖНО! Только один уровень
    //         {
    //           hintContent: region.name,
    //           balloonContent: region.name
    //         },
    //         {
    //           fillColor: region.color || '#ff0000',
    //           strokeColor: region.color || '#000000',
    //           opacity: 0.4,
    //           strokeWidth: 10
    //         }
    //       );

    //       map.geoObjects.add(polygon);

    //       // Центрируем карту по полигону (опционально)
    //       // map.setBounds(polygon.geometry.getBounds(), { checkZoomRange: true });
    //     }
    //   });
    // }

    if (regions && regions.length > 0) {
        regions.forEach(region => {
          if (region.areas && region.areas.length > 0) {
          region.areas.forEach(area => {
            const coords = area.coordinates.map(coord => [coord.lat, coord.lon]);

          if (coords.length > 2) {
            const polygon = new window.ymaps.Polygon(
              [coords],
              {
                hintContent: `${region.name} - ${area.name}`,
                balloonContent: `${region.name} - ${area.name}`
              },
              {
                fillColor: region.color || '#ff0000',
                strokeColor: region.color || '#000000',
                opacity: 0.4,
                strokeWidth: 10
              }
            );

            map.geoObjects.add(polygon);
          }
        });
        }
      });
    }




  };

  return (
    <div
      ref={mapRef}
      className="w-full min-h-[88vh] bg-gray-200 border border-gray-300 rounded-lg"
    />
  );
};
