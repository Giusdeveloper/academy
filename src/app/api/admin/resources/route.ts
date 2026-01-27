import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';
import { logCreate, logUpdate, logDelete } from '@/lib/admin-logs';

// GET: Recupera tutte le risorse
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    const supabaseAdmin = createSupabaseAdmin();
    let query = supabaseAdmin
      .from('resources')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      resources: data || [],
      total: count || 0,
    });
  } catch (error) {
    console.error('Errore nel recupero risorse:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero risorse' },
      { status: 500 }
    );
  }
}

// POST: Crea una nuova risorsa
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      category,
      file_url,
      thumbnail_url,
      file_size,
      is_featured,
      is_premium,
      is_active,
      tags,
      author,
      language,
      difficulty_level,
      estimated_time,
    } = body;

    // Validazione
    if (!title || !type || !category || !file_url) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: title, type, category, file_url' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('resources')
      .insert({
        title,
        description: description || null,
        type,
        category,
        file_url,
        thumbnail_url: thumbnail_url || null,
        file_size: file_size || null,
        is_featured: is_featured || false,
        is_premium: is_premium || false,
        is_active: is_active !== undefined ? is_active : true,
        tags: tags || [],
        author: author || null,
        language: language || 'it',
        difficulty_level: difficulty_level || 'beginner',
        estimated_time: estimated_time || null,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log dell'azione
    await logCreate('RESOURCE', data.id, data.title, request);

    return NextResponse.json({ success: true, resource: data });
  } catch (error) {
    console.error('Errore nella creazione risorsa:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione risorsa', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT: Aggiorna una risorsa esistente
export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID risorsa richiesto' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('resources')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log dell'azione
    await logUpdate('RESOURCE', id, data.title, updates, request);

    return NextResponse.json({ success: true, resource: data });
  } catch (error) {
    console.error('Errore nell\'aggiornamento risorsa:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento risorsa' },
      { status: 500 }
    );
  }
}

// DELETE: Elimina una risorsa
export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID risorsa richiesto' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdmin();
    
    // Recupera il titolo prima di eliminare per il log
    const { data: resource } = await supabaseAdmin
      .from('resources')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin.from('resources').delete().eq('id', id);

    if (error) {
      throw error;
    }

    // Log dell'azione
    if (resource) {
      await logDelete('RESOURCE', id, resource.title, request);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione risorsa:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione risorsa' },
      { status: 500 }
    );
  }
}

