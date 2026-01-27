'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    level: '',
    language: 'Italiano',
    duration_hours: '',
    ects_max: '',
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.price) {
        throw new Error('Titolo e prezzo sono obbligatori');
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
        ects_max: formData.ects_max ? parseInt(formData.ects_max) : null,
        slug: formData.slug || formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        description: formData.description || null,
        category: formData.category || null,
        level: formData.level || null,
        image_url: formData.image_url || null,
      };

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Errore nella creazione corso');
      }

      const result = await response.json();
      router.push(`/admin/courses/${result.course.id}/lessons`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Genera automaticamente lo slug dal titolo
    if (name === 'title' && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuovo Corso</h1>
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
            <label id="title-label" htmlFor="title" title="Titolo del corso" className="block text-sm font-medium text-gray-700 mb-2">
              Titolo <span className="text-red-500" title="Campo obbligatorio">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Inserisci il titolo del corso"
              aria-labelledby="title-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label id="slug-label" htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Generato automaticamente dal titolo"
              aria-labelledby="slug-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
            />
            <p className="mt-1 text-sm text-gray-500" title="Descrizione dello slug">URL-friendly identifier (es: finanziamento-aziendale)</p>
          </div>

          <div className="md:col-span-2">
            <label id="description-label" htmlFor="description" title="Descrizione del corso" className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Inserisci la descrizione del corso"
              aria-labelledby="description-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="price-label" htmlFor="price" title="Prezzo del corso" className="block text-sm font-medium text-gray-700 mb-2">
              Prezzo (€) <span className="text-red-500" title="Campo obbligatorio">*</span>
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="0.00"
              aria-labelledby="price-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="category-label" htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="es: Sviluppo Web"
              aria-labelledby="category-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="level-label" htmlFor="level" title="Livello del corso" className="block text-sm font-medium text-gray-700 mb-2">
              Livello
            </label>
            <input
              id="level"
              type="text"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="es: Principiante, Intermedio, Avanzato"
              title="Livello del corso"
              aria-labelledby="level-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="language-label" htmlFor="language" title="Lingua del corso" className="block text-sm font-medium text-gray-700 mb-2">
              Lingua
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              title="Seleziona la lingua del corso"
              aria-labelledby="language-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="Italiano" title="Italiano">Italiano</option>
              <option value="Inglese" title="Inglese">Inglese</option>
              <option value="Spagnolo" title="Spagnolo">Spagnolo</option>
              <option value="Francese" title="Francese">Francese</option>
            </select>
          </div>

          <div>
            <label id="duration_hours-label" htmlFor="duration_hours" className="block text-sm font-medium text-gray-700 mb-2">
              Durata (ore)
            </label>
            <input
              id="duration_hours"
              type="number"
              name="duration_hours"
              value={formData.duration_hours}
              onChange={handleChange}
              min="0"
              placeholder="es: 10"
              aria-labelledby="duration_hours-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label id="ects_max-label" htmlFor="ects_max" className="block text-sm font-medium text-gray-700 mb-2">
              ECTS Max
            </label>
            <input
              id="ects_max"
              type="number"
              name="ects_max"
              value={formData.ects_max}
              onChange={handleChange}
              min="0"
              placeholder="es: 5"
              aria-labelledby="ects_max-label"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label id="image_url-label" htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
              URL Immagine
            </label>
            <input
              id="image_url"
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              aria-labelledby="image_url-label"
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
            disabled={loading}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creazione...' : 'Crea Corso'}
          </button>
        </div>
      </form>
    </div>
  );
}

