import React, { useState } from 'react';
import {
  Bike,
  ShoppingBag,
  Store,
  Layers,
  Activity
} from 'lucide-react';
import { MAP_PINS_DATA } from '../data/adminMockData';
import { AdminOlaMap, AdminMapPin } from './AdminOlaMap';

export const AdminLiveMapView: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'riders' | 'orders' | 'shops'>('all');
  const [selectedPin, setSelectedPin] = useState<AdminMapPin | null>(null);

  const rawPins = MAP_PINS_DATA as AdminMapPin[];

  const filteredPins = rawPins.filter((p) => {
    if (filterType === 'all') return true;
    if (filterType === 'riders') return p.type === 'rider';
    if (filterType === 'orders') return p.type === 'order';
    if (filterType === 'shops') return p.type === 'shop';
    return true;
  });

  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Zones & Live Operational Map</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-extrabold flex items-center gap-1.5 border border-[#1DB954]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping" />
              Ola Maps Vector Telemetry
            </span>
          </div>
          <p className="text-xs text-[#A7A7A7] mt-0.5">
            Real-time rider tracking, active customer drop-offs, and serviceable Jaipur delivery corridors
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#181818] p-1 rounded-xl border border-[#292929]">
          {[
            { id: 'all', label: `All Markers (${rawPins.length})` },
            { id: 'riders', label: 'Riders (178)' },
            { id: 'orders', label: 'Active Orders (518)' },
            { id: 'shops', label: 'Stores (356)' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilterType(f.id as any);
                setSelectedPin(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === f.id ? 'bg-[#14532D] text-white' : 'text-[#A7A7A7] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[640px] rounded-2xl bg-[#0F1318] border border-[#292929] overflow-hidden shadow-2xl">
        {/* Interactive Ola Map */}
        <AdminOlaMap
          pins={filteredPins}
          selectedPin={selectedPin}
          onSelectPin={setSelectedPin}
          height="640px"
        />

        {/* Zone Overview Pill Tags (Top Left Overlay) */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-[#1DB954]/40 text-xs font-bold text-[#1DB954] shadow-lg pointer-events-auto">
            Zone 1: Vaishali Nagar & Civil Lines (3.2 km avg ETA)
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-blue-500/40 text-xs font-bold text-blue-400 shadow-lg pointer-events-auto">
            Zone 2: Malviya Nagar & Jagatpura (4.1 km avg ETA)
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-400 shadow-lg pointer-events-auto">
            Zone 3: Mansarovar & Sanganer (3.8 km avg ETA)
          </div>
        </div>

        {/* Selected Pin Details Modal / Drawer (Bottom Left Overlay) */}
        {selectedPin && (
          <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-[#181818]/95 border border-[#292929] backdrop-blur-md shadow-2xl w-80 text-xs z-30 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#292929] mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedPin.color }}></span>
                <span className="font-extrabold text-white text-sm">{selectedPin.name}</span>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-sm text-[#6F6F6F] hover:text-white cursor-pointer px-1"
              >
                &times;
              </button>
            </div>
            <div className="space-y-1.5">
              <p className="text-[#A7A7A7]">
                Type: <span className="text-white font-bold capitalize">{selectedPin.type}</span>
              </p>
              <p className="text-[#A7A7A7]">
                Status: <span className="text-[#1DB954] font-bold">{selectedPin.status}</span>
              </p>
              {selectedPin.zone && (
                <p className="text-[#A7A7A7]">
                  Corridor: <span className="text-white font-semibold">{selectedPin.zone}</span>
                </p>
              )}
              {selectedPin.eta && (
                <p className="text-[#A7A7A7]">
                  Estimated Arrival: <span className="text-white font-mono">{selectedPin.eta}</span>
                </p>
              )}
              {selectedPin.customer && (
                <p className="text-[#A7A7A7]">
                  Customer: <span className="text-white font-bold">{selectedPin.customer}</span>
                </p>
              )}
              {selectedPin.activeOrders && (
                <p className="text-[#A7A7A7]">
                  Active Shop Orders: <span className="text-[#1DB954] font-bold">{selectedPin.activeOrders}</span>
                </p>
              )}
              <div className="mt-2 pt-2 border-t border-[#292929] text-[10px] text-[#6F6F6F]">
                GPS Coordinates: {selectedPin.lat.toFixed(4)}° N, {selectedPin.lng.toFixed(4)}° E
              </div>
            </div>
          </div>
        )}

        {/* Legend (Bottom Right Overlay) */}
        <div className="absolute bottom-6 right-6 p-3 rounded-xl bg-black/85 border border-[#292929] backdrop-blur-md flex items-center gap-4 text-xs font-semibold z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1DB954] shadow-sm" />
            <span>Online Rider</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#3B82F6] shadow-sm" />
            <span>Active Order</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F97316] shadow-sm" />
            <span>Merchant Store</span>
          </div>
        </div>
      </div>
    </div>
  );
};
