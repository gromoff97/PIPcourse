import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FeedbackmodalComponent } from './feedbackmodal/feedbackmodal.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { AppRoutingModule } from './/app-routing.module';
import { NewsComponent } from './news/news.component';
import { FindsComponent } from './finds/finds.component';
import { ProfileComponent } from './profile/profile.component';

import { HttpClientModule } from '@angular/common/http';

import {StompConfig, StompService} from '@stomp/ng2-stompjs';

const stompConfig: StompConfig = {
  url: 'ws://127.0.0.1:15674/ws',
  headers: {
    login: 'guest',
    passcode: 'guest'
  },
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: false
};

@NgModule({
  declarations: [
    AppComponent,
    FeedbackmodalComponent,
    MainpageComponent,
    NewsComponent,
    FindsComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
