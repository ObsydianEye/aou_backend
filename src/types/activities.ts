export interface ActivityBase {
    action: string;
    description: string;
    performedBy: string;
}

export interface Activity extends ActivityBase {
    id: string; // corresponds to MongoDB _id
    timestamp: string; // ISO date string
}

export interface ActivityResponse {
    activities: Activity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
