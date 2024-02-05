export interface Favorite {
    id: string,
    user: string,
    study_program: number,
    note: string,
    status: string,
    study_program_name: string,
    school_name: string,
    school_locality: string,
    school_code: string,
}

export interface FavoriteResponse {
    results: Favorite[] | any,
    next: string | null,
    previous: string | null,
    count: number | null,
}