import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private hc:HttpClient ) { }

  loginstatus=false;

  createuser(userobj):Observable<any>{
   return this.hc.post('/user/createuser',userobj)
  }

  getuser(username){
    return this.hc.get("/user/getuser")
  }

  loginuser(credentials):Observable<any>{
    return this.hc.post('/user/login',credentials)
  }

}
