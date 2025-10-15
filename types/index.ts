export type MediaType = "video" | "photo";

export interface MediaItem {
  id: string;
  uri: string;
  type: MediaType;
  timestamp: number;
  duration?: number;
  thumbnail?: string;
  storage_path?: string; // Supabase Storage path
  public_url?: string; // Public URL from Supabase
  uploaded_at?: string;
}

export interface Project {
  id: string;
  name: string;
  date_range_start: string;
  date_range_end: string;
  clips: MediaItem[];
  soundtrack?: string;
  narration?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  thumbnail_url?: string;
}

export interface UserSettings {
  user_id: string;
  notifications_enabled: boolean;
  auto_backup: boolean;
  daily_reminder_time: string;
  theme: "light" | "dark";
  created_at: string;
  updated_at: string;
}
