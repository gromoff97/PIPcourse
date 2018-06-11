import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

	_http : HttpClient;
	
  constructor( private gotHttp:HttpClient ){
  	this._http = gotHttp;
  }

  getNewPostContent( id:number ,content:string) : string
  {
  	return "<div class=\"window\"><div class=\"name\">Новость " + id + "</div><div class=\"content\">"
  	+ content + "</div></div>";
  }


  ngOnInit() {
  		let data = this._http.get('http://localhost:8080/course/api/news/all',{ observe: 'response' })
  		.subscribe(data=>
  		{
  			let news = document.getElementById("news");
  			let newsHtml : string = "";
  			let news_count : number = Object.keys(data.body).length;

  			for ( let news_counter : number = 0; news_counter < news_count; news_counter++ ) 
  				newsHtml = this.getNewPostContent(
  					news_counter + 1,
  					data.body[news_counter].content
  					) + newsHtml;

  			news.innerHTML = newsHtml;
  				
  		});
  }

}
