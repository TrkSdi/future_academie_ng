import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../interface/userprofile-interface';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../services/userprofile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userprofiles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userprofiles.component.html',
  styleUrl: './userprofiles.component.css'
})
export class UserProfilesComponent implements OnInit {

  userprofile!: UserProfile;

  constructor(private userprofileService: UserProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadUserProfile();
    console.log();
  }

  loadUserProfile() {
    this.userprofileService.getUserProfile().subscribe({
      next: (userprofile: UserProfile) => {
        this.userprofile = userprofile;
        console.log('User Profile Data:', userprofile); 
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
      
    });
    
  }
}
