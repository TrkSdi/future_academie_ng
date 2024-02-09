
export interface UserProfile {


  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;

  image_profile: string | null;
  url_tiktok: string | any;

  url_instagram: string | any;
  about_me: string | null;
  is_public: boolean;
  student_at: string | null;
  id: string;
  
}


export interface UserProfileResponse {
  results: UserProfile | any;
}            