 
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  order: number;
  course_id: string;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

export default function CourseLessonsPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order: 1,
  });

  const fetchCourse = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/courses?limit=1000`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento corso');
      }

      const data = await response.json();
      const foundCourse = data.courses.find((c: Course) => c.id === courseId);
      setCourse(foundCourse || null);
    } catch (err) {
      console.error('Errore nel caricamento corso:', err);
    }
  }, [courseId]);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento lezioni');
      }

      const data = await response.json();
      setLessons(data.lessons || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchLessons();
    }
  }, [courseId, fetchCourse, fetchLessons]);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Errore nella creazione lezione');
      }

      setShowNewLessonForm(false);
      setFormData({ title: '', content: '', order: lessons.length + 1 });
      fetchLessons();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const handleUpdateLesson = async (lessonId: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Errore nell\'aggiornamento lezione');
      }

      setEditingLessonId(null);
      setFormData({ title: '', content: '', order: 1 });
      fetchLessons();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!confirm(`Sei sicuro di voler eliminare la lezione "${lessonTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons?lessonId=${lessonId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore nell\'eliminazione lezione');
      }

      fetchLessons();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const startEdit = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setFormData({
      title: lesson.title,
      content: lesson.content || '',
      order: lesson.order,
    });
    setShowNewLessonForm(false);
  };

  const cancelEdit = () => {
    setEditingLessonId(null);
    setFormData({ title: '', content: '', order: 1 });
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Lezioni: {course?.title || 'Caricamento...'}
          </h1>
          <p className="text-gray-500 mt-1">
            Gestisci le lezioni del corso
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/courses"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Torna ai corsi
          </Link>
          {course && (
            <Link
              href={`/admin/courses/${courseId}/edit`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Modifica Corso
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Form Nuova Lezione */}
      {showNewLessonForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Nuova Lezione</h2>
          <form onSubmit={handleCreateLesson}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label id="new-lesson-title-label" htmlFor="new-lesson-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titolo <span className="text-red-500">*</span>
                </label>
                { }
                <input
                  id="new-lesson-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  aria-labelledby="new-lesson-title-label"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label id="new-lesson-order-label" htmlFor="new-lesson-order" className="block text-sm font-medium text-gray-700 mb-2">
                  Ordine
                </label>
                <input
                  id="new-lesson-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  min="1"
                  aria-labelledby="new-lesson-order-label"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <label id="new-lesson-content-label" htmlFor="new-lesson-content" className="block text-sm font-medium text-gray-700 mb-2">
                Contenuto
              </label>
              { }
              <textarea
                id="new-lesson-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                aria-labelledby="new-lesson-content-label"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="mt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewLessonForm(false);
                  setFormData({ title: '', content: '', order: lessons.length + 1 });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
              >
                Crea Lezione
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista Lezioni */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Lezioni ({lessons.length})
          </h2>
          {!showNewLessonForm && (
            <button
              onClick={() => {
                setShowNewLessonForm(true);
                setEditingLessonId(null);
                setFormData({ title: '', content: '', order: lessons.length + 1 });
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>+</span>
              <span>Nuova Lezione</span>
            </button>
          )}
        </div>

        {lessons.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">Nessuna lezione presente.</p>
            <button
              onClick={() => setShowNewLessonForm(true)}
              className="text-pink-600 hover:text-pink-900 font-medium"
            >
              Crea la prima lezione →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="p-6 hover:bg-gray-50">
                {editingLessonId === lesson.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateLesson(lesson.id);
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label id={`edit-lesson-title-label-${lesson.id}`} htmlFor={`edit-lesson-title-${lesson.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Titolo
                        </label>
                        <input
                          id={`edit-lesson-title-${lesson.id}`}
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                          aria-labelledby={`edit-lesson-title-label-${lesson.id}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label id={`edit-lesson-order-label-${lesson.id}`} htmlFor={`edit-lesson-order-${lesson.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Ordine
                        </label>
                        <input
                          id={`edit-lesson-order-${lesson.id}`}
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                          min="1"
                          aria-labelledby={`edit-lesson-order-label-${lesson.id}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label id={`edit-lesson-content-label-${lesson.id}`} htmlFor={`edit-lesson-content-${lesson.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Contenuto
                      </label>
                      <textarea
                        id={`edit-lesson-content-${lesson.id}`}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={6}
                        aria-labelledby={`edit-lesson-content-label-${lesson.id}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                      >
                        Salva
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">#{lesson.order}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                      </div>
                      {lesson.content && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{lesson.content}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => startEdit(lesson)}
                        className="px-3 py-1 text-sm text-pink-600 hover:text-pink-900"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-900"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

