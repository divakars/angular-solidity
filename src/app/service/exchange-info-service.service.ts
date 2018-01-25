import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ExchangeInfo } from './exchangeInfo.model';

@Injectable()
export class ExchangeInfoService {

  public exchangeInfoSubject = new Subject<ExchangeInfo>();

  updateExchangeInfo(exchangeInfo : ExchangeInfo ){
       this.exchangeInfoSubject.next(exchangeInfo);
  }

  getExchangeInfoObservable(): Observable<any> {
     return this.exchangeInfoSubject.asObservable();
  }

  constructor() {
    this.exchangeInfoSubject.next(new ExchangeInfo("","","",""));
   }

}
