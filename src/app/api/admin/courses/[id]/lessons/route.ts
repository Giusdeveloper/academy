import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';
import { logCreate, logUpdate, logDelete } from '@/lib/admin-logs';

// GET: Recupera tutte le lezioni di un corso
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { id: courseId } = await params;

    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ lessons: data || [] });
  } catch (error) {
    console.error('Errore nel recupero lezioni:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero lezioni' },
      { status: 500 }
    );
  }
}

// POST: Crea una nuova lezione
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { id: courseId } = await params;
    const body = await request.json();
    const { title, content, order } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Titolo lezione richiesto' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createSupabaseAdmin();
    
    // Se order non è specificato, usa il prossimo numero disponibile
    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const { data: existingLessons } = await supabaseAdmin
        .from('lessons')
        .select('order')
        .eq('course_id', courseId)
        .order('order', { ascending: false })
        .limit(1);
      
      finalOrder = existingLessons && existingLessons.length > 0
        ? existingLessons[0].order + 1
        : 1;
    }

    const { data, error } = await supabaseAdmin
      .from('lessons')
      .insert({
        course_id: courseId,
        title,
        content: content || null,
        order: finalOrder,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log dell'azione
    await logCreate('LESSON', data.id, data.title, request);

    return NextResponse.json({ success: true, lesson: data });
  } catch (error) {
    console.error('Errore nella creazione lezione:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione lezione' },
      { status: 500 }
    );
  }
}

// PUT: Aggiorna una lezione
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { id: courseId } = await params;
    const body = await request.json();
    const { lessonId, ...updates } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'ID lezione richiesto' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('lessons')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lessonId)
      .eq('course_id', courseId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log dell'azione
    await logUpdate('LESSON', lessonId, data.title, updates, request);

    return NextResponse.json({ success: true, lesson: data });
  } catch (error) {
    console.error('Errore nell\'aggiornamento lezione:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento lezione' },
      { status: 500 }
    );
  }
}

// DELETE: Elimina una lezione
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { id: courseId } = await params;
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'ID lezione richiesto' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdmin();
    
    // Recupera il titolo prima di eliminare per il log
    const { data: lesson } = await supabaseAdmin
      .from('lessons')
      .select('title')
      .eq('id', lessonId)
      .eq('course_id', courseId)
      .single();

    const { error } = await supabaseAdmin
      .from('lessons')
      .delete()
      .eq('id', lessonId)
      .eq('course_id', courseId);

    if (error) {
      throw error;
    }

    // Log dell'azione
    if (lesson) {
      await logDelete('LESSON', lessonId, lesson.title, request);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione lezione:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione lezione' },
      { status: 500 }
    );
  }
}

