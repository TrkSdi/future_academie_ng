import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../interface/userprofile-interface';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../services/userprofile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-userprofiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userprofiles.component.html',
  styleUrl: './userprofiles.component.css'
})

export class UserProfilesComponent implements OnInit {
  userprofile: UserProfile = {} as UserProfile;
  originalUserProfile: UserProfile = {} as UserProfile;
  editingMode: boolean = false;
  editingProfile: boolean = false;
  editingUrls: boolean = false;
  isProfilePublic: boolean = false;

  constructor(private userprofileService: UserProfileService) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userprofileService.getUserProfile().subscribe({
      next: (userprofile: UserProfile) => {
        this.userprofile = { ...userprofile };
        this.originalUserProfile = { ...userprofile };
        this.isProfilePublic = this.userprofile.is_public
        console.log('User Profile Data:', userprofile);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  toggleEditingMode() {
    this.editingMode = !this.editingMode;
    
    if (!this.editingMode) {
      this.userprofile = { ...this.originalUserProfile };
    }
  }

  toggleEditingProfile() {
    this.editingProfile = !this.editingProfile;
    this.editingMode = this.editingProfile;
    this.editingUrls = false; 
  }
  
  toggleEditingUrls() {
    this.editingUrls = !this.editingUrls;
    this.editingMode = this.editingUrls;
    this.editingProfile = false;
  }


  saveUserProfile() {
    this.userprofileService.updateUserProfile(this.userprofile).subscribe({
      next: (results) => {
        console.log('User profile updated successfully', results);
        this.editingMode = false;
        this.originalUserProfile = { ...this.userprofile };
      },
      error: (error) => {
        console.error('Error updating user profile:', error);
        this.editingMode = true;
      }
    });
  }

  saveUrls() {
    
    console.log('URLs enregistrées :', this.userprofile.url_tiktok, this.userprofile.url_instagram);
  }


  updateProfileVisibility() {
    const userId = 1; 
    this.userprofileService.updateProfileVisibility(this.isProfilePublic, userId)
      .subscribe(
        () => console.log('Profile visibility updated successfully.'),
        error => console.error('Error updating profile visibility:', error)
      );
  }
}