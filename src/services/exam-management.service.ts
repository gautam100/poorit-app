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
  getQuestions(ques_table:string, options_table:string): Observable<any>{
    return this.http.get(`${constant.BASE_URL}/questions/`+ques_table+`/`+options_table);
  }
  
  saveExamResults(userId: number, resultData: any) {
    return this.http.post(`${constant.BASE_URL}/result/${userId}`, resultData);
  }

}


