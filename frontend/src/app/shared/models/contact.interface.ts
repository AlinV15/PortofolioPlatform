export interface ContactInfo {
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

// Main ContactLocation interface
export interface ContactLocation {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates: Coordinates;
    timezone: string;
    workingHours: string;
}