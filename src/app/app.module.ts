import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FeedbackmodalComponent } from './feedbackmodal/feedbackmodal.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { AppRoutingModule } from './/app-routing.module';
import { NewsComponent } from './news/news.component';
import { FindsComponent } from './finds/finds.component';
import { ProfileComponent } from './profile/profile.component';


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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
