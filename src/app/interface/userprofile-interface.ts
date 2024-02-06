
export interface UserProfile {
              
              user_extended: {
                  username: string;
                  first_name: string;
                  last_name: string;
                  email: string;
              },
              user: string,
              image_profile: string;
              url_tiktok: string;
              url_tiktok_extended: {
                  link_type: string;
                  link_url: string;
              },
              url_instagram: string;
              url_instagram_extended: {
                  link_type: string;
                  link_url: string;
              },
              about_me: string;
              is_public: false;
              student_at: string;
}
// export interface School {              
//                   UAI_code: string;

//                   name: string;
//                   address_extended: {
//                       street_address: string;
//                       postcode: null;
//                       locality: string;
//                       geolocation: null;
//                   },
//                   school_type: null;
//               }

// export interface UserProfileResponse {
//               results: UserProfile[] | any;
//               next: string | null;
//               previous: string | null;
//               count: number | null;
//             }