import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { EventInfo } from './eventInfo.model';

@Injectable()
export class TransactionStatusService {

  public transactionStatusSubject = new Subject<string>();

  constructor() { }

  setStatus(status : string ){
     //this.subject.next({ text: message });
      this.transactionStatusSubject.next(status);
  }

  getTransactionStatusObservable(): Observable<any> {
     return this.transactionStatusSubject.asObservable();
  }

}
