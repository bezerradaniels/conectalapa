export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    created_at: string;
}

export interface Company {
    id: string;
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    cover_image?: string;
    status: 'pending' | 'active' | 'inactive';
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface Job {
    id: string;
    title: string;
    company_id: string;
    company_name?: string;
    salary?: string;
    description: string;
    requirements: string;
    status: 'pending' | 'active' | 'inactive';
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface TravelPackage {
    id: string;
    destination: string;
    departure_date: string;
    agency: string;
    price: number;
    cover_image?: string;
    description: string;
    status: 'pending' | 'active' | 'inactive';
    user_id: string;
    created_at: string;
    updated_at: string;
}
