import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'meanapp';
  constructor(public us:UserService){}

  userlogout(){
    localStorage.clear()
    this.us.loginstatus=false;
  }
}
