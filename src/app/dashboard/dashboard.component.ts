import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import party from "party-js"
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  logoutdiv:boolean=false
  isCollapse:boolean=true
  user:string=''
  currentAcno:number=0
  acno:any=""
  balance:number=0
  deleteConfirm:boolean=false
  deleteSpinnerDiv:boolean=false
  fundTransferSuccessMsg:string=''
  fundTransferErrorMsg:string=''
  depositForm = this.fb.group({
  amount:['',[Validators.required,Validators.pattern('[0-9]*')]]
  })
  fundTransferForm=this.fb.group({
    toAcno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]],
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]]
  })
  depositMsg:string=''
  constructor(private api:ApiService,private fb:FormBuilder, private router:Router){
  }

  ngOnInit(){
    if(!localStorage.getItem("token")){
      alert('Please Log In !!!')
      this.router.navigateByUrl('')
    }
    if(localStorage.getItem("username")){
      this.user = localStorage.getItem("username")||''      
    }
  }

  collapse(){
    this.isCollapse=!this.isCollapse
  }

  getBalance(){
    if(localStorage.getItem("currentAcno")){
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno")||'')     
      console.log(this.currentAcno);
      this.api.getBalance(this.currentAcno).subscribe((result:any)=>{
        console.log(result);
        this.balance=result.balance
      })
    }
  }
  
  deposit(){
    if(this.depositForm.valid){
      let amount = this.depositForm.value.amount
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno")||'')     
      this.api.deposit(this.currentAcno,amount).subscribe((result:any)=>{
        console.log(result);
        this.depositMsg=result.message
        setTimeout(()=>{
          this.depositForm.reset()
          this.depositMsg=''
        },5000)
      },
      (result:any)=>{
        this.depositMsg=result.error.message
      })
    }
    else{
      alert("Invalid Form")
    }
  }
  showconfetti(sourse:any){
    party.confetti(sourse)
  }
  transfer(){
    if(this.fundTransferForm.valid){
      let toAcno = this.fundTransferForm.value.toAcno
      let pswd = this.fundTransferForm.value.pswd
      let amount = this.fundTransferForm.value.amount
      this.api.fundTransfer(toAcno,pswd,amount)
      .subscribe(
        (result:any)=>{
        this.fundTransferSuccessMsg = result.message
        console.log(this.fundTransferSuccessMsg)
      },(result:any)=>{
        this.fundTransferErrorMsg = result.error.message
        setTimeout(()=>{
          this.fundTransferErrorMsg=''
        },3000)
      })
    }else{
      alert("Invalid Form")
    }
  }

  clearFundTransferForm(){
    this.fundTransferErrorMsg=""
    this.fundTransferSuccessMsg=""
    this.fundTransferForm.reset()
  }

  logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("currentAcno")
    this.logoutdiv=true
    setTimeout(()=>{
      this.router.navigateByUrl("")
      this.logoutdiv=false
    },4000)

  }
  deleteAccountFromNavBar(){
    this.acno=localStorage.getItem("currentAcno")
    this.deleteConfirm=true
  }
  onCancel(){
    this.acno=''
    this.deleteConfirm=false
  }
  onDelete(event:any){
    let deleteAcno = JSON.parse(event)
    this.api.deleteAccount(deleteAcno).subscribe((result:any)=>{
      this.acno=""
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      localStorage.removeItem("currentAcno")
      this.deleteSpinnerDiv=true
      setTimeout(()=>{
        this.router.navigateByUrl("")
        this.deleteSpinnerDiv=false
        },5000)
    },(result:any)=>{
      alert(result.error.message)
    })
  }
}
