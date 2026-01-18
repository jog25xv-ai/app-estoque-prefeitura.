
import { Material, Secretariat, Sector, Printer, User, UserRole, Transaction } from './types.ts';

export const INITIAL_MATERIALS: Material[] = [
  { id: 'm1', name: 'Toner HP CE285A', type: 'Toner', brand: 'HP', model: '85A', currentQty: 15, minQty: 5, lastUpdated: '2023-10-25T10:00:00Z' },
  { id: 'm2', name: 'Tinta Epson T544 Preta', type: 'Tinta', brand: 'Epson', model: 'L3150', currentQty: 3, minQty: 10, lastUpdated: '2023-10-24T14:30:00Z' },
  { id: 'm3', name: 'Toner Brother TN-660', type: 'Toner', brand: 'Brother', model: 'TN660', currentQty: 25, minQty: 8, lastUpdated: '2023-10-20T09:00:00Z' },
  { id: 'm4', name: 'Toner Samsung MLT-D111S', type: 'Toner', brand: 'Samsung', model: 'D111', currentQty: 2, minQty: 5, lastUpdated: '2023-10-22T16:15:00Z' },
];

export const INITIAL_SECRETARIATS: Secretariat[] = [
  { id: 'sec1', name: 'Secretaria da Saúde' },
  { id: 'sec2', name: 'Secretaria da Educação' },
  { id: 'sec3', name: 'Secretaria de Finanças' },
  { id: 'sec4', name: 'Gabinete do Prefeito' },
];

export const INITIAL_SECTORS: Sector[] = [
  { id: 'set1', name: 'Posto de Saúde Central', secretariatId: 'sec1' },
  { id: 'set2', name: 'UPA 24h', secretariatId: 'sec1' },
  { id: 'set3', name: 'Escola Municipal Juscelino', secretariatId: 'sec2' },
  { id: 'set4', name: 'Departamento de Contabilidade', secretariatId: 'sec3' },
];

export const INITIAL_PRINTERS: Printer[] = [
  { id: 'p1', serialNumber: 'HPX00192', patrimony: '123456', model: 'LaserJet P1102', sectorId: 'set1' },
  { id: 'p2', serialNumber: 'BRT99283', patrimony: '654321', model: 'HL-L2320D', sectorId: 'set3' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { 
    id: 'TX-0001', 
    materialId: 'm1', 
    type: 'OUT', 
    quantity: 2, 
    date: '2023-10-25T10:00:00Z', 
    userId: 'u1', 
    destinationSecretariatId: 'sec1', 
    destinationSectorId: 'set1', 
    printerId: 'p1',
    requestDocType: 'Ofício',
    requestDocNumber: '015/2023-SESAU',
    requestDate: '2023-10-24',
    exitDate: '2023-10-25'
  },
  { 
    id: 'TX-0002', 
    materialId: 'm2', 
    type: 'IN', 
    quantity: 50, 
    date: '2023-10-20T14:30:00Z', 
    userId: 'u1', 
    invoiceNumber: 'NF-10293', 
    supplier: 'Kalunga SA' 
  },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'João Almoxarife',
  email: 'joao.silva@prefeitura.gov.br',
  role: UserRole.ALMOXARIFE
};
