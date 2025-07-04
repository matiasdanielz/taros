import { Component, OnInit } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';
import { User } from 'src/app/models/user/user';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  protected user: any = {};

  protected profileFields: PoDynamicViewField[] = [];
  protected profileValue: User = {};

  constructor(
    private profileService: ProfileService
  ){
    this.profileFields = profileService.GetProfileFields();
  }

  async ngOnInit(): Promise<void> {
    this.profileValue = await this.profileService.GetSalesmanInfo();
  }
}
