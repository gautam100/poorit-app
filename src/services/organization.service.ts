import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiUrl = 'http://localhost:3000/api/institutes';  // Backend API endpoint

  constructor(private http: HttpClient) {}

  // Method to fetch institutes
  getInstitutes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
