import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  static apiUrl = 'http://localhost:8080/course/api';
  static amUrl = 'http://localhost:9090/openam';
  static loggedIn = false;
  static privileged = false;
  username: string;

  private timer;
  _http: HttpClient;
  _stompService: StompService;

  notification: string;

  constructor( private gotHttp: HttpClient, private gotStompService: StompService ) {
    this._http = gotHttp;
    this._stompService = gotStompService;
  }

  private subscribe() {
    this._http.get(AppComponent.apiUrl + '/queue/new', { observe: 'response', responseType: 'text'})
      .subscribe(data => {
        const queueName: string = data.body;
        this._stompService
          .subscribe(queueName, {'durable': false, 'auto-delete': true, 'exclusive': false})
          .subscribe((msg: Message) => {
            this.notification = msg.body;
            document.getElementById('notification').hidden = false;
            clearTimeout(this.timer);
            this.timer = setTimeout(this.notifClose, 5000);
          });
      });
  }

  private checkLogin() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept-API-Version', 'resource=2.1');
    this._http.post(AppComponent.amUrl + '/json/sessions?_action=validate', null,
      {headers: headers, observe: 'response', withCredentials: true})
      .subscribe(validate => {
        const result = <Validate>validate.body;
        AppComponent.loggedIn = result.valid;
        if (AppComponent.loggedIn) {
          const user = result.uid;
          this._http.get(AppComponent.amUrl + '/json/users/' + user,
            {headers: headers, observe: 'response', withCredentials: true})
            .subscribe(users => {
              const userinfo = <User>users.body;
              this.username = userinfo.cn[0];
              document.getElementById('lk').hidden = false;
              document.getElementById('logout').hidden = false;
              document.getElementById('login').hidden = true;
              document.getElementById('register').hidden = true;
            });
        }
      });
  }

  ngOnInit() {
    this.checkLogin();
    this.subscribe();
  }

  notifClose() {
    document.getElementById('notification').hidden = true;
  }

  logout() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept-API-Version', 'resource=2.1');
    this._http.post(AppComponent.amUrl + '/json/sessions?_action=logout', null,
      {headers: headers, observe: 'response', withCredentials: true})
      .subscribe(() => {
        window.location.reload();
      });
  }

  login() {
    window.location.href = AppComponent.amUrl + '/XUI' + '?goto=' + window.location.href;
  }

  register() {
    window.location.href = AppComponent.amUrl + '/XUI' + '?goto=' + window.location.href + '#register/';
  }
}

class Validate {
  valid: boolean;
  uid: string;
}

class User {
  username: string;
  mail: string[];
  cn: string[];
  givenName: string[];
  sn: string[];
}
