import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';
import { logCreate, logUpdate, logDelete } from '@/lib/admin-logs';

// GET: Recupera tutti i corsi
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabaseAdmin = createSupabaseAdmin();
    let query = supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      courses: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Errore nel recupero corsi:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero corsi' },
      { status: 500 }
    );
  }
}

// POST: Crea un nuovo corso
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
      price,
      slug,
      category,
      level,
      language,
      duration_hours,
      ects_max,
      image_url,
    } = body;

    // Validazione
    if (!title || !price || !slug) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: title, price, slug' },
        { status: 400 }
      );
    }

    // Genera slug se non fornito
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const supabaseAdmin = createSupabaseAdmin();
    
    // Verifica che lo slug sia univoco
    const { data: existingCourse } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('slug', finalSlug)
      .single();

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Uno corso con questo slug esiste già' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert({
        title,
        description: description || null,
        price: parseFloat(price),
        slug: finalSlug,
        category: category || null,
        level: level || null,
        language: language || 'Italiano',
        duration_hours: duration_hours || null,
        ects_max: ects_max || null,
        image_url: image_url || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log dell'azione
    await logCreate('COURSE', data.id, data.title, request);

    return NextResponse.json({ success: true, course: data });
  } catch (error) {
    console.error('Errore nella creazione corso:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione corso', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT: Aggiorna un corso esistente
export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID corso richiesto' }, { status: 400 });
    }

    // Se viene modificato lo slug, verifica che sia univoco
    if (updates.slug) {
      const supabaseAdmin = createSupabaseAdmin();
      const { data: existingCourse } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('slug', updates.slug)
        .neq('id', id)
        .single();

      if (existingCourse) {
        return NextResponse.json(
          { error: 'Uno corso con questo slug esiste già' },
          { status: 400 }
        );
      }
    }

    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('courses')
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
    await logUpdate('COURSE', id, data.title, updates, request);

    return NextResponse.json({ success: true, course: data });
  } catch (error) {
    console.error('Errore nell\'aggiornamento corso:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento corso' },
      { status: 500 }
    );
  }
}

// DELETE: Elimina un corso
export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID corso richiesto' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdmin();
    
    // Recupera il titolo prima di eliminare per il log
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin.from('courses').delete().eq('id', id);

    if (error) {
      throw error;
    }

    // Log dell'azione
    if (course) {
      await logDelete('COURSE', id, course.title, request);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione corso:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione corso' },
      { status: 500 }
    );
  }
}

