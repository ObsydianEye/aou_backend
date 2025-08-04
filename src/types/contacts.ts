export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
    createdAt?: string; // ISO string
}

export interface ContactSubmissionResponse extends ContactSubmission {
    id: string;
}
