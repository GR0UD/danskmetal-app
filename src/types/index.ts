import type { ReactNode } from "react";

// Sandwich types
export interface Sandwich {
  id: number;
  name: string;
  description: string;
  image: string;
  hasImage: boolean;
  url: string;
  noBreadDressing?: boolean;
  customIcon?: ReactNode;
}

export interface BreadOption {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface DressingOption {
  id: string;
  name: string;
  icon: ReactNode;
}

// Session/Order types
export interface Order {
  sandwich: string;
  bread?: string;
  dressing?: string;
  customer?: string;
  image?: string;
  url?: string;
  createdAt: string;
}

export interface Session {
  _id: string;
  code: string;
  status: "active" | "closed";
  orders: Order[];
  createdAt: string;
}

export interface GroupedOrder {
  sandwich: string;
  bread?: string;
  dressing?: string;
  image?: string;
  url?: string;
  count: number;
  customers: string[];
}
