import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  _http: HttpClient;
  constructor( private gotHttp: HttpClient ) {
    this._http = gotHttp;
  }

  private static getNewPostContent( id: number, date: string, content: string): string {
    return '<div class="window"><div class="name">Новость ' + id + ' (' + date + ')</div><div class="content">' + content + '</div></div>';
  }


  ngOnInit() {
    const news = document.getElementById('news');
    news.innerHTML = 'Подождите...';
    this._http.get(AppComponent.apiUrl + '/news/all', { observe: 'response' })
      .subscribe(data => {
        let newsHtml = '';
        const news_count: number = Object.keys(data.body).length;
        for ( let news_counter = 0; news_counter < news_count; news_counter++ ) {
          const post = data.body[news_counter];
          newsHtml = NewsComponent.getNewPostContent(news_counter + 1, post.pubDate, post.content) + newsHtml;
        }
        news.innerHTML = newsHtml;
      });
  }

}
