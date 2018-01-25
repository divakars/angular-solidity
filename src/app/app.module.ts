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
import { OrderBookListComponent } from './order-book/order-book-list/order-book-list.component';
import { OrderBookService } from './util/orderbook.service';
import { ExchangeInfoService } from './service/exchange-info-service.service';
import { EventInfoService } from './service/event-info-service.service';
import { ExchangeInteractionService } from './service/exchange-interaction-service.service';
import { TransactionStatusService } from './service/transaction-status.service';
import { BidbookService } from './service/bidbook.service';
import { BidListComponent } from './order-book/bid-list/bid-list.component';

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
    ContractEventComponent,
    OrderBookListComponent,
    BidListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MetaModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [OrderBookService, ExchangeInfoService, EventInfoService, ExchangeInteractionService, TransactionStatusService, BidbookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
