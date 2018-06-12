import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-finds',
  templateUrl: './finds.component.html',
  styleUrls: ['./finds.component.scss']
})
export class FindsComponent implements OnInit {

  _http: HttpClient;

  constructor( private gotHttp: HttpClient ) {
    this._http = gotHttp;
  }

  getNewFindContent( id: number, content: string ): string {
    return '<div class="window"> <div class="name">Находка №' + id + '</div><div class="content">' + content + '</div></div>';
  }

  ngOnInit() {
    this._http.get('http://localhost:8080/course/api/lostfound/all', { observe: 'response' })
      .subscribe(data => {
        const finds = document.getElementById('finds');
        const finds_count: number = Object.keys(data.body).length;
        let newsHtml = '';
        for ( let finds_counter = 0; finds_counter < finds_count; finds_counter++ ) {
          newsHtml = this.getNewFindContent(finds_counter + 1, data.body[finds_counter].message) + newsHtml;
        }
        finds.innerHTML = newsHtml;
      });
  }

}
