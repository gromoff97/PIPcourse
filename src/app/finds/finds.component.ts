import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-finds',
  templateUrl: './finds.component.html',
  styleUrls: ['./finds.component.scss']
})
export class FindsComponent implements OnInit {

  lastNewsPost: string;

  _http: HttpClient;

  constructor( private gotHttp: HttpClient ) {
    this._http = gotHttp;
  }

  private static getNewFindContent( id: number, date: string, content: string ): string {
    return '<div class="window"> <div class="name">Находка №' + id + ' (' + date + ')</div><div class="content">' +
      content + '</div></div>';
  }

  fillLastNewsPost() {
    this.lastNewsPost = 'Подождите...';
    this._http.get(AppComponent.apiUrl + '/news/all', { observe: 'response' })
      .subscribe(data => {
        this.lastNewsPost = data.body[Object.keys(data.body).length - 1].content;
      });
  }

  fillFinds() {
    const finds = document.getElementById('finds');
    finds.innerHTML = 'Подождите...';
    this._http.get(AppComponent.apiUrl + '/lostfound/all', { observe: 'response' })
      .subscribe(data => {
        const finds_count: number = Object.keys(data.body).length;
        let newsHtml = '';
        for ( let finds_counter = 0; finds_counter < finds_count; finds_counter++ ) {
          const post = data.body[finds_counter];
          newsHtml = FindsComponent.getNewFindContent(finds_counter + 1, post.pubDate, post.message) + newsHtml;
        }
        finds.innerHTML = newsHtml;
      });
  }

  ngOnInit() {
    this.fillFinds();
    this.fillLastNewsPost();
  }

  addLostFound() {
    const newLostFound = <HTMLTextAreaElement>document.getElementById('newLostFound');
    const content = newLostFound.value;
    newLostFound.value = 'Подождите...';
    this._http.post(AppComponent.apiUrl + '/lostfound/add', content, { observe: 'response' })
      .subscribe(data => {
        if (data.body === true) {
          newLostFound.value = '';
          this.fillFinds();
        }
      });
  }
}
