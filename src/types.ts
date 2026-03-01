export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Link {
  id: number;
  user_id: number;
  slug: string;
  title: string;
  description: string;
  type: 'booking' | 'form' | 'combined';
  flow_mode: 'book_then_form' | 'form_then_book' | 'form_only' | 'booking_only';
  settings: any;
  created_at: string;
}

export interface Availability {
  id: number;
  link_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface FormField {
  label: string;
  name: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'select' | 'radio' | 'checkbox';
  options?: string[];
  required: boolean;
}

export interface Booking {
  id: number;
  link_id: number;
  start_time: string;
  end_time: string;
  user_name: string;
  user_email: string;
  status: string;
}

export interface Submission {
  id: number;
  link_id: number;
  booking_id?: number;
  data: any;
  created_at: string;
  user_name?: string;
  user_email?: string;
  booking_time?: string;
}
