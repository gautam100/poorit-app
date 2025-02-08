import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserManagementService } from '../../services/user-management.service';
import { OrganizationService } from '../../services/organization.service';

interface SignupResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  loading: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';

  //object of form element
  userObj: any = {
    name: '',
    email: '',
    password: '',
    mobile: '',
    gender: '',
    organization: '',
  };

  formValue: any;

  // List of organizations fetched from the backend
  organizations: any[] = [];
  isLoading = false;

  // Dummy organization data
  // organizations: any[] = [
  //   { id: 1, name: 'Company A' },
  //   { id: 2, name: 'Company B' },
  //   { id: 3, name: 'Company C' },
  //   { id: 4, name: 'Company D' },
  //   { id: 5, name: 'Company E' },
  // ];

  private http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserManagementService);

  // Inject OrganizationService to fetch data
  constructor(private organizationService: OrganizationService) {}

  ngOnInit(): void {
    this.fetchInstitutes();
  }

  fetchInstitutes(): void {
    this.isLoading = true;
    this.organizationService.getInstitutes().subscribe({
      next: (data: any) => {
        console.log('Fetched organizations:', data);  // Check if data is correct here
        this.organizations = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching institutes:', error);
        this.isLoading = false;
      },
    });
  }
  
  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.userService.signup(this.userObj).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 4000);
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
  }
}
