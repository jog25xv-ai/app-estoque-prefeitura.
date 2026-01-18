
export enum UserRole {
  ADMIN = 'Admin',
  ALMOXARIFE = 'Almoxarife',
  VISUALIZADOR = 'Visualizador'
}

export type ThemeType = 'blue' | 'emerald' | 'purple' | 'slate' | 'orange';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type MaterialType = 'Toner' | 'Tinta';
export type DocType = 'Ofício' | 'Memorando' | 'Processo Administrativo' | 'Outro';

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  brand: string;
  model: string;
  currentQty: number;
  minQty: number;
  lastUpdated: string;
}

export interface Secretariat {
  id: string;
  name: string;
}

export interface Sector {
  id: string;
  name: string;
  secretariatId: string;
}

export interface Printer {
  id: string;
  serialNumber: string;
  patrimony: string;
  model: string;
  sectorId: string;
}

export interface Transaction {
  id: string;
  materialId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  userId: string;
  destinationSecretariatId?: string;
  destinationSectorId?: string;
  printerId?: string;
  requestDocType?: DocType;
  requestDocNumber?: string;
  requestDate?: string;
  exitDate?: string;
  invoiceNumber?: string;
  supplier?: string;
  observations?: string;
}

export interface AppSettings {
  minQtyAlert: number;
  theme: ThemeType;
  emailNotifications: boolean;
}

export interface AppState {
  user: User | null;
  materials: Material[];
  transactions: Transaction[];
  secretariats: Secretariat[];
  sectors: Sector[];
  printers: Printer[];
  settings: AppSettings;
}
