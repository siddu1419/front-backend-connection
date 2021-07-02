import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private us:UserService,private router:Router) { }

  ngOnInit(): void {
    
  }
  onLogin(userCredentials){
    this.us.loginuser(userCredentials).subscribe(
      res=>{
        if(res.message==="login success"){
          //save token to localstorage
          localStorage.setItem("token",res.token)
          localStorage.setItem("username",res.username)
          localStorage.setItem("userObj",JSON.stringify(res.userObj))

          this.us.loginstatus=true;

          this.router.navigateByUrl('/home')
          //navigate to user profile
          //this.router.navigateByUrl(`userprofile/${res.username}`)
        }
        else{
          alert(res.message)
        }
      },
      err=>{
        console.log(err)
        alert("Something went wrong in login")
      }
    )
  }
}
