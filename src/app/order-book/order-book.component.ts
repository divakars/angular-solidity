import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Web3Service } from '../util/web3.service';
import fixedSupplyToken_artifacts from '../../../build/contracts/FixedSupplyToken.json';
import exchange_artifacts from '../../../build/contracts/Exchange.json';

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

  TokenContract : any;
  ExchangeContract : any;

  constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit() {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);

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
      console.log('this.currentAccount: '+ this.currentAccount);
    });
  }

  setStatus(status) {
    this.status = status;
  }

  async sellToken(){
    console.log('Sell Token invoked');
    if (!this.ExchangeContract) {
      this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
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
      this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
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
    if (!this.ExchangeContract) {
      this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }
    try{
        const deployedContract = await this.ExchangeContract.deployed();
        const sellOrderBook = await deployedContract.getSellOrderBook.call("FIXED");
        console.log('Found balance: ' + sellOrderBook);
        if(sellOrderBook[0].length == 0) {
          console.log('No Sell Orders at the moment.');
        }
    }catch(e){
      console.log(e);
      this.setStatus('Error Selling Token; see log.');
    }
  }


}
