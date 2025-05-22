export interface GoogleCalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  allDay: boolean;
  recurringEventId?: string;
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  dueDate?: Date;
  completed: boolean;
  status: 'needsAction' | 'completed';
}

export interface GoogleCalendarData {
  events: GoogleCalendarEvent[];
  tasks: GoogleTask[];
  lastSync: Date;
}

export interface GoogleAuthConfig {
  clientId: string;
  apiKey: string;
  scope: string[];
  discoveryDocs: string[];
}

export interface GoogleAuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: Error | null;
  user: {
    email: string;
    name: string;
    picture: string;
  } | null;
}

export interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export type CalendarSyncStatus = 'idle' | 'syncing' | 'error' | 'success';

export interface CalendarSettings {
  syncEnabled: boolean;
  selectedCalendars: string[];
  syncInterval: number; // in minutes
  showTasks: boolean;
}

export interface ErrorResponse {
  code: number;
  message: string;
  status: string;
}

export type CalendarViewMode = 'default' | 'google';
