export interface FitData {
  verdict?: string;
  score?: number | null;
  rationale?: string;
}

export interface AttributeItem {
  attribute_name?: string;
  attribute_description?: string;
}

export interface WhyNowItem {
  title?: string;
  date?: string;
  abstract?: string;
  body?: string;
  url?: string;
  importance?: string;
}

export interface Contact {
  name?: string;
  name_initials?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  role?: string;
  best_angle?: string;
}

export interface Activity {
  date?: string;
  summary?: string;
  detail?: string;
}

export interface FreetextItem {
  heading?: string;
  body?: string;
}

export interface NotesPayload {
  fit?: FitData;
  freetext_after_fit?: FreetextItem[];
  why_it_fits?: AttributeItem[];
  fit_gaps?: AttributeItem[];
  freetext_after_why_it_fits?: FreetextItem[];
  why_now?: WhyNowItem[];
  freetext_after_why_now?: FreetextItem[];
  who_to_reach_out_to?: Contact[];
  last_activities?: Activity[];
  freetext_after_contacts?: FreetextItem[];
  freetext_before_next_steps?: FreetextItem[];
  next_steps?: Record<string, string>;
}
