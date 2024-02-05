export interface Address {
  street_address: string;
  postcode: number;
  locality: string;
  geolocation: string;
}

export interface SchoolExtended {
  UAI_code: string;
  name: string;
  address: number;
  address_extended: Address;
  school_type: string;
}

export interface StudyProgram {
  cod_aff_form: number;
  name: string;
  school: string;
  school_extended?: SchoolExtended;
  url: string;
  acceptance_rate: number;
  L1_succes_rate: number;
  description: string;
  diploma_earned_ontime: number;
  available_places: number;
  number_applicants: number;
  percent_scholarship: number;
  acceptance_rate_quartile: string;
  L1_success_rate_quartile: string;
  diploma_earned_ontime_quartile: string;
  percent_scholarship_quartile: string;
  job_prospects: string;
  geolocation?: string;
}

export interface StudyResponse {
  results: StudyProgram[] | any;
  next: string | null;
  previous: string | null;
  count: number | null;
}
