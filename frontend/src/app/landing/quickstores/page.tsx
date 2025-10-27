"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const QuickStoresPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Popup: any;
    L: any;
  } | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Dynamically import Leaflet and React-Leaflet
    const loadLeaflet = async () => {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");
      setLeafletComponents({ MapContainer, TileLayer, Marker, Popup, L });
    };

    loadLeaflet();
  }, []);

  if (!isClient || !LeafletComponents) return null;

  const { MapContainer, TileLayer, Marker, Popup, L } = LeafletComponents;

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3082/3082383.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const storeIcon = L.icon({
    iconUrl: "https://cdn-icons-png.freepik.com/256/869/869636.png?semt=ais_hybrid",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const storeLocations = [
    { id: 1, lat: 10.9346, lng: 76.9587, name: "Store A" },
    { id: 2, lat: 10.9116, lng: 76.9187, name: "Store B" },
    { id: 3, lat: 10.9146, lng: 76.9167, name: "Store C" },
    { id: 4, lat: 10.4326, lng: 76.9537, name: "Store D" },
    { id: 5, lat: 10.9146, lng: 76.9927, name: "Store E" },
  ];

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[10.9346, 76.9787]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker icon={userIcon} position={[10.9346, 76.9787]}>
          <Popup>Your Location</Popup>
        </Marker>

        {storeLocations.map((store) => (
          <Marker key={store.id} icon={storeIcon} position={[store.lat, store.lng]}>
            <Popup>{store.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default QuickStoresPage;
