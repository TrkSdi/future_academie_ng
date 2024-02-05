export interface School {
    UAI_code: string;
    name: string;
    url: string;
    description: string;
    address: {
        street_address: string;
        postcode: number;
        locality: string;
    }
    school_type: string;
}