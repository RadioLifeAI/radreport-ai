// Stub DataService for compatibility
// Most functionality moved to SupabaseService

export interface Macro {
  id: string;
  titulo: string;
  frase: string;
  categoria?: string;
  ativo?: boolean;
}

class DataService {
  async getMacros(): Promise<Macro[]> {
    // Fallback stub - use SupabaseService instead
    return [];
  }

  async searchMacros(searchTerm: string): Promise<Macro[]> {
    // Fallback stub - use SupabaseService instead
    return [];
  }
}

export const dataService = new DataService();
