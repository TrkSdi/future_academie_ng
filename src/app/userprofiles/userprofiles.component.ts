import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../interface/userprofile-interface';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../services/userprofile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


@Component({
  selector: 'app-userprofiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // imports: [CommonModule, FormsModule, NgModule],
  templateUrl: './userprofiles.component.html',
  styleUrl: './userprofiles.component.css'
})
// export class UserProfilesComponent implements OnInit {

//   userprofile!: UserProfile;
//   aboutMeText: string = '';

//   constructor(private userprofileService: UserProfileService, private route: ActivatedRoute) { }

//   ngOnInit() {
//     this.loadUserProfile();
//   }

//   loadUserProfile() {
//     this.userprofileService.getUserProfile().subscribe({
//       next: (userprofile: UserProfile) => {
//         this.userprofile = userprofile;
//         this.aboutMeText = userprofile.about_me || '';
//         console.log('User Profile Data:', userprofile); 
//       },
//       error: (error) => {
//         console.error('Error fetching user profile:', error);
//       }
//     });
//   }

//   updateAboutMe() {
//     this.userprofile.about_me = this.aboutMeText;
//     this.userprofileService.updateUserProfile(this.userprofile).subscribe({
//       next: () => {
//         console.log('User profile updated successfully');
//       },
//       error: (error) => {
//         console.error('Error updating user profile:', error);
//       }
//     });
//   }

  
//   updateAboutMeText(event: any) {
//     this.aboutMeText = event.target.value;
//   }
// }



export class UserProfilesComponent implements OnInit {

  userprofile!: UserProfile;
  aboutMeText: string = '';
  editingMode: boolean = false; 

  constructor(private userprofileService: UserProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadUserProfile();
    
  }

  loadUserProfile() {
    this.userprofileService.getUserProfile().subscribe({
      next: (userprofile: UserProfile) => {
        this.userprofile = userprofile;
        this.aboutMeText = userprofile.about_me || '';
        console.log('User Profile Data:', userprofile);
        this.updateAboutMe(); 
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  updateAboutMe() {
    this.userprofile.about_me = "string";
    this.userprofileService.updateUserProfile(this.userprofile).subscribe({
      next: (results) => {
        console.log('User profile updated successfully', results);
      },
      error: (error) => {
        console.error('Error updating user profile:', error);
      }
    });
  }

  toggleEditingMode() {
    this.editingMode = true;
  }

  cancelEditing() {
    this.editingMode = false;
    this.aboutMeText = this.userprofile.about_me || '';
  }
}
