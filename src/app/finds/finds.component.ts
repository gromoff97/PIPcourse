import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-finds',
  templateUrl: './finds.component.html',
  styleUrls: ['./finds.component.scss']
})
export class FindsComponent implements OnInit {

  _http : HttpClient;

  constructor( private gotHttp:HttpClient ) {
  	this._http = gotHttp;
  }

  getNewFindContent( id : number, content:string ) : string
  {
  	return "<div class=\"window\"> <div class=\"name\">Находка №" + id + 
  	"</div><div class=\"content\">"+ content + 
  	"</div></div>"
  }

  ngOnInit() {
  	let data = this._http.get('http://localhost:8080/course/api/lostfound/all',{ observe: 'response' })
  	.subscribe(data=>
  	{
  		let finds = document.getElementById("finds");
  		let newsHtml : string = "";
  		let finds_count : number = Object.keys(data.body).length;

  		for ( let finds_counter : number = 0; finds_counter < finds_count; finds_counter++ ) 
  			newsHtml = this.getNewFindContent(
  				finds_counter + 1,
  				data.body[finds_counter].message
  				) + newsHtml;

  		finds.innerHTML = newsHtml;
  				
  	});
  }

}
