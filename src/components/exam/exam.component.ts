import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TimerComponent } from '../timer/timer.component';
import { CommonModule } from '@angular/common';
import { ExamManagementService } from '../../services/exam-management.service';
import { LoaderComponent } from "../loader/loader.component";
import { trigger, state, style, transition, animate } from '@angular/animations';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [FormsModule, TimerComponent, CommonModule, LoaderComponent],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})

export class ExamComponent {
  questions: any[] = [];
  categories: any[] = [];
  currentQuestion: any = {};
  currentCategory: any = {};
  totalQuestions: number = 0;
  selectedOptions: number = 0;
  score: number = 0;
  resultArray: any[] = [];
  loaderCategory: boolean = true;
  loaderQuestion: boolean = true;
  categoryError: boolean = false;
  QuestionError: boolean = false;
  categoryPointer: number = 0;
  quesPointer: number = 0;
  isCategoryFinish: boolean = false;
  isTestFinish: boolean = false;

  constructor(private examService: ExamManagementService) {
  }

  ngOnInit() {
    // Fetch the categories and questions from the API    
    this.examService.getCategories()
      .pipe(
        switchMap((response) => {
          this.categories = response.categories;
          this.loaderCategory = false;
          if (this.categories.length > 0) {
            this.currentCategory = this.categories[0];
            //User's answers will be save in resultArray category wise.
            for (let category of this.categories) {
              this.resultArray.push({
                category: category.cat_name,
                answers: [],
              })
            }
            //console.log(this.resultArray);
          } else {
            console.log("No Categories Found in Database");
            this.categoryError = true;
          }
          // Use the category response to call the second API
          return this.examService.getQuestions(this.categories[0].ques_table, this.categories[0].options_table);
        }),
        catchError(error => {
          console.error('Error occurred:', error);
          return of({ error: 'An error occurred while fetching data' });
        })
      )
      .subscribe({
        next: (response) => {
          this.questions = response.questions;
          //this.loaderQuestion = false;
          this.totalQuestions = this.questions.length;
          if (this.totalQuestions > 0) {
            this.currentQuestion = this.questions[this.quesPointer];
          } else {
            console.log("No Questions Found in Database for the selected category");
            this.QuestionError = true;
          }
        },
        error: (error) => {
          //this.error = 'An error occurred while fetching data';
          this.QuestionError = true;
          this.loaderQuestion = false;
        },
        complete: () => {
          this.loaderQuestion = false;
        }
      });


  }
  
  nextQuestion() {
    //Check if the last question of the last category is reached
    if (this.categoryPointer == this.categories.length - 1) {
      if (this.quesPointer == this.questions.length - 1) {
        console.log("Test Completed");
        this.isTestFinish = true;
        //Redirect to the resultComponent
        return;
      }
    }

    // Logic to change Category and Question on next button click
    if (this.quesPointer < this.totalQuestions) {
      //debugger;
      //Check if the selected option is correct or not
      if (Number(this.decodeCorrectAnswer(this.questions[this.quesPointer].correct_answer)) == this.selectedOptions) {
        this.score += 1;
        //Push the correct answer in resultArray
        this.resultArray[this.categoryPointer].answers.push({
          [this.quesPointer]: "Correct"
        });
      } else {
        //Push the incorrect answer in resultArray
        this.resultArray[this.categoryPointer].answers.push({
          [this.quesPointer]: "Incorrect"
        });
      }
      this.quesPointer += 1; //Increment the question pointer
      if(this.questions[this.quesPointer]!==undefined){
        this.currentQuestion = this.questions[this.quesPointer];//Set the next question
      }
      this.selectedOptions = 0; //Reset the selected option
      if(this.quesPointer === this.totalQuestions){
        this.isCategoryFinish = true;
      }
    } else {
      //Increment the category pointer and reset the question pointer
      this.categoryPointer += 1;
      this.quesPointer = 0;
      this.currentCategory = this.categories[this.categoryPointer];
      this.currentQuestion = this.questions[this.quesPointer];
      //(API Call) Fetch the questions for the new category
      this.examService.getQuestions(this.currentCategory.ques_table, this.currentCategory.options_table).subscribe((response) => {
        console.log(response);
        this.questions = response.questions;
        this.loaderQuestion = false;
        this.totalQuestions = this.questions.length;
        if (this.totalQuestions > 0) {
          this.currentQuestion = this.questions[this.quesPointer];
          this.isCategoryFinish = false;
        } else {
          console.log("No Questions Found in Database for the selected category");
          this.QuestionError = true;
        }
      });
    }

  }


previousQuestion() {
  if (this.quesPointer > 0) {
    this.quesPointer--;
    this.currentQuestion = this.questions[this.quesPointer];
    this.resultArray[this.categoryPointer].answers.pop();
    this.score -= 1;
  }
}

skipQuestion() {

}

decodeCorrectAnswer(correctAnswer: string) {
  return atob(correctAnswer);
} 
}
