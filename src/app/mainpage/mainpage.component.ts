import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  lastPost: string;
  pathtime: string;
  path: string;

  private firstStation = true;
  private stationsAssoc = {};

  _http: HttpClient;
  stationFrom: string = null;
  stationTo: string = null;
  station_id_dict = [];

  constructor( private gotHttp: HttpClient ) {
    this._http = gotHttp;
  }

  fillLastNewsPost() {
    this.lastPost = 'Подождите...';
    this._http.get(AppComponent.apiUrl + '/news/all', { observe: 'response' })
    .subscribe(data => {
      this.lastPost = data.body[Object.keys(data.body).length - 1].content;
    });
  }

  fillSelectors() {
    this._http.get(AppComponent.apiUrl + '/stations/all', { observe: 'response' })
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
    this.pathtime = 'Подождите...';
    this.path = '';
    if ( this.stationFrom === this.stationTo ) {
      this.pathtime = 'Пожалуйста, выберите разные станции';
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

    this._http.get(AppComponent.apiUrl + '/path/min/' + stationFromId + '/' + stationToId,
      { observe: 'response' })
    .subscribe(data => {
      const time = Object.values(data.body)[1];
      const min = Math.floor(time / 60);
      const sec = time - min * 60;
      this.pathtime = 'Время прибытия составляет ' + min + ':' + sec.toString().padStart(2, '0') + ' минут';
      this.path = 'Добраться можно по следующему алгоритму : ' + Object.values(data.body)[0];
    });

  }

  ngOnInit() {
    this.fillLastNewsPost();
    this.fillSelectors();

    this.stationsAssoc['kirpich'] = 'Кирпичная';
    this.stationsAssoc['mudr'] = 'Страшилы Мудрого';
    this.stationsAssoc['volsheb'] = 'Волшебная';
    this.stationsAssoc['stelly'] = 'Стеллы';
    this.stationsAssoc['ludoed'] = 'Людоедная';
    this.stationsAssoc['lvinaya'] = 'Львиная';
    this.stationsAssoc['gudvina'] = 'Гудвина';
    this.stationsAssoc['krug'] = 'Кругосветная';
    this.stationsAssoc['izumrud'] = 'Изумрудная';
    this.stationsAssoc['ovrazh'] = 'Овражная';
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

  stationClick(event) {
    const targetStation = this.stationsAssoc[event.target.id];
    const station_selectors = <HTMLCollectionOf<HTMLSelectElement>>document.getElementsByClassName('select-flex');
    const selectorLen = station_selectors[0].length;
    let requiredItem: number;
    for (let itemIndex = 0; itemIndex < selectorLen; itemIndex++) {
      if (station_selectors[0].options[itemIndex].text === targetStation) {
        requiredItem = itemIndex;
      }
    }
    if (this.firstStation) {
      this.stationFrom = targetStation;
      station_selectors[0].selectedIndex = requiredItem;
    } else {
      this.stationTo = targetStation;
      station_selectors[1].selectedIndex = requiredItem;
      window.location.hash = '';
      window.location.hash = 'result';
      this.fillPathResult();
    }
    this.firstStation = !this.firstStation;
 }

 addNewsPost() {
   const newPost = <HTMLTextAreaElement>document.getElementById('newPost');
   const content = newPost.value;
   newPost.value = 'Подождите...';
   this._http.post(AppComponent.apiUrl + '/news/add', content, { observe: 'response' })
     .subscribe(data => {
       if (data.body === true) {
         newPost.value = '';
         this.fillLastNewsPost();
       }
     });
 }

}
