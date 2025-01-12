import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserManagementService } from '../../services/user-management.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserManagementService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/instructions']); // Redirect if already logged in
    }
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.userService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['', 'instructions'])
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'An error occurred during login from the server';
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  } 
  /*async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.userService.login(this.loginForm.value).subscribe({
        next: async (response) => {
          console.log('here');
          if (response.success) {
            try {
              const navigationResult = await this.router.navigate([
                '/instructions',
              ]);
              console.log('Navigation result:', navigationResult);
              if (!navigationResult) {
                console.error('Navigation failed');
              }
            } catch (err) {
              console.error('Navigation error:', err);
            }
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.errorMessage =
            error.error.message ||
            'An error occurred during login from the server';
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }*/
}
