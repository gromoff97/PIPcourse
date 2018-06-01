import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainpageComponent } from './mainpage/mainpage.component';
import { NewsComponent } from './news/news.component';
import { FindsComponent } from './finds/finds.component';
import { ProfileComponent } from './profile/profile.component';


const routes : Routes = [
	{
		path: '',
		component: MainpageComponent
	},
	{
		path: 'home',
		component: MainpageComponent
	},
	{
		path: 'news',
		component: NewsComponent
	},
	{
		path: 'finds',
		component: FindsComponent
	},
	{
		path: 'profile',
		component: ProfileComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }