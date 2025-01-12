import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.css',
})
export class InstructionsComponent {
  loginUserEmail: string = '';

  constructor(private _router:Router) {
    this.loginUserEmail = localStorage.getItem('loginUser') || '';
  }

  onProceed(){
    this._router.navigateByUrl("exam");
  }
}
