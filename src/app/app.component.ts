import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
  _http: HttpClient;
  _stompService: StompService;

  constructor( private gotHttp: HttpClient, private gotStompService: StompService ) {
    this._http = gotHttp;
    this._stompService = gotStompService;
  }

  ngOnInit() {
    this._http.get(AppComponent.apiUrl + '/queue/new', { observe: 'response', responseType: 'text'})
      .subscribe(data => {
        const queueName: string = data.body;
               const stomp_subscription = this._stompService
                 .subscribe(queueName, {'durable': false, 'auto-delete': true, 'exclusive': false})
                 .subscribe((msg: Message) => {
                   console.log(`Received: ${msg.body}`);
                 });
      });
  }
}
