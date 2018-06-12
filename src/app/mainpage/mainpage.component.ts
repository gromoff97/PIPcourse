import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  _http: HttpClient;
  stationFrom: string = null;
  stationTo: string = null;
  station_id_dict = [];

  constructor( private gotHttp: HttpClient ) {
    this._http = gotHttp;
  }

  fillLastNewsPost() {
    this._http.get('http://localhost:8080/course/api/news/all', { observe: 'response' })
    .subscribe(data => {
      document.getElementById('lastnewspost').innerHTML = data.body[Object.keys(data.body).length - 1].content;
    });
  }

  fillSelectors() {
    this._http.get('http://localhost:8080/course/api/stations/all', { observe: 'response' })
    .subscribe(data => {
      const station_selectors = document.getElementsByClassName('select-flex');

      const station_selectors_cnt = station_selectors.length;
      const stations_cnt = Object.keys(data.body).length;
      for ( let station_counter = 0; station_counter < stations_cnt; station_counter++ ) {
        this.station_id_dict.push({
          station: data.body[station_counter].name,
          id: data.body[station_counter].id
        });
      }

      for ( let station_selectors_counter = 0; station_selectors_counter < station_selectors_cnt; station_selectors_counter++ ) {
        for (let station_counter = 0; station_counter < stations_cnt; station_counter++) {
          const option = document.createElement('option');
          option.innerHTML = data.body[station_counter].name;
          station_selectors[station_selectors_counter].appendChild(option);
        }
      }

    });
  }

  fillPathResult() {
    const res = document.getElementById('pathres');
    if ( this.stationFrom === this.stationTo ) {
      res.innerHTML = 'Пожалуйста, выберите разные станции';
      return;
    }

    let stationFromId = -1;
    let stationToId = -1;
    Object.keys(this.station_id_dict).forEach(key => {

      if (this.station_id_dict[key].station === this.stationFrom) {
        stationFromId = this.station_id_dict[key].id;
      }

      if (this.station_id_dict[key].station === this.stationTo) {
        stationToId = this.station_id_dict[key].id;
      }
    });

    this._http.get('http://localhost:8080/course/api/path/min/' + stationFromId + '/' + stationToId,
      { observe: 'response' })
    .subscribe(data => {
      const time = Object.values(data.body)[1];
      const min = Math.floor(time / 60);
      const sec = time - min * 60;
      res.innerHTML = 'Время прибытия составляет ' + min + ':' + sec.toString().padStart(2, '0') + ' минут' +
      ';<div>Добраться можно по следующему алгоритму : ' + Object.values(data.body)[0] + '</div>';
      console.log(data);
    });

  }

  ngOnInit() {
    this.fillLastNewsPost();
    this.fillSelectors();
  }

 selectorOneChanged(event) {
   this.stationFrom = event.target.value;
   if ( this.stationTo != null ) {
     this.fillPathResult();
   }
 }

 selectorTwoChanged(event) {
   this.stationTo = event.target.value;
   if ( this.stationFrom != null ) {
     this.fillPathResult();
   }
 }

}
