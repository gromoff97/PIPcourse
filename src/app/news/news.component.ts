import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    this._http.get('http://localhost:8080/course/api/news/all', { observe: 'response' })
      .subscribe(data => {
        const news = document.getElementById('news');
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
