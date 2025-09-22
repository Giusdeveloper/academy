// =============================================================================
// TIPI DATABASE MIGLIORATI
// =============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          email_verified: string | null;
          image: string | null;
          password: string | null;
          role: 'USER' | 'ADMIN';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          email_verified?: string | null;
          image?: string | null;
          password?: string | null;
          role?: 'USER' | 'ADMIN';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          email_verified?: string | null;
          image?: string | null;
          password?: string | null;
          role?: 'USER' | 'ADMIN';
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          image: string | null;
          published: boolean;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          image?: string | null;
          published?: boolean;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          image?: string | null;
          published?: boolean;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          order: number;
          course_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string | null;
          order: number;
          course_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string | null;
          order?: number;
          course_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          lesson_id: string;
          completed: boolean;
          video_watched: boolean;
          quiz_completed: boolean;
          completed_at: string | null;
          video_watched_at: string | null;
          quiz_completed_at: string | null;
          time_spent: number;
          last_accessed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          lesson_id: string;
          completed?: boolean;
          video_watched?: boolean;
          quiz_completed?: boolean;
          completed_at?: string | null;
          video_watched_at?: string | null;
          quiz_completed_at?: string | null;
          time_spent?: number;
          last_accessed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          lesson_id?: string;
          completed?: boolean;
          video_watched?: boolean;
          quiz_completed?: boolean;
          completed_at?: string | null;
          video_watched_at?: string | null;
          quiz_completed_at?: string | null;
          time_spent?: number;
          last_accessed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      lesson_sessions: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          session_start: string;
          session_end: string | null;
          time_spent: number;
          video_time_watched: number;
          status: 'active' | 'completed' | 'abandoned';
          user_agent: string | null;
          ip_address: string | null;
          device_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          session_start?: string;
          session_end?: string | null;
          time_spent?: number;
          video_time_watched?: number;
          status?: 'active' | 'completed' | 'abandoned';
          user_agent?: string | null;
          ip_address?: string | null;
          device_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          course_id?: string;
          session_start?: string;
          session_end?: string | null;
          time_spent?: number;
          video_time_watched?: number;
          status?: 'active' | 'completed' | 'abandoned';
          user_agent?: string | null;
          ip_address?: string | null;
          device_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      video_watch_events: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          session_id: string | null;
          event_type: 'play' | 'pause' | 'seek' | 'ended' | 'time_update' | 'error';
          current_time: number;
          duration: number | null;
          progress_percentage: number | null;
          timestamp: string;
          user_agent: string | null;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          session_id?: string | null;
          event_type: 'play' | 'pause' | 'seek' | 'ended' | 'time_update' | 'error';
          current_time: number;
          duration?: number | null;
          progress_percentage?: number | null;
          timestamp?: string;
          user_agent?: string | null;
          ip_address?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          session_id?: string | null;
          event_type?: 'play' | 'pause' | 'seek' | 'ended' | 'time_update' | 'error';
          current_time?: number;
          duration?: number | null;
          progress_percentage?: number | null;
          timestamp?: string;
          user_agent?: string | null;
          ip_address?: string | null;
        };
      };
      user_course_stats: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          total_time_spent: number;
          total_lessons_completed: number;
          total_quizzes_passed: number;
          total_quizzes_failed: number;
          average_quiz_score: number | null;
          first_access: string;
          last_access: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          total_time_spent?: number;
          total_lessons_completed?: number;
          total_quizzes_passed?: number;
          total_quizzes_failed?: number;
          average_quiz_score?: number | null;
          first_access?: string;
          last_access?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          total_time_spent?: number;
          total_lessons_completed?: number;
          total_quizzes_passed?: number;
          total_quizzes_failed?: number;
          average_quiz_score?: number | null;
          first_access?: string;
          last_access?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          description: string | null;
          questions: any; // JSONB
          passing_score: number;
          max_attempts: number;
          time_limit: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          title: string;
          description?: string | null;
          questions: any; // JSONB
          passing_score?: number;
          max_attempts?: number;
          time_limit?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          title?: string;
          description?: string | null;
          questions?: any; // JSONB
          passing_score?: number;
          max_attempts?: number;
          time_limit?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          lesson_id: string;
          answers: any; // JSONB
          score: number;
          passed: boolean;
          time_spent: number | null;
          started_at: string;
          completed_at: string;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          lesson_id: string;
          answers: any; // JSONB
          score: number;
          passed?: boolean;
          time_spent?: number | null;
          started_at?: string;
          completed_at?: string;
          session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          lesson_id?: string;
          answers?: any; // JSONB
          score?: number;
          passed?: boolean;
          time_spent?: number | null;
          started_at?: string;
          completed_at?: string;
          session_id?: string | null;
          created_at?: string;
        };
      };
      materials: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          type: 'ppt' | 'pdf' | 'video';
          url: string;
          lesson_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          type: 'ppt' | 'pdf' | 'video';
          url: string;
          lesson_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          type?: 'ppt' | 'pdf' | 'video';
          url?: string;
          lesson_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      user_lesson_progress: {
        Row: {
          user_id: string;
          course_id: string;
          lesson_id: string;
          lesson_title: string;
          lesson_order: number;
          course_title: string;
          video_watched: boolean;
          quiz_completed: boolean;
          completed: boolean;
          completed_at: string | null;
          video_watched_at: string | null;
          quiz_completed_at: string | null;
          time_spent: number;
          last_accessed_at: string;
          quiz_id: string | null;
          quiz_title: string | null;
          passing_score: number | null;
          quiz_attempts_count: number;
          best_quiz_score: number | null;
        };
      };
      course_completion_stats: {
        Row: {
          course_id: string;
          course_title: string;
          total_lessons: number;
          lessons_with_progress: number;
          completed_lessons: number;
          enrolled_users: number;
          completed_users: number;
          completion_rate: number | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'USER' | 'ADMIN';
      order_status: 'PENDING' | 'COMPLETED' | 'FAILED';
    };
  };
}

// =============================================================================
// TIPI UTILITY PER L'APPLICAZIONE
// =============================================================================

export type Progress = Database['public']['Tables']['progress']['Row'];
export type ProgressInsert = Database['public']['Tables']['progress']['Insert'];
export type ProgressUpdate = Database['public']['Tables']['progress']['Update'];

export type LessonSession = Database['public']['Tables']['lesson_sessions']['Row'];
export type LessonSessionInsert = Database['public']['Tables']['lesson_sessions']['Insert'];
export type LessonSessionUpdate = Database['public']['Tables']['lesson_sessions']['Update'];

export type VideoWatchEvent = Database['public']['Tables']['video_watch_events']['Row'];
export type VideoWatchEventInsert = Database['public']['Tables']['video_watch_events']['Insert'];

export type UserCourseStats = Database['public']['Tables']['user_course_stats']['Row'];

export type UserLessonProgress = Database['public']['Views']['user_lesson_progress']['Row'];
export type CourseCompletionStats = Database['public']['Views']['course_completion_stats']['Row'];

// =============================================================================
// INTERFACCE PER IL FRONTEND
// =============================================================================

export interface LessonProgressWithDetails {
  lessonId: string;
  lessonTitle: string;
  lessonOrder: number;
  courseId: string;
  courseTitle: string;
  
  // Stato base
  completed: boolean;
  videoWatched: boolean;
  quizCompleted: boolean;
  
  // Timestamp
  completedAt: string | null;
  videoWatchedAt: string | null;
  quizCompletedAt: string | null;
  lastAccessedAt: string;
  
  // Tempo
  timeSpent: number; // in secondi
  
  // Quiz info
  quizId: string | null;
  quizTitle: string | null;
  passingScore: number | null;
  quizAttemptsCount: number;
  bestQuizScore: number | null;
}

export interface SessionTrackingData {
  sessionId: string;
  userId: string;
  lessonId: string;
  courseId: string;
  startTime: string;
  endTime: string | null;
  timeSpent: number;
  videoTimeWatched: number;
  status: 'active' | 'completed' | 'abandoned';
  deviceType: string | null;
}

export interface VideoEventData {
  eventType: 'play' | 'pause' | 'seek' | 'ended' | 'time_update' | 'error';
  currentTime: number;
  duration: number | null;
  progressPercentage: number | null;
  sessionId?: string;
}

export interface CourseStats {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  lessonsWithProgress: number;
  completedLessons: number;
  enrolledUsers: number;
  completedUsers: number;
  completionRate: number | null;
}
