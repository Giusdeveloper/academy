'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { getStartupAwardStatus, type StartupAwardStatus } from '@/lib/startup-award-tracking';
import type { User } from '@supabase/supabase-js';

interface StartupAwardStatusProps {
  courseId: string;
}

export default function StartupAwardStatus({ courseId }: StartupAwardStatusProps) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<StartupAwardStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Errore nel controllo autenticazione:', error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const statusData = await getStartupAwardStatus(user.email, courseId);
        setStatus(statusData);
      } catch (error) {
        console.error('Errore nel recuperare stato:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [user, courseId]);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Caricamento stato percorso...</p>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Stato Percorso Startup Award
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Fase 1: Iscrizione</span>
          <span className={`font-medium ${status.phase1_enrolled_at ? 'text-green-600' : 'text-gray-400'}`}>
            {status.phase1_enrolled_at ? '✓ Completata' : 'Non completata'}
          </span>
        </div>
        
        {status.phase1_enrolled_at && (
          <div className="text-xs text-gray-500 ml-4">
            Iscritto il: {new Date(status.phase1_enrolled_at).toLocaleDateString('it-IT')}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Fase 1: Completamento Corso</span>
          <span className={`font-medium ${status.is_phase1_completed ? 'text-green-600' : 'text-yellow-600'}`}>
            {status.is_phase1_completed ? '✓ Completata' : 'In corso'}
          </span>
        </div>
        
        {status.phase1_completed_at && (
          <div className="text-xs text-gray-500 ml-4">
            Completato il: {new Date(status.phase1_completed_at).toLocaleDateString('it-IT')}
          </div>
        )}

        {status.is_phase1_completed && (
          <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-xs">
            🎉 Fase 1 completata! Sei pronto per la Fase 2.
          </div>
        )}
      </div>
    </div>
  );
}

