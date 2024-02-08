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
  userprofile!: UserProfile;
  aboutMeText: string = '';
  editingMode: boolean = false; 

  constructor(private userprofileService: UserProfileService) { }

  ngOnInit() {
    this.loadUserProfile();   
  }

  loadUserProfile() {
    this.userprofileService.getUserProfile().subscribe({
      next: (userprofile: UserProfile) => {
        this.userprofile = userprofile;
        this.aboutMeText = userprofile.about_me || '';
        console.log('User Profile Data:', userprofile);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
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

  saveAboutMe() {
    this.userprofile.about_me = this.aboutMeText;
    this.userprofileService.updateUserProfile(this.userprofile).subscribe({
      next: (results) => {
        console.log('User profile updated successfully', results);
        this.editingMode = false; 
      },
      error: (error) => {
        console.error('Error updating user profile:', error);
        
        this.editingMode = true;
      }
    });
  }
}