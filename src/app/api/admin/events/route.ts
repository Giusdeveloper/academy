import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-utils';
import { logCreate, logUpdate, logDelete } from '@/lib/admin-logs';
import fs from 'fs';
import path from 'path';

// Percorso del file events.json
const getEventsFilePath = () => {
  return path.join(process.cwd(), 'src', 'config', 'events.json');
};

// GET: Recupera tutti gli eventi
export async function GET() {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const filePath = getEventsFilePath();
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Errore nel recupero eventi:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero eventi' },
      { status: 500 }
    );
  }
}

// POST: Crea un nuovo evento
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { title, partner, description, date, location, ticketPrice, ticketUrl, featured, active } = body;

    // Validazione
    if (!title || !partner || !description || !date || !location || !ticketPrice || !ticketUrl) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      );
    }

    // Genera ID univoco
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const newEvent = {
      id,
      title,
      partner,
      description,
      date,
      location,
      ticketPrice,
      ticketUrl,
      image: null,
      featured: featured ?? false,
      active: active ?? true,
    };

    // Leggi il file esistente
    const filePath = getEventsFilePath();
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Aggiungi il nuovo evento
    data.events.push(newEvent);

    // Scrivi il file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    // Log dell'azione
    await logCreate('EVENT', id, title, request);

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Errore nella creazione evento:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione evento' },
      { status: 500 }
    );
  }
}

// PUT: Aggiorna un evento esistente
export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID evento richiesto' }, { status: 400 });
    }

    // Leggi il file esistente
    const filePath = getEventsFilePath();
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Trova e aggiorna l'evento
    const eventIndex = data.events.findIndex((e: { id: string }) => e.id === id);
    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Evento non trovato' }, { status: 404 });
    }

    // Aggiorna l'evento mantenendo i campi esistenti
    data.events[eventIndex] = {
      ...data.events[eventIndex],
      ...updates,
      id, // Mantieni l'ID originale
    };

    // Scrivi il file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    // Log dell'azione
    await logUpdate('EVENT', id, data.events[eventIndex].title, updates, request);

    return NextResponse.json({ success: true, event: data.events[eventIndex] });
  } catch (error) {
    console.error('Errore nell\'aggiornamento evento:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento evento' },
      { status: 500 }
    );
  }
}

// DELETE: Elimina un evento
export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID evento richiesto' }, { status: 400 });
    }

    // Leggi il file esistente
    const filePath = getEventsFilePath();
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Trova l'evento prima di eliminarlo per il log
    const eventToDelete = data.events.find((e: { id: string }) => e.id === id);
    if (!eventToDelete) {
      return NextResponse.json({ error: 'Evento non trovato' }, { status: 404 });
    }

    // Rimuovi l'evento
    data.events = data.events.filter((e: { id: string }) => e.id !== id);

    // Scrivi il file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    // Log dell'azione
    await logDelete('EVENT', id, eventToDelete.title, request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione evento:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione evento' },
      { status: 500 }
    );
  }
}

