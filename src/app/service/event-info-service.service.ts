import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { EventInfo } from './eventInfo.model';


@Injectable()
export class EventInfoService {

  private eventInfoSubject = new Subject<EventInfo>();

  constructor() {
    this.eventInfoSubject.next(new EventInfo("","",false));
  }

  updateEventInfo(eventInfo : EventInfo ){
     //this.subject.next({ text: message });
     console.log(' Event Infor Status Update Triggered ')
     this.eventInfoSubject.next(eventInfo);
  }

  getEventInfoObservable(): Observable<any> {
     return this.eventInfoSubject.asObservable();
  }

}
