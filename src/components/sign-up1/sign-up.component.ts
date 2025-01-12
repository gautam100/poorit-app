import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface SignupResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styles: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;
  errorMessage = '';

  // Dummy organization data
  organizations = [
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' },
    { id: 3, name: 'Company C' },
    { id: 4, name: 'Company D' },
    { id: 5, name: 'Company E' },
  ];

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', [Validators.required]],
      organization: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    //   this.initializeForm();
  }

  // private initializeForm() {
  //   this.signupForm = this.fb.group({
  //     fullName: ['', [Validators.required]],
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(6)]],
  //     mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  //     gender: ['', [Validators.required]],
  //     organization: ['', [Validators.required]]
  //   });
  // }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm?.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.signupForm && this.signupForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.http
        .post<SignupResponse>(
          'http://localhost:3000/api/signup',
          this.signupForm.value
        )
        .subscribe({
          next: (response) => {
            if (response.success) {
              // Navigate to login page or show success message
              this.router.navigate(['/login']);
            } else {
              this.errorMessage = response.message;
            }
          },
          error: (error) => {
            this.errorMessage =
              error.error.message || 'An error occurred during signup';
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          },
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.signupForm?.controls || {}).forEach((key) => {
        const control = this.signupForm?.get(key);
        control?.markAsTouched();
      });
    }
  }
}
