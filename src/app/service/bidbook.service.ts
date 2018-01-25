import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { OrderDetail } from '../util/orderdetail.model';

@Injectable()
export class BidbookService {

  private bidBookSubject = new Subject<OrderDetail[]>();

  updateBuyOrder(orderDtlLst : OrderDetail[] ){
     this.bidBookSubject.next(orderDtlLst);
  }

  getBidBookObservable(): Observable<any> {
     return this.bidBookSubject.asObservable();
  }

}
