'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Resource, ResourceType, ResourceCategory, DifficultyLevel, Language } from '@/types/resources';

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf' as ResourceType,
    category: 'startup' as ResourceCategory,
    file_url: '',
    thumbnail_url: '',
    file_size: '',
    is_featured: false,
    is_premium: false,
    is_active: true,
    tags: '',
    author: '',
    language: 'it' as Language,
    difficulty_level: 'beginner' as DifficultyLevel,
    estimated_time: '',
  });

  useEffect(() => {
    fetchResource();
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      const response = await fetch('/api/admin/resources');
      if (!response.ok) {
        throw new Error('Errore nel caricamento risorsa');
      }
      const data = await response.json();
      const resource = data.resources.find((r: Resource) => r.id === resourceId);

      if (!resource) {
        setError('Risorsa non trovata');
        return;
      }

      setFormData({
        title: resource.title,
        description: resource.description || '',
        type: resource.type,
        category: resource.category,
        file_url: resource.file_url,
        thumbnail_url: resource.thumbnail_url || '',
        file_size: resource.file_size?.toString() || '',
        is_featured: resource.is_featured || false,
        is_premium: resource.is_premium || false,
        is_active: resource.is_active !== undefined ? resource.is_active : true,
        tags: resource.tags?.join(', ') || '',
        author: resource.author || '',
        language: resource.language || 'it',
        difficulty_level: resource.difficulty_level || 'beginner',
        estimated_time: resource.estimated_time?.toString() || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        id: resourceId,
        ...formData,
        file_size: formData.file_size ? parseInt(formData.file_size) : null,
        estimated_time: formData.estimated_time ? parseInt(formData.estimated_time) : null,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : [],
        thumbnail_url: formData.thumbnail_url || null,
        author: formData.author || null,
      };

      const response = await fetch('/api/admin/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Errore nell\'aggiornamento risorsa');
      }

      router.push('/admin/resources');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
        <Link
          href="/admin/resources"
          className="text-pink-500 hover:text-pink-600 font-medium"
        >
          ← Torna alla lista
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Modifica Risorsa</h1>
        <Link
          href="/admin/resources"
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Torna alla lista
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titolo *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="template">Template</option>
              <option value="guide">Guida</option>
              <option value="tool">Strumento</option>
              <option value="ebook">E-book</option>
              <option value="checklist">Checklist</option>
              <option value="presentation">Presentazione</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="finanza">Finanza</option>
              <option value="startup">Startup</option>
              <option value="investimenti">Investimenti</option>
              <option value="marketing">Marketing</option>
              <option value="legal">Legale</option>
              <option value="tech">Tecnologia</option>
              <option value="business">Business</option>
              <option value="fundraising">Fundraising</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="file_url" className="block text-sm font-medium text-gray-700 mb-2">
              URL File *
            </label>
            <input
              type="url"
              id="file_url"
              name="file_url"
              required
              value={formData.file_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-2">
              URL Thumbnail
            </label>
            <input
              type="url"
              id="thumbnail_url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="file_size" className="block text-sm font-medium text-gray-700 mb-2">
              Dimensione File (bytes)
            </label>
            <input
              type="number"
              id="file_size"
              name="file_size"
              value={formData.file_size}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Autore
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Lingua
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-2">
              Livello Difficoltà
            </label>
            <select
              id="difficulty_level"
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzato</option>
            </select>
          </div>

          <div>
            <label htmlFor="estimated_time" className="block text-sm font-medium text-gray-700 mb-2">
              Tempo Stimato (minuti)
            </label>
            <input
              type="number"
              id="estimated_time"
              name="estimated_time"
              value={formData.estimated_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tag (separati da virgola)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">Separa i tag con virgole</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="ml-2 text-sm text-gray-700">Risorsa in evidenza</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_premium"
              checked={formData.is_premium}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="ml-2 text-sm text-gray-700">Risorsa Premium</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="ml-2 text-sm text-gray-700">Attiva (visibile sul sito)</span>
          </label>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Link
            href="/admin/resources"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400"
          >
            {saving ? 'Salvataggio...' : 'Salva Modifiche'}
          </button>
        </div>
      </form>
    </div>
  );
}

