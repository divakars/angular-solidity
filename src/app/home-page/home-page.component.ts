import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Web3Service } from '../util/web3.service';
import fixedSupplyToken_artifacts from '../../../build/contracts/FixedSupplyToken.json';
import exchange_artifacts from '../../../build/contracts/Exchange.json';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  @ViewChild('depositTokenForm') depositTokenForm: NgForm;
  @ViewChild('depositEtherForm') depositEtherForm: NgForm;
  @ViewChild('withdrawEtherForm') withdrawEtherForm: NgForm;
  @ViewChild('withdrawTokenForm') withdrawTokenForm: NgForm;

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

  async depositEther(){
    console.log('Deposit Ether invoked');
    if (!this.ExchangeContract) {
      this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }
    var amountEther = this.depositEtherForm.value.inputAmountDepositEther ;
    var exchangeInstance;
    try{
        const deployedContract = await this.ExchangeContract.deployed();
        const transaction = await deployedContract.depositEther.sendTransaction({value: this.web3Service.convert(amountEther, "ether"), from: this.currentAccount});
        //const transaction = await deployedToken.approve.sendTransaction(receiver, amount);
        if (!transaction) {
          this.setStatus('Transaction failed!');
        } else {
          this.setStatus('Transaction complete!');
        }
    }catch(e){
      console.log(e);
      this.setStatus('Error depositing Ether; see log.');
    }
  }

  //
  async withdrawEther(){
    console.log('Withdraw Ether invoked');
    if (!this.ExchangeContract) {
      this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }
    var amountEther = this.withdrawEtherForm.value.inputAmountWithdrawalEther ;
    var account = this.currentAccount;
    try{
        const deployedContract = await this.ExchangeContract.deployed();
        const transaction = await deployedContract.withdrawEther.sendTransaction(this.web3Service.convert(amountEther, "ether"), {from: account});
        //const transaction = await deployedToken.approve.sendTransaction(receiver, amount);
        if (!transaction) {
          this.setStatus('Transaction failed!');
        } else {
          this.setStatus('Transaction complete!');
        }
    }catch(e){
      console.log(e);
      this.setStatus('Error withdrawing Ether; see log.');
    }
  }

  async depositToken(){
    console.log('Deposit Token invoked');
    if (!this.ExchangeContract) {
      this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }
    //var amountEther = this.depositTokenForm.value.inputNameDepositToken ;
    var amountToken = this.depositTokenForm.value.inputAmountDepositToken;
    var nameToken = this.depositTokenForm.value.inputNameDepositToken;
    var account = this.currentAccount;

    try{
        const deployedContract = await this.ExchangeContract.deployed();
        console.log("Current Address for deposit Token" + this.currentAccount);
        const transaction = await deployedContract.depositToken.sendTransaction(nameToken, amountToken, {from: account, gas: 4500000});
        //const transaction = await deployedToken.approve.sendTransaction(receiver, amount);
        if (!transaction) {
          this.setStatus('Transaction failed!');
        } else {
          this.setStatus('Transaction complete!');
        }
    }catch(e){
      console.log(e);
      this.setStatus('Error Depositing Token; see log.');
    }
  }

  async withdrawToken(){
    console.log('Withdraw Token invoked');
    if (!this.ExchangeContract) {
      this.setStatus('ExchangeContract Contract is not loaded, unable to send transaction');
      return;
    }

    var nameToken = this.withdrawTokenForm.value.inputNameWithdrawalToken;
    var amountTokens = this.withdrawTokenForm.value.inputAmountWithdrawalToken;
    var account = this.currentAccount;

    try{
        const deployedContract = await this.ExchangeContract.deployed();
        const transaction = await deployedContract.withdrawToken.sendTransaction(nameToken, amountTokens, {from: account});
        //const transaction = await deployedToken.approve.sendTransaction(receiver, amount);
        if (!transaction) {
          this.setStatus('Transaction failed!');
        } else {
          this.setStatus('Transaction complete!');
        }
    }catch(e){
      console.log(e);
      this.setStatus('Error Depositing Token; see log.');
    }
  }

}
