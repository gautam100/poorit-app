import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { constant } from '../constant/constant';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  mobile: string;
  gender: string;
  organization: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
  userId?: string,
  name?: string
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  
  //private baseUrl = constant.BASE_URL;

  constructor(private http:HttpClient) { 
  }

  signup(userData: SignupRequest): Observable<AuthResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<AuthResponse>(`${constant.BASE_URL}/signup`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      mobile: userData.mobile,
      gender: userData.gender,
      organization: userData.organization
    }, httpOptions);
  }

  login(loginData: LoginInterface): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${constant.BASE_URL}/login`, loginData)
    .pipe(
      map(response => {
        // Store token in localStorage if login is successful
        if (response.success && response.token) {
          localStorage.setItem('loginUser',loginData.email);
          localStorage.setItem('loginUserId', response.userId ?? '');
          localStorage.setItem('loginUserName', response.name ?? '');
          localStorage.setItem('token', response.token);
        }
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('loginUser');
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

}
