export interface ArtistCreate {
    name: string;
    artForm: string;
    bio: string;
    image: string;
    instagram?: string;
    performances?: string[];
    type?: "performer" | "inspiration";
}

export interface ArtistUpdate {
    name?: string;
    artForm?: string;
    bio?: string;
    image?: string;
    instagram?: string;
    performances?: string[];
    type?: "performer" | "inspiration";
}