import { Component, OnInit , OnDestroy } from '@angular/core';
import { BidbookService } from '../../service/bidbook.service';
import { OrderDetail } from '../../util/orderdetail.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-bid-list',
  templateUrl: './bid-list.component.html',
  styleUrls: ['./bid-list.component.css']
})
export class BidListComponent implements OnInit,OnDestroy {

  bidOrderDetails : OrderDetail[];
  bidSubscription: Subscription;

  constructor( private bidbookService: BidbookService) {
     this.bidSubscription = this.bidbookService.getBidBookObservable().subscribe(bidOrderDetails =>
          { this.bidOrderDetails = bidOrderDetails; }
        );
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.bidSubscription.unsubscribe();
  }

}
