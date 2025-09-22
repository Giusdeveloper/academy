// Tipi specifici per le pagine lezioni
export interface Lesson {
  id: string;
  title: string;
  content: string | null;
  order: number;
  course_id: string;
  created_at: string;
  courses: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    price: number;
    image: string | null;
    published: boolean;
    slug: string;
    created_at: string;
  };
}

export interface Material {
  id: number;
  title: string;
  description: string | null;
  type: 'ppt' | 'pdf' | 'video';
  url: string;
  lesson_id: string;
  created_at: string;
  video_type?: 'iframe' | 'html5';
  html5_url?: string | null;
}

export interface LessonNavigation {
  id: string;
  title: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number;
  image: string | null;
  published: boolean;
  slug: string;
  created_at: string;
}
