"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function VenueApprovals() {
  const [pendingVenues, setPendingVenues] = useState<any[]>([]);

  useEffect(() => {
    const fetchPending = async () => {
      const q = query(collection(db, "venues"), where("isActive", "==", false));
      const snapshot = await getDocs(q);
      setPendingVenues(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchPending();
  }, []);

  const handleApprove = async (id: string, email: string) => {
    try {
      await updateDoc(doc(db, "venues", id), { isActive: true });
      console.log(`Venue ${id} activada. Mail a ${email}`);
      setPendingVenues(prev => prev.filter(v => v.id !== id));
      alert("Venue activada y notificación enviada.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4">🤝 Solicitudes B2B</h3>
      <div className="space-y-3">
        {pendingVenues.length === 0 ? (
          <p className="text-zinc-600 text-[9px] uppercase text-center py-2">No hay pendientes</p>
        ) : (
          pendingVenues.map(venue => (
            <div key={venue.id} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-zinc-800">
              <span className="text-white text-[10px] font-bold">{venue.name}</span>
              <button onClick={() => handleApprove(venue.id, venue.b2BEmail)} className="text-green-500 text-[9px] font-black uppercase">Activar</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
