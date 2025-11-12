import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  urlCurrente='';
  constructor (private router :  Router, private authService: AuthService){
      this.urlCurrente=router.url
      console.log(this.urlCurrente)
  }


  loginRedirect(){
    this.router.navigate(['login'])
  }

  logout(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

  goDashboard(){
    this.router.navigate(['dashboard'])
  }
}
