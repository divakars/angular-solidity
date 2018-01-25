import { Component, OnInit , OnDestroy } from '@angular/core';
import { OrderBookService } from '../../util/orderbook.service';
import { BidbookService } from '../../service/bidbook.service';
import { OrderDetail } from '../../util/orderdetail.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-order-book-list',
  templateUrl: './order-book-list.component.html',
  styleUrls: ['./order-book-list.component.css']
})
export class OrderBookListComponent implements OnInit,OnDestroy {

  orderDetails: OrderDetail[];
  subscription: Subscription;

  constructor(private orderBookService: OrderBookService ) {
     this.subscription = this.orderBookService.getOrderBookObservable().subscribe(orderDetails => { this.orderDetails = orderDetails; });
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();    
  }

}
