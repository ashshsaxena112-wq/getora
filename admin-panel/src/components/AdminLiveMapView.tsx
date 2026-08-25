import React, { useState } from 'react';
import {
  Bike,
  ShoppingBag,
  Store
} from 'lucide-react';
import { MAP_PINS_DATA } from '../data/adminMockData';

export const AdminLiveMapView: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'riders' | 'orders' | 'shops'>('all');
  const [selectedPin, setSelectedPin] = useState<any | null>(null);

  const filteredPins = MAP_PINS_DATA.filter((p) => {
    if (filterType === 'all') return true;
    if (filterType === 'riders') return p.type === 'rider';
    if (filterType === 'orders') return p.type === 'order';
    if (filterType === 'shops') return p.type === 'shop';
    return true;
  });

  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Zones & Live Operational Map</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-[#A7A7A7]">Real-time rider tracking, active customer drop-offs, and serviceable Jaipur zones</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#181818] p-1 rounded-xl border border-[#292929]">
          {[
            { id: 'all', label: 'All Markers' },
            { id: 'riders', label: 'Riders (178)' },
            { id: 'orders', label: 'Active Orders (518)' },
            { id: 'shops', label: 'Stores (356)' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === f.id ? 'bg-[#14532D] text-white' : 'text-[#A7A7A7] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[620px] rounded-2xl bg-[#0F1318] border border-[#292929] overflow-hidden shadow-2xl">
        <svg className="w-full h-full opacity-35" viewBox="0 0 1000 600">
          <defs>
            <pattern id="gridMapPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#232C3A" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="1000" height="600" fill="url(#gridMapPattern)" />

          <polygon
            points="150,80 420,50 580,180 500,480 200,440"
            fill="#1DB954"
            fillOpacity="0.08"
            stroke="#1DB954"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <polygon
            points="580,180 880,120 920,400 640,490 500,480"
            fill="#3B82F6"
            fillOpacity="0.06"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          <path d="M 50 300 Q 300 120 550 300 T 950 260" fill="none" stroke="#3D4B5C" strokeWidth="4" />
          <path d="M 200 40 Q 420 300 650 560" fill="none" stroke="#3D4B5C" strokeWidth="3" />
          <path d="M 750 40 L 480 560" fill="none" stroke="#3D4B5C" strokeWidth="2.5" />
        </svg>

        <div className="absolute top-8 left-16 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xs border border-[#1DB954]/30 text-xs font-bold text-[#1DB954]">
          Zone 1: Vaishali Nagar & Civil Lines (3.2 km avg ETA)
        </div>
        <div className="absolute top-12 right-24 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xs border border-blue-500/30 text-xs font-bold text-blue-400">
          Zone 2: Malviya Nagar & Jagatpura (4.1 km avg ETA)
        </div>
        <div className="absolute bottom-16 left-28 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xs border border-amber-500/30 text-xs font-bold text-amber-400">
          Zone 3: Mansarovar & Sanganer (3.8 km avg ETA)
        </div>

        {filteredPins.map((pin) => (
          <div
            key={pin.id}
            onClick={() => setSelectedPin(pin)}
            style={{ left: pin.x, top: pin.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-125 border border-white/20"
              style={{ backgroundColor: pin.color }}
            >
              {pin.type === 'rider' && <Bike className="w-4 h-4 text-black stroke-[2.5]" />}
              {pin.type === 'order' && <ShoppingBag className="w-4 h-4 text-white stroke-[2.5]" />}
              {pin.type === 'shop' && <Store className="w-4 h-4 text-white stroke-[2.5]" />}
            </div>
            <span
              className="absolute -inset-1 rounded-full animate-ping opacity-50 pointer-events-none"
              style={{ backgroundColor: pin.color }}
            />
          </div>
        ))}

        {selectedPin && (
          <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-[#181818]/95 border border-[#292929] backdrop-blur-md shadow-2xl w-80 text-xs z-30 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#292929] mb-2">
              <span className="font-extrabold text-white text-sm">{selectedPin.name}</span>
              <button onClick={() => setSelectedPin(null)} className="text-sm text-[#6F6F6F] hover:text-white">
                &times;
              </button>
            </div>
            <div className="space-y-1.5">
              <p className="text-[#A7A7A7]">Status: <span className="text-[#1DB954] font-bold">{selectedPin.status}</span></p>
              {selectedPin.eta && <p className="text-[#A7A7A7]">Estimated Arrival: <span className="text-white font-mono">{selectedPin.eta}</span></p>}
              {selectedPin.customer && <p className="text-[#A7A7A7]">Customer: <span className="text-white font-bold">{selectedPin.customer}</span></p>}
              {selectedPin.activeOrders && <p className="text-[#A7A7A7]">Active Shop Orders: <span className="text-[#1DB954] font-bold">{selectedPin.activeOrders}</span></p>}
            </div>
          </div>
        )}

        <div className="absolute bottom-6 right-6 p-3 rounded-xl bg-black/75 border border-[#292929] backdrop-blur-xs flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1DB954]" />
            <span>Online Rider</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
            <span>Customer Order</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F97316]" />
            <span>Merchant Store</span>
          </div>
        </div>
      </div>
    </div>
  );
};
