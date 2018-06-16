import {Component, OnInit} from '@angular/core';
import {AppComponent, User, Validate} from '../app.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  message = '';

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
              }
              if (userinfo.sn) {
                (<HTMLInputElement>document.getElementById('FIO')).value = userinfo.sn[0];
              }
              if (userinfo.givenName) {
                (<HTMLInputElement>document.getElementById('FIO')).value += ' ' + userinfo.givenName[0];
              }
            });
        }
      });
  }

  apply() {
    this.message = '';
    let userContent: string;
    let passwordContent: string;
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const fio = (<HTMLInputElement>document.getElementById('FIO')).value;
    const newPasswd = (<HTMLInputElement>document.getElementById('newPasswd')).value;
    const repeatPasswd = (<HTMLInputElement>document.getElementById('repeatPasswd')).value;
    if (fio.length === 0) {
      this.message = 'Поле ФИО не должно быть пустым';
    } else {
      const user: User = new User();
      const words = fio.split(' ');
      user.sn.push(words[0]);
      if (words.length > 1) {
        user.givenName.push('');
        for (let i = 1; i < words.length; i++) {
          user.givenName[0] += ' ' + words[i];
        }
        user.givenName[0] = user.givenName[0].substr(1);
      }
      if (email.length) {
        user.mail.push(email);
      }
      userContent = JSON.stringify(user, ['mail', 'sn', 'givenName']);
    }
    if (newPasswd.length || repeatPasswd.length) {
      if ((newPasswd.length < 8) || (repeatPasswd.length < 8)) {
        this.message = 'Пароль должен состоять минимум из 8 символов';
      } else if (newPasswd !== repeatPasswd) {
        this.message = 'Пароли не совпадают';
      } else {
        const oldPasswd = prompt('Введите текущий пароль');
        if (oldPasswd === null) {
          return;
        }
        const password: Password = new Password();
        password.userpassword = newPasswd;
        password.currentpassword = oldPasswd;
        passwordContent = JSON.stringify(password);
      }
    }
    if (this.message === '') {
      this.sendUserInfo(userContent);
      this.sendPassword(passwordContent);
    }
  }

  private sendUserInfo(content: string) {
    this.message = 'Подождите...';
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept-API-Version', 'resource=2.1,protocol=1.0');
    headers = headers.append('Content-Type', 'application/json');
    this._http.post(AppComponent.amUrl + '/json/sessions?_action=validate', null,
      {headers: headers, observe: 'response', withCredentials: true})
      .subscribe(validate => {
        const result = <Validate>validate.body;
        if (result.valid) {
          const user = result.uid;
          this._http.put(AppComponent.amUrl + '/json/users/' + user, content,
            {headers: headers, observe: 'response', withCredentials: true})
            .catch(err => Observable.throw(alert('Ошибка')))
            .subscribe(users => {
                this.message = '';
            });
        }
      });
  }

  private sendPassword(content: string) {
    this.message = 'Подождите...';
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept-API-Version', 'resource=2.1');
    headers = headers.append('Content-Type', 'application/json');
    this._http.post(AppComponent.amUrl + '/json/sessions?_action=validate', null,
      {headers: headers, observe: 'response', withCredentials: true})
      .subscribe(validate => {
        const result = <Validate>validate.body;
        if (result.valid) {
          const user = result.uid;
          this._http.post(AppComponent.amUrl + '/json/users/' + user + '?_action=changePassword', content,
            {headers: headers, observe: 'response', withCredentials: true})
            .catch(err => Observable.throw(alert('Неверный пароль')))
            .subscribe(users => {
                this.message = '';
            });
        }
      });
  }
}

class Password {
  currentpassword: string;
  userpassword: string;
}
