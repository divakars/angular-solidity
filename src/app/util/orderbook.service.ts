import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { OrderDetail } from './orderdetail.model';

@Injectable()
export class OrderBookService {

 public orderBookSubject = new Subject<OrderDetail[]>();

 updateOrderList(orderDtlLst : OrderDetail[] ){
    //this.subject.next({ text: message });
    console.log(' updateOrderList  invoked ')
    this.orderBookSubject.next(orderDtlLst);
 }

 getOrderBookObservable(): Observable<any> {
    return this.orderBookSubject.asObservable();
 }

}
