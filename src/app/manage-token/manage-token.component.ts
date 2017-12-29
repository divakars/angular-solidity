import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Web3Service} from '../util/web3.service';
import fixedSupplyToken_artifacts from '../../../build/contracts/FixedSupplyToken.json';
import exchange_artifacts from '../../../build/contracts/Exchange.json';


@Component({
  selector: 'app-manage-token',
  templateUrl: './manage-token.component.html',
  styleUrls: ['./manage-token.component.css']
})
export class ManageTokenComponent implements OnInit {
  @ViewChild('manageTokenForm') manageTokenForm: NgForm;
  @ViewChild('tokenAllowanceForm') tokenAllowanceForm: NgForm;
  @ViewChild('tokenExchangeForm') tokenExchangeForm: NgForm;

  accounts: string[];
  TokenContract : any;
  ExchangeContract : any;
  currentAccount : string;
  tokenBalance : string;
  status : string;

  constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
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
      this.refreshBalance();
    });
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
    //  const deployedMetaCoin = await this.MetaCoin.deployed();
      const deployedToken = await this.TokenContract.deployed();
      const deployedExchange = await this.ExchangeContract.deployed();

      const tokenBalance = await deployedToken.balanceOf.call(this.currentAccount);
      console.log('Found balance: ' + tokenBalance);
      console.log('Token Address: '+deployedToken.address);
      console.log('Exchange Address: '+deployedExchange.address);
      
      this.tokenBalance = tokenBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setStatus(status) {
    this.status = status;
  }

  async sendToken(){
     console.log('Send Token Invoked');
     if (!this.TokenContract) {
       this.setStatus('Token Contract is not loaded, unable to send transaction');
       return;
     }
     //this.manageTokenForm.value.inputBeneficiarySendToken
     var amount = parseInt(this.manageTokenForm.value.inputAmountSendToken);
     var receiver = this.manageTokenForm.value.inputBeneficiarySendToken;

     try{
         const deployedToken = await this.TokenContract.deployed();
         const transaction = await deployedToken.transfer.sendTransaction(receiver, amount, {from: this.currentAccount});
         if (!transaction) {
           this.setStatus('Transaction failed!');
         } else {
           this.setStatus('Transaction complete!');
           this.refreshBalance();
         }
     }catch(e){
       console.log(e);
       this.setStatus('Error sending Token; see log.');
     }
  }

  async allowanceToken(){
     console.log('Allowance Token Invoked');
     if (!this.TokenContract) {
       this.setStatus('Token Contract is not loaded, unable to send transaction');
       return;
     }

     var amount = parseInt(this.tokenAllowanceForm.value.inputAmountAllowanceToken);
     var receiver = this.tokenAllowanceForm.value.inputBeneficiaryAllowanceToken;

     try{
         const deployedToken = await this.TokenContract.deployed();
         const transaction = await deployedToken.approve.sendTransaction(receiver, amount, {from: this.currentAccount});
         //const transaction = await deployedToken.approve.sendTransaction(receiver, amount);
         if (!transaction) {
           this.setStatus('Transaction failed!');
         } else {
           this.setStatus('Transaction complete!');
           this.refreshBalance();
         }
     }catch(e){
       console.log(e);
       this.setStatus('Error sending Token; see log.');
     }
  }

  async addTokenToExchange(){
    console.log('Add Token Invoked');
    if (!this.ExchangeContract) {
      this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }

    var nameOfToken = this.tokenExchangeForm.value.inputNameTokenAddExchange;
    var addressOfToken = this.tokenExchangeForm.value.inputAddressTokenAddExchange;

    try{
        const deployedContract = await this.ExchangeContract.deployed();
        const transaction = await deployedContract.addToken(nameOfToken, addressOfToken, {from: this.currentAccount});
        //const transaction = await deployedToken.approve.sendTransaction(receiver, amount);
        if (!transaction) {
          this.setStatus('Transaction failed!');
        } else {
          this.setStatus('Transaction complete!');
        }
    }catch(e){
      console.log(e);
      this.setStatus('Error Adding Token; see log.');
    }

  }

}
