// Definições claras e reutilizáveis
export interface User {
  id?: string;
  email?: string;
  username?: string;
  features?: string[];
  password?: string;
  token_id?: string;
}

export interface Token {
  user_id?: string;
  used_at?: Date | string;
  expires_at?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface Deck {
  id?: string;
  name?: string;
  user_id?: string;
}

export interface Card {
  id?: string;
  name?: string;
  description?: string;
  date_to_review?: Date | string;
  published_at?: Date | string | null;
  important?: boolean;
  box?: string;
  deck_id?: string;
  deck_name?: string;
}

export interface TypeError {
  name: string;
  message: string;
  action: string;
  status_code: number;
}

export interface ActivationToken {
  id: string;
}

export interface Resource {
  id: string;
}
