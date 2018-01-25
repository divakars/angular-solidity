import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Web3Service } from '../util/web3.service';
import { OrderBookService } from '../util/orderbook.service';
import fixedSupplyToken_artifacts from '../../../build/contracts/FixedSupplyToken.json';
import exchange_artifacts from '../../../build/contracts/Exchange.json';
import { OrderDetail } from '../util/orderdetail.model';
import { ExchangeInfoService } from '../service/exchange-info-service.service';
import { ExchangeInfo } from '../service/exchangeInfo.model';
import { TransactionStatusService } from '../service/transaction-status.service';
import { BidbookService } from '../service/bidbook.service';

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.css']
})
export class OrderBookComponent implements OnInit {

  @ViewChild('buyTokenForm') buyTokenForm: NgForm;
  @ViewChild('sellTokenForm') sellTokenForm: NgForm;

  accounts: string[];
  currentAccount : string;
  status : string;

  exchangeInfo : ExchangeInfo;
  tokenBalance : string;

  TokenContract : any;
  ExchangeContract : any;

  constructor(private web3Service: Web3Service,private orderBookService:OrderBookService,
      private exchangeInfoServiceService: ExchangeInfoService,
      private statusService:TransactionStatusService,private bidbookService:BidbookService ) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit() {
    this.web3Service.artifactsToContract(fixedSupplyToken_artifacts)
      .then((FixedSupplyTokenAbstraction) => {
        this.TokenContract = FixedSupplyTokenAbstraction;
      });
    this.web3Service.artifactsToContract(exchange_artifacts)
      .then((ExchangeAbstraction) => {
        this.ExchangeContract = ExchangeAbstraction;
      });
      this.watchAccount();
      if(this.web3Service.ready){
        this.web3Service.accountsObservable.next(this.web3Service.accounts);
        this.updateOrderBooks();
      }
  }

  watchAccount() {
    console.log('watchAccount: ');
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.currentAccount = accounts[0];
      this.refreshBalance();
      console.log('this.currentAccount: '+ this.currentAccount);
    });
  }

  async refreshBalance() {
    if ((typeof this.ExchangeContract == 'undefined') || !this.ExchangeContract) {
    //  this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }
    try {
      const deployedToken = await this.TokenContract.deployed();
      const deployedExchange = await this.ExchangeContract.deployed();
      const tokenBalance = await this.web3Service.getBalance(this.currentAccount);
      this.tokenBalance = this.web3Service.convertFromwei(tokenBalance);
      this.exchangeInfo = new ExchangeInfo(deployedExchange.address,deployedToken.address,this.currentAccount,this.tokenBalance);
      this.exchangeInfoServiceService.updateExchangeInfo(this.exchangeInfo);
      await this.updateOrderBooks();
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setStatus(status) {
    this.status = status;
    this.statusService.setStatus(status);
  }

  async sellToken(){
    console.log('Sell Token invoked');
    if (!this.ExchangeContract) {
      //this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }
    var tokenName = this.sellTokenForm.value.inputNameSellToken;
    var amount = this.sellTokenForm.value.inputAmountSellToken ;
    var price = this.sellTokenForm.value.inputPriceSellToken;
    var account = this.currentAccount;
    try{
        const deployedContract = await this.ExchangeContract.deployed();
        const transaction = await deployedContract.sellToken.sendTransaction(tokenName, price, amount, {from: account, gas: 4000000});
        //const transaction = await deployedToken.approve.sendTransaction(receiver, amount);
        if (!transaction) {
          this.setStatus('Transaction failed!');
        } else {
          this.updateOrderBooks();
          this.setStatus('Transaction complete!');
        }
    }catch(e){
      console.log(e);
      this.setStatus('Error Selling Token; see log.');
    }
  }

  async buyToken(){
    console.log('Buy Token invoked');
    if (!this.ExchangeContract) {
      //this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }

    var tokenName = this.buyTokenForm.value.inputNameBuyToken;
    var amount = this.buyTokenForm.value.inputAmountBuyToken ;
    var price = this.buyTokenForm.value.inputPriceBuyToken;

    var account = this.currentAccount;

    try{
        const deployedContract = await this.ExchangeContract.deployed();
        console.log("Address being shared is "+ account);
        const transaction = await deployedContract.buyToken.sendTransaction(tokenName, price, amount, {from: account, gas: 4000000});

        //const transaction = await deployedToken.approve.sendTransaction(receiver, amount);
        if (!transaction) {
          this.setStatus('Transaction failed!');
        } else {
          this.updateOrderBooks();
          this.setStatus('Transaction complete!');
        }
    }catch(e){
      console.log(e);
      this.setStatus('Error Selling Token; see log.');
    }
  }

  async updateOrderBooks(){
    console.log('Update order book invoked');
    if ((typeof this.ExchangeContract == 'undefined') || !this.ExchangeContract) {
      //this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }
    try{
        const deployedContract = await this.ExchangeContract.deployed();
        const sellOrderBook = await deployedContract.getSellOrderBook.call("FIXED");
        const bidOrderBook = await deployedContract.getBuyOrderBook.call("FIXED");
        console.log('Found balance: ' + sellOrderBook);

        console.log('Length : ' + sellOrderBook.length);

        console.log('Found Bidbook balance: ' + bidOrderBook);
        console.log('Found Bidbook Length :: ' + bidOrderBook.length);
        this.orderBookService.updateOrderList(this.getOrderList(sellOrderBook));
        this.bidbookService.updateBuyOrder(this.getOrderList(bidOrderBook));
    }catch(e){
      console.log(e);
      this.setStatus('Error Selling Token; see log.');
    }
  }

  private getOrderList(sellOrderBook:any){
    var orderDtlLst : OrderDetail[] =[] ;
    if(sellOrderBook.length == 0) {
      console.log('No Sell Orders at the moment.');
    }else{
      var alength = sellOrderBook[0].length;

      var orderDet : OrderDetail;
      var index = 0;
      while(index<alength){
        orderDet = new OrderDetail("FIXED",sellOrderBook[1][index],sellOrderBook[0][index])
        orderDtlLst.push(orderDet);
        index++;
      }
    }
    return orderDtlLst;
  }

}
