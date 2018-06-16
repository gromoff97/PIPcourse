import { Component, OnInit } from '@angular/core';
import {AppComponent, User, Validate} from '../app.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.fillFields();
  }

  private fillFields() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept-API-Version', 'resource=2.1');
    this._http.post(AppComponent.amUrl + '/json/sessions?_action=validate', null,
      {headers: headers, observe: 'response', withCredentials: true})
      .subscribe(validate => {
        const result = <Validate>validate.body;
        if (result.valid) {
          const user = result.uid;
          this._http.get(AppComponent.amUrl + '/json/users/' + user,
            {headers: headers, observe: 'response', withCredentials: true})
            .subscribe(users => {
              const userinfo = <User>users.body;
              if (userinfo.mail) {
                (<HTMLInputElement>document.getElementById('email')).value = userinfo.mail[0];
                console.log('mail');
              }
              if (userinfo.sn) {
                (<HTMLInputElement>document.getElementById('FIO')).value = userinfo.sn[0];
                console.log('sn');
              }
              if (userinfo.givenName) {
                (<HTMLInputElement>document.getElementById('FIO')).value += ' ' + userinfo.givenName[0];
                console.log('name');
              }
            });
        }
      });
  }

}
