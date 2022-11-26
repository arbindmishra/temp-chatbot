import { Injectable } from '@angular/core';
import { string } from 'joi';

@Injectable({
  providedIn: 'root',
})
export class AllDataService {
  constructor() {}
  ask = [
    'firstName',
    'lastName',
    'email',
    'mobile',
    'communicationMedium',
    'address',
    'city',
    'state',
    'zipcode',
    'dob',
    'gender',
    'socialSecurityNumber',
  ];
  userDataJson: any = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    communicationMedium: '', // like email or mobile
    address: '',
    city: '',
    state: '',
    zipcode: '',
    dob: '', // mm-dd-yyyy
    gender: '',
    socialSecurityNumber: '',
  };

  askData() {
    return this.ask;
  }
  userJSON() {
    return this.userDataJson;
  }
}
