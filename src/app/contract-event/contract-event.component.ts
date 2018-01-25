import { Component, OnInit , OnDestroy } from '@angular/core';
import { ExchangeInfoService } from '../service/exchange-info-service.service';
import { EventInfoService } from '../service/event-info-service.service';
import { TransactionStatusService } from '../service/transaction-status.service';


import { ExchangeInfo } from '../service/exchangeInfo.model';
import { EventInfo } from '../service/eventInfo.model';

import { Subscription } from 'rxjs/Subscription';
import {Web3Service} from '../util/web3.service';
import fixedSupplyToken_artifacts from '../../../build/contracts/FixedSupplyToken.json';
import exchange_artifacts from '../../../build/contracts/Exchange.json';

import { ExchangeInteractionService } from '../service/exchange-interaction-service.service';
import { ExchangeBalance } from '../service/exchangebalance.model';

@Component({
  selector: 'app-contract-event',
  templateUrl: './contract-event.component.html',
  providers: [ExchangeInteractionService],
  styleUrls: ['./contract-event.component.css']
})
export class ContractEventComponent implements  OnInit, OnDestroy  {

  exchangeInfoSubscription: Subscription;
  eventInfoSubscription: Subscription;
  statusSubscription: Subscription;
  exchangeBalanceSubscription : Subscription ;


  exchangeBalance : ExchangeBalance = new ExchangeBalance('','','',false);

  exchangeInfo:ExchangeInfo;
  eventInfo:EventInfo;

  accounts: string[];
  TokenContract : any;
  ExchangeContract : any;
  currentAccount : string;
  tokenBalance : string;
  status : string;
  resultEvent :any;

  constructor(private web3Service: Web3Service,private exchangeInfoServiceService: ExchangeInfoService,
        private eventInfoService:EventInfoService,  private statusService:TransactionStatusService ,
         private exchangeInteractionService:ExchangeInteractionService) {
    // Initialise exchangeInfo
    this.exchangeInfo = new ExchangeInfo("","","","");
    this.eventInfo = new EventInfo("","",false);
    this.eventInfoSubscription = this.eventInfoService.getEventInfoObservable().subscribe(eventInfo => {
         this.eventInfo = eventInfo;
        });

     this.exchangeInfoSubscription = this.exchangeInfoServiceService.getExchangeInfoObservable().subscribe(exchangeInfo => {
        this.exchangeInfo = exchangeInfo;
       });

    this.statusSubscription = this.statusService.getTransactionStatusObservable().subscribe(status => {
       this.status = status;
      });

    this.exchangeBalanceSubscription = this.exchangeInteractionService.getExchangeBalanceObservable().subscribe(
                exchangeBalance => { this.exchangeBalance = exchangeBalance; });

    console.log('ContractEventComponent  CONSTRUCTOR COMPLETED *********: ');
   }



   ngOnInit(){
     this.web3Service.artifactsToContract(fixedSupplyToken_artifacts)
       .then((FixedSupplyTokenAbstraction) => {
         this.TokenContract = FixedSupplyTokenAbstraction;
       });
     this.web3Service.artifactsToContract(exchange_artifacts)
       .then((ExchangeAbstraction) => {
         this.ExchangeContract = ExchangeAbstraction;
       });
    this.watchAccount();
   }

   watchAccount() {
     console.log('watchAccount: ');
     this.web3Service.accountsObservable.subscribe((accounts) => {
       this.accounts = accounts;
       this.currentAccount = accounts[0];
       this.checkForEvent();
     });
   }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.exchangeInfoSubscription.unsubscribe();
    this.eventInfoSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
    this.exchangeBalanceSubscription.unsubscribe();
  }

  async checkForEvent(){
    //console.log(" ********  checkForEvent  ******************* ");
    try {
      const deployedExchange =  await this.ExchangeContract.deployed();
      const deployedTokenContract = await this.TokenContract.deployed();
      var contract_comp = this;
      if(deployedExchange){
          deployedExchange.LimitSellOrderCreated({}, {fromBlock: 'latest', toBlock: 'latest'}).watch(function (error, result) {
              contract_comp.eventInfoService.updateEventInfo(new EventInfo(result.event,JSON.stringify(result.args),true));
          });
          deployedExchange.LimitBuyOrderCreated({}, {fromBlock: 'latest', toBlock: 'latest'}).watch(function (error, result) {
              contract_comp.eventInfoService.updateEventInfo(new EventInfo(result.event,JSON.stringify(result.args),true));
          });
          deployedExchange.SellOrderFulfilled({}, {fromBlock: 'latest', toBlock: 'latest'}).watch(function (error, result) {
              contract_comp.eventInfoService.updateEventInfo(new EventInfo(result.event,JSON.stringify(result.args),true));
          });
          deployedExchange.BuyOrderFulfilled({}, {fromBlock: 'latest', toBlock: 'latest'}).watch(function (error, result) {
              contract_comp.eventInfoService.updateEventInfo(new EventInfo(result.event,JSON.stringify(result.args),true));
          });
          deployedExchange.allEvents({}, {fromBlock: 'latest', toBlock: 'latest'}).watch(function (error, result) {
              contract_comp.eventInfoService.updateEventInfo(new EventInfo(result.event,JSON.stringify(result.args),true));
          });
       }

       if(deployedTokenContract){
         deployedTokenContract.allEvents({}, {fromBlock: 'latest', toBlock: 'latest'}).watch(function (error, result) {
             contract_comp.eventInfoService.updateEventInfo(new EventInfo(result.event,JSON.stringify(result.args),true));
         });
       }
    }catch (e) {
      console.log(e);
      this.statusService.setStatus('Error getting balance; see log.');
    }

  }

}
