import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';

// GET: Recupera i log delle azioni admin
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const actionType = searchParams.get('actionType');
    const entityType = searchParams.get('entityType');
    const adminEmail = searchParams.get('adminEmail');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabaseAdmin = createSupabaseAdmin();

    // Query base
    let query = supabaseAdmin
      .from('admin_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filtri
    if (actionType) {
      query = query.eq('action_type', actionType);
    }

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    if (adminEmail) {
      query = query.ilike('admin_email', `%${adminEmail}%`);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Errore nel recupero log:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero log' },
      { status: 500 }
    );
  }
}

