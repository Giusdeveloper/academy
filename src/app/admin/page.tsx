'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalCompletions: number;
  recentCompletions: number;
}

interface Analytics {
  monthlyUsers: Array<{ month: string; count: number }>;
  monthlyCompletions: Array<{ month: string; count: number }>;
  topCourses: Array<{ id: string; title: string; slug: string; count: number }>;
  conversionRate: number;
  newUsers30Days: number;
  completions30Days: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalCompletions: 0,
    recentCompletions: 0,
  });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      // Usa API route invece di Supabase diretto per bypassare RLS
      const [usersRes, completionsRes] = await Promise.all([
        fetch('/api/admin/users?limit=1'),
        fetch('/api/admin/startup-award'),
      ]);

      let totalUsers = 0;
      let totalCourses = 0;
      let totalCompletions = 0;
      let recentCompletions = 0;

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        totalUsers = usersData.total || 0;
      }

      // Per i corsi, usa una query semplice
      try {
        const { count: courseCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });
        totalCourses = courseCount || 0;
      } catch (err) {
        console.warn('Errore nel recupero corsi:', err);
      }

      if (completionsRes.ok) {
        const completionsData = await completionsRes.json();
        totalCompletions = completionsData.stats?.totalCompletions || 0;
        recentCompletions = completionsData.stats?.recentCompletions || 0;
      }

      setStats({
        totalUsers,
        totalCourses,
        totalCompletions,
        recentCompletions,
      });
    } catch (error) {
      console.error('Errore nel recupero statistiche:', error);
      // Imposta valori di default anche in caso di errore
      setStats({
        totalUsers: 0,
        totalCourses: 0,
        totalCompletions: 0,
        recentCompletions: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Errore nel recupero analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Combina i dati mensili per un grafico comparativo
  const combinedMonthlyData = analytics?.monthlyUsers.map((userData, index) => ({
    month: userData.month,
    utenti: userData.count,
    completamenti: analytics.monthlyCompletions[index]?.count || 0,
  })) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Admin</h1>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Utenti Totali"
          value={stats.totalUsers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Corsi Totali"
          value={stats.totalCourses}
          icon="📚"
          color="green"
        />
        <StatCard
          title="Completamenti Fase 1"
          value={stats.totalCompletions}
          icon="✅"
          color="purple"
        />
        <StatCard
          title="Completamenti Recenti"
          value={stats.recentCompletions}
          icon="🆕"
          color="pink"
          subtitle="Ultimi 7 giorni"
        />
      </div>

      {/* Statistiche Avanzate */}
      {analytics && (
        <>
          {/* Metriche di Conversione */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Tasso di Conversione"
              value={`${analytics.conversionRate}%`}
              icon="📊"
              color="purple"
              subtitle="Iscritti → Completati"
            />
            <StatCard
              title="Nuovi Utenti (30gg)"
              value={analytics.newUsers30Days}
              icon="👤"
              color="blue"
              subtitle="Ultimi 30 giorni"
            />
            <StatCard
              title="Completamenti (30gg)"
              value={analytics.completions30Days}
              icon="✅"
              color="green"
              subtitle="Ultimi 30 giorni"
            />
          </div>

          {/* Grafico Comparativo */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Trend Comparativo (Ultimi 6 Mesi)
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={combinedMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="utenti"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Nuovi Utenti"
                />
                <Line
                  type="monotone"
                  dataKey="completamenti"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Completamenti"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grafici Separati */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Grafico Nuovi Utenti */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Nuovi Utenti (Ultimi 6 Mesi)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Nuovi Utenti"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Grafico Completamenti */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Completamenti (Ultimi 6 Mesi)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyCompletions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Completamenti"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Corsi */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top 5 Corsi Più Popolari
            </h2>
            {analytics.topCourses.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topCourses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="title"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#ec4899" name="Iscrizioni" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {analytics.topCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500">{course.slug}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-pink-600">{course.count}</p>
                        <p className="text-xs text-gray-500">iscrizioni</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nessun dato disponibile
              </p>
            )}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionLink
            href="/admin/events"
            title="Gestisci Eventi"
            description="Aggiungi, modifica o elimina eventi"
            icon="📅"
          />
          <QuickActionLink
            href="/admin/courses"
            title="Gestisci Corsi"
            description="Gestisci i corsi disponibili"
            icon="📚"
          />
          <QuickActionLink
            href="/admin/startup-award"
            title="Monitora Startup Award"
            description="Visualizza completamenti e statistiche"
            icon="🏆"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'pink';
  subtitle?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickActionLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="block p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </a>
  );
}

