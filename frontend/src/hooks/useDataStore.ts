import { create } from 'zustand';

// Hook simplificado temporariamente para focar no CSS
export const useDataStore = create(() => ({
  // Dados mockados básicos
  empresas: [],
  users: [],
  ativos: [],
  unidades: [],
  ordensServico: [],
  treinamentos: [],
  certificados: [],
  
  // Funções básicas
  addItem: (type: string, item: any) => {
    console.log(`Adding ${type} item:`, item);
  },
  updateItem: (type: string, id: string, updates: any) => {
    console.log(`Updating ${type} item ${id}:`, updates);
  },
  removeItem: (type: string, id: string) => {
    console.log(`Removing ${type} item ${id}`);
  },
  clearData: (type: string) => {
    console.log(`Clearing ${type} data`);
  },
}));
