import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  _http : HttpClient;

  constructor( private gotHttp:HttpClient ) {
  	this._http = gotHttp;
  }

  ngOnInit() {
  	let data = this._http.get('http://localhost:8080/course/api/news/all',{ observe: 'response' })
  	.subscribe(data=>
  	{
  		document.getElementById("lastnewspost").innerHTML = data.body[Object.keys(data.body).length - 1].content;		
  	});
  }

}
