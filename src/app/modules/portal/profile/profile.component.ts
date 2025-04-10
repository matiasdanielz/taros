import { Component, OnInit } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  protected user: any = {};

  protected profileFields: PoDynamicViewField[] = [];
  protected profileValue: any = {};

  constructor(
    private profileService: ProfileService
  ){
    this.profileFields = profileService.GetProfileFields();
  }

  async ngOnInit(): Promise<void> {
    this.profileValue = await this.profileService.GetSalesmanInfo();
  }
}
