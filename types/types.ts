// Definições claras e reutilizáveis
export interface User {
  id?: string;
  email?: string;
  username?: string;
  features?: string[];
  password?: string;
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
  deck_id?: string;
  deck_name?: string;
}

export interface ActivationToken {
  id: string;
}

export interface Resource {
  id: string;
}
