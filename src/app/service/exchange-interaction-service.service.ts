import { Injectable } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import fixedSupplyToken_artifacts from '../../../build/contracts/FixedSupplyToken.json';
import exchange_artifacts from '../../../build/contracts/Exchange.json';
import { ExchangeBalance } from './exchangebalance.model';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as BN from 'bn.js';


@Injectable()
export class ExchangeInteractionService {

  ExchangeContract : any;
  exchangeBalance : ExchangeBalance;
  currentAccount : string;
  tokenBalance : string;
  status : string;

  private exchBalanceSubject = new Subject<ExchangeBalance>();

  constructor(private web3Service: Web3Service) {
    console.log(' *******************  ExchangeInteractionService Constructor invoked ************* *  ');
    this.web3Service.artifactsToContract(exchange_artifacts)
      .then((ExchangeAbstraction) => {
        this.ExchangeContract = ExchangeAbstraction;
        this.refreshExchangeBalance();
      });

   }

   async refreshExchangeBalance() {
     console.log(' Exchange Info service refreshExchangeBalance balance');
     try {
       const deployedExchange = await this.ExchangeContract.deployed();
       if (!this.ExchangeContract || typeof deployedExchange === 'undefined') {
           return;
       }
       const exchangeTokenBalance = await deployedExchange.getBalance.call("FIXED");
       const exchangeWeiBalance = await deployedExchange.getEthBalanceInWei.call();
       console.log(' this.web3Service.convertFromwei(exchangeWeiBalance) :  '+ this.web3Service.convertFromwei(new BN(exchangeWeiBalance.toFixed(),10)) );
       this.exchangeBalance = new ExchangeBalance("FIXED",exchangeTokenBalance,this.web3Service.convertFromwei(new BN(exchangeWeiBalance.toFixed(),10)),true);
       this.updateExchangeBalance(this.exchangeBalance);
     } catch (e) {
       console.log(e);
       this.setStatus('Error getting balance; see log.');
     }
   }

   setStatus(status) {
     this.status = status;
   }

   updateExchangeBalance(exchangeBalance : ExchangeBalance ){
      //this.subject.next({ text: message });
      console.log(' Exchange Balance Update Triggered ');
      this.exchBalanceSubject.next(exchangeBalance);
   }

   getExchangeBalanceObservable(): Observable<any> {
      return this.exchBalanceSubject.asObservable();
   }

}
