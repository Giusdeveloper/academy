import { NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';

// GET: Recupera statistiche avanzate per la dashboard
export async function GET() {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const supabaseAdmin = createSupabaseAdmin();

    // 1. Nuovi utenti per mese (ultimi 6 mesi)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const { data: usersData } = await supabaseAdmin
      .from('users')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true });

    const usersByMonth = groupByMonth(usersData || [], 'created_at');
    const monthlyUsers = generateMonthlyData(usersByMonth, 6);

    // 2. Completamenti per mese (ultimi 6 mesi)
    const { data: completionsData } = await supabaseAdmin
      .from('startup_award_progress')
      .select('phase1_completed_at')
      .not('phase1_completed_at', 'is', null)
      .gte('phase1_completed_at', sixMonthsAgo.toISOString())
      .order('phase1_completed_at', { ascending: true });

    const completionsByMonth = groupByMonth(completionsData || [], 'phase1_completed_at');
    const monthlyCompletions = generateMonthlyData(completionsByMonth, 6);

    // 3. Top corsi più popolari (per numero di iscrizioni)
    const { data: progressData } = await supabaseAdmin
      .from('progress')
      .select('course_id, courses:course_id(id, title, slug)');

    const courseCounts = new Map<string, { count: number; title: string; slug: string }>();
    
    progressData?.forEach((p: { course_id?: string; courses?: { title?: string; slug?: string } | null }) => {
      if (p.course_id && p.courses) {
        const courseId = p.course_id;
        const current = courseCounts.get(courseId) || { count: 0, title: p.courses.title || 'Sconosciuto', slug: p.courses.slug || '' };
        courseCounts.set(courseId, { ...current, count: current.count + 1 });
      }
    });

    const topCourses = Array.from(courseCounts.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Metriche di conversione
    const { count: totalEnrolled } = await supabaseAdmin
      .from('startup_award_progress')
      .select('*', { count: 'exact', head: true });

    const { count: totalCompleted } = await supabaseAdmin
      .from('startup_award_progress')
      .select('*', { count: 'exact', head: true })
      .not('phase1_completed_at', 'is', null);

    const conversionRate = totalEnrolled && totalEnrolled > 0
      ? ((totalCompleted || 0) / totalEnrolled * 100).toFixed(1)
      : '0';

    // 5. Nuovi utenti ultimi 30 giorni
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: newUsers30Days } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // 6. Completamenti ultimi 30 giorni
    const { count: completions30Days } = await supabaseAdmin
      .from('startup_award_progress')
      .select('*', { count: 'exact', head: true })
      .not('phase1_completed_at', 'is', null)
      .gte('phase1_completed_at', thirtyDaysAgo.toISOString());

    return NextResponse.json({
      monthlyUsers,
      monthlyCompletions,
      topCourses,
      conversionRate: parseFloat(conversionRate),
      newUsers30Days: newUsers30Days || 0,
      completions30Days: completions30Days || 0,
    });
  } catch (error) {
    console.error('Errore nel recupero analytics:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero analytics' },
      { status: 500 }
    );
  }
}

// Helper: Raggruppa dati per mese
function groupByMonth(data: Array<Record<string, unknown>>, dateField: string): Map<string, number> {
  const grouped = new Map<string, number>();
  
  data.forEach((item) => {
    if (!item[dateField]) return;
    const date = new Date(item[dateField] as string);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    grouped.set(monthKey, (grouped.get(monthKey) || 0) + 1);
  });
  
  return grouped;
}

// Helper: Genera dati mensili per gli ultimi N mesi
function generateMonthlyData(groupedData: Map<string, number>, months: number): Array<{ month: string; count: number }> {
  const result: Array<{ month: string; count: number }> = [];
  const today = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
    result.push({
      month: monthName,
      count: groupedData.get(monthKey) || 0,
    });
  }
  
  return result;
}

