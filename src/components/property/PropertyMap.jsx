import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PropertyMap({ properties }) {
  const center = properties.length > 0
    ? [properties[0].lat || 40.7128, properties[0].lng || -74.006]
    : [40.7128, -74.006];

  const validProperties = properties.filter(p => p.lat && p.lng);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 h-full min-h-[400px]">
      <MapContainer center={center} zoom={11} className="h-full w-full" style={{ minHeight: "400px" }}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {validProperties.map((property) => (
          <Marker key={property.id} position={[property.lat, property.lng]}>
            <Popup>
              <Link to={`/Property?id=${property.id}`} className="block">
                <div className="w-52">
                  <img
                    src={property.images?.[0] || ""}
                    alt={property.title}
                    className="w-full h-28 object-cover rounded-lg mb-2"
                  />
                  <p className="font-semibold text-sm text-slate-900 mb-1 line-clamp-1">{property.title}</p>
                  <p className="text-sm font-bold text-rose-600">${property.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{property.rooms} rooms · {property.area} m²</p>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}