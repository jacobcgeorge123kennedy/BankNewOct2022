import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMsg:string=''
  successMsg:boolean=false
  loginForm = this.fb.group({
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]]
  })
  constructor(private fb:FormBuilder, private api:ApiService, private router:Router){
    
  }

  login(){
      
  if(this.loginForm.valid){
  let acno = this.loginForm.value.acno
  let pswd = this.loginForm.value.pswd
  this.api.login(acno,pswd).subscribe((result:any)=>{
    this.successMsg=true
    localStorage.setItem("username",result.username)
    localStorage.setItem("currentAcno",JSON.stringify(result.currentAcno))
    localStorage.setItem("token",result.token)
    setTimeout(()=>{
      this.router.navigateByUrl('dashboard')
    },2000)
  },
  (result:any)=>{
    this.errorMsg=result.error.message
    setTimeout(()=>{
      this.errorMsg=""
      this.loginForm.reset()
    },(3000))
  })
  }else{
    alert('Invalid form')
  }
  }
}
