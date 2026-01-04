export interface Fandom {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
}

export interface FandomPreview {
    id: number;
    name: string;
    imageUrl?: string;
    
}

export interface FandomContextData {
  fandomId: number;
  fandomName: string;
}