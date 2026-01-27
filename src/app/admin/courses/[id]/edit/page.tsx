'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  category: string | null;
  level: string | null;
  language: string | null;
  duration_hours: number | null;
  ects_max: number | null;
  image_url: string | null;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    category: '',
    level: '',
    language: 'Italiano',
    duration_hours: null,
    ects_max: null,
    image_url: '',
  });

  const fetchCourse = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/courses?limit=1000`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento corso');
      }

      const data = await response.json();
      const course = data.courses.find((c: Course) => c.id === courseId);

      if (!course) {
        throw new Error('Corso non trovato');
      }

      setFormData({
        title: course.title,
        slug: course.slug,
        description: course.description || '',
        price: course.price,
        category: course.category || '',
        level: course.level || '',
        language: course.language || 'Italiano',
        duration_hours: course.duration_hours,
        ects_max: course.ects_max,
        image_url: course.image_url || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        id: courseId,
        ...formData,
        price: parseFloat(String(formData.price)),
        duration_hours: formData.duration_hours ? parseInt(String(formData.duration_hours)) : null,
        ects_max: formData.ects_max ? parseInt(String(formData.ects_max)) : null,
        description: formData.description || null,
        category: formData.category || null,
        level: formData.level || null,
        image_url: formData.image_url || null,
      };

      const response = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Errore nell\'aggiornamento corso');
      }

      router.push('/admin/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Modifica Corso</h1>
        <Link
          href="/admin/courses"
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Torna alla lista
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label id="edit-title-label" htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
              Titolo <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Inserisci il titolo del corso"
              aria-labelledby="edit-title-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label id="edit-slug-label" htmlFor="edit-slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              id="edit-slug"
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="esempio-titolo-corso"
              aria-labelledby="edit-slug-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label id="edit-description-label" htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Inserisci una descrizione del corso"
              aria-labelledby="edit-description-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="edit-price-label" htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-2">
              Prezzo (€) <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="0.00"
              aria-labelledby="edit-price-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="edit-category-label" htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              id="edit-category"
              type="text"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              placeholder="es. Tecnologia, Business, etc."
              aria-labelledby="edit-category-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="edit-level-label" htmlFor="edit-level" className="block text-sm font-medium text-gray-700 mb-2">
              Livello
            </label>
            <input
              id="edit-level"
              type="text"
              name="level"
              value={formData.level || ''}
              onChange={handleChange}
              placeholder="es. Principiante, Intermedio, Avanzato"
              aria-labelledby="edit-level-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="edit-language-label" htmlFor="edit-language" className="block text-sm font-medium text-gray-700 mb-2">
              Lingua
            </label>
            <select
              id="edit-language"
              name="language"
              value={formData.language || 'Italiano'}
              onChange={handleChange}
              title="Seleziona la lingua del corso"
              aria-labelledby="edit-language-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="Italiano">Italiano</option>
              <option value="Inglese">Inglese</option>
              <option value="Spagnolo">Spagnolo</option>
              <option value="Francese">Francese</option>
            </select>
          </div>

          <div>
            <label id="edit-duration_hours-label" htmlFor="edit-duration_hours" className="block text-sm font-medium text-gray-700 mb-2">
              Durata (ore)
            </label>
            <input
              id="edit-duration_hours"
              type="number"
              name="duration_hours"
              value={formData.duration_hours || ''}
              onChange={handleChange}
              min="0"
              placeholder="es. 10"
              aria-labelledby="edit-duration_hours-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="edit-ects_max-label" htmlFor="edit-ects_max" className="block text-sm font-medium text-gray-700 mb-2">
              ECTS Max
            </label>
            <input
              id="edit-ects_max"
              type="number"
              name="ects_max"
              value={formData.ects_max || ''}
              onChange={handleChange}
              min="0"
              placeholder="es. 5"
              aria-labelledby="edit-ects_max-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label id="edit-image_url-label" htmlFor="edit-image_url" className="block text-sm font-medium text-gray-700 mb-2">
              URL Immagine
            </label>
            <input
              id="edit-image_url"
              type="url"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              placeholder="https://esempio.com/immagine.jpg"
              aria-labelledby="edit-image_url-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end space-x-4">
          <Link
            href="/admin/courses"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvataggio...' : 'Salva Modifiche'}
          </button>
        </div>
      </form>
    </div>
  );
}

