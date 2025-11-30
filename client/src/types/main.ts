export interface Fandom {
    id: number;
    name: string;
    memberCount: number;
    imageUrl?: string;
}
export interface Game {
    id: number;
    name: string;
    imageUrl?: string;
}
export interface Category {
    id: number;
    name: string;
    icon?: string;
}