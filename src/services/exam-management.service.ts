
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})

export class ExamManagementService {

  constructor(private http:HttpClient) { 
  }

  getCategories(): Observable<any>{
    return this.http.get(`${constant.BASE_URL}/categories`);
  }
  getQuestions(): Observable<any>{
    return this.http.get(`${constant.BASE_URL}/questions`);
  }
  

}


