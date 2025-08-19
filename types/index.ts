export type Role = "admin" | "cashier" | "waiter" | "kitchen";

export interface AppUser {
  uid: string;
  displayName: string;
  email?: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  index: number;
  active: boolean;
  createdAt: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  createdAt: number;
}

export interface Table {
  id: string;
  name: string;
  seats: number;
  status: "bo'sh" | "band" | "tayyorlanmoqda" | "tozalanmoqda";
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  qty: number;
  price: number;
  notes?: string;
}

export interface Payment {
  id: string;
  type: "cash" | "card" | "later";
  amount: number;
  createdAt: number;
}

export interface Order {
  id: string;
  tableId?: string;
  items: OrderItem[];
  status: "yangi" | "oshxonada" | "tayyor" | "yopilgan";
  createdBy: string;
  assignedTo?: string;
  totals: {
    subtotal: number;
    discount: number;
    service: number;
    tax: number;
    grand: number;
  };
  payments: Payment[];
  createdAt: number;
  closedAt?: number;
}

export interface SyncTask {
  id: string;
  op:
    | { type: "CREATE_ORDER"; payload: Order }
    | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: Order["status"] } }
    | { type: "ADD_PAYMENT"; payload: { orderId: string; payment: Payment } }
    | { type: "UPSERT_MENU"; payload: MenuItem }
    | { type: "UPSERT_TABLE"; payload: Table }
    | { type: "UPSERT_USER"; payload: AppUser };
  createdAt: number;
  retries: number;
}
