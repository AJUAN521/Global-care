import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Simulator } from '../simulator/simulator';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [NgOptimizedImage, Simulator],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  user: any = null;

  constructor(private router: Router) {}

  startNow() {
    if (this.user) {
      this.router.navigate(['payment-form']);
    } else {
      this.router.navigate(['login']);
    }
  }

  loginRedirect() {
    this.router.navigate(['login']);
  }
}
