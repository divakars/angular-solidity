import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import {MetaModule} from './meta/meta.module';
import { HeaderComponent } from './header/header.component';
import { ManageTokenComponent } from './manage-token/manage-token.component';
import { OrderBookComponent } from './order-book/order-book.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ContractEventComponent } from './contract-event/contract-event.component';

const appRoutes : Routes = [
   {path:'',component:HomePageComponent},
   {path:'trading',component:OrderBookComponent},
   {path:'managetoken',component:ManageTokenComponent},
   {path:'exchangeOverview',component:HomePageComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ManageTokenComponent,
    OrderBookComponent,
    HomePageComponent,
    ContractEventComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MetaModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
