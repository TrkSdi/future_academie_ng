import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../interface/userprofile-interface';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../services/userprofile.service';  // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-userprofiles',
  standalone: true,
  // imports: [CommonModule],
  templateUrl: './userprofiles.component.html',
  styleUrl: './userprofiles.component.css'
})
export class UserProfilesComponent implements OnInit {

  userprofile!: UserProfile;

  constructor(private userprofileService: UserProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadUserProfile();
    console.log(this.userprofile);
  }

  loadUserProfile() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userprofileService.getUserProfile(id).subscribe({
      next: (userprofile: UserProfile) => {
        this.userprofile = userprofile;
        console.log(userprofile);
      }
    });
  }
}
