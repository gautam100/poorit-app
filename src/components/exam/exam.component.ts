import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TimerComponent } from '../timer/timer.component';
import { CommonModule } from '@angular/common';
import { ExamManagementService } from '../../services/exam-management.service';
import { LoaderComponent } from '../loader/loader.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

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
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class ExamComponent {
  questions: any[] = [];
  categories: any[] = [];
  currentQuestion: any = {};
  currentCategory: any = {};
  totalQuestions: number = 0; //Category-wise total
  grandTotalQues: number = 0; // Overall Total
  selectedOptions: { [key: number]: number } = {}; // Store selected options
  selectedOptionList: any[] = [];
  score: number = 0; //Category-wise score
  grandScore: number = 0; //Overall Score
  resultArray: any[] = [];
  loaderCategory: boolean = true;
  loaderQuestion: boolean = true;
  categoryError: boolean = false;
  QuestionError: boolean = false;
  categoryPointer: number = 0;
  quesPointer: number = 0;
  isCategoryFinish: boolean = false;
  isTestFinish: boolean = false;
  totalCorrect:number = 0;
  totalIncorrect:number = 0;
  totalSkippedQues:number = 0;
  constructor(private examService: ExamManagementService) {}

  ngOnInit() {
    // Fetch the categories and questions from the API
    this.examService
      .getCategories()
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
              });
              this.selectedOptionList.push({
                category: category.cat_name,
                selectedOption: [],
              });
            }
            //console.log(this.resultArray);
          } else {
            console.log('No Categories Found in Database');
            this.categoryError = true;
          }
          // Use the category response to call the second API
          return this.examService.getQuestions(
            this.categories[0].ques_table,
            this.categories[0].options_table
          );
        }),
        catchError((error) => {
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
            console.log(
              'No Questions Found in Database for the selected category'
            );
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
        },
      });
  }

  nextQuestion() {
    //Check if the last question of the last category is reached
    if (this.categoryPointer == this.categories.length - 1) {
      if (this.quesPointer == this.questions.length - 1) {
        console.log('Test Completed');
        this.calculateScore();
        this.isTestFinish = true;
        this.grandScore = this.grandScore + this.score;
        //Redirect to the resultComponent
        for(let i=0;i<this.resultArray.length;i++){
          for(let j=0;j<this.resultArray[i].answers.length;j++){
            this.grandTotalQues+=1;
            if(this.resultArray[i].answers[j].answer == "Correct"){
              this.totalCorrect++;
            }else{
              this.totalIncorrect++;
            }
          }
        }

        return;
      }
    }

    // Logic to change Category and Question on next button click
    if (this.quesPointer < this.totalQuestions) {
      // if(this.selectedOptionList[this.categoryPointer].selectedOption[this.quesPointer] === undefined){
      //   this.selectedOptionList[this.categoryPointer].selectedOption[this.quesPointer] = null;
      //   this.totalSkippedQues+=1;
      // }
      this.calculateScore();
      this.quesPointer += 1; //Increment the question pointer
      if (this.questions[this.quesPointer] !== undefined) {
        this.currentQuestion = this.questions[this.quesPointer]; //Set the next question
      }
      if (this.quesPointer === this.totalQuestions) {
        this.isCategoryFinish = true;
      }
    } else {
      this.grandScore = this.grandScore + this.score;
      this.categoryPointer += 1; //Increment the category pointer
      this.quesPointer = 0; //Reset the question pointer
      this.currentCategory = this.categories[this.categoryPointer];
      this.currentQuestion = this.questions[this.quesPointer];
      //(API Call) Fetch the questions for the new category
      this.examService
        .getQuestions(
          this.currentCategory.ques_table,
          this.currentCategory.options_table
        )
        .subscribe((response) => {
          console.log(response);
          this.questions = response.questions;
          this.loaderQuestion = false;
          this.totalQuestions = this.questions.length;
          if (this.totalQuestions > 0) {
            this.currentQuestion = this.questions[this.quesPointer];
            this.isCategoryFinish = false;
          } else {
            console.log(
              'No Questions Found in Database for the selected category'
            );
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
    }
  }

  calculateScore() {
    if(this.selectedOptionList[this.categoryPointer].selectedOption[this.quesPointer] === undefined){
      this.selectedOptionList[this.categoryPointer].selectedOption[this.quesPointer] = null;
      this.totalSkippedQues+=1;
    }
    let totalTouchedQues = Object.keys(
      this.selectedOptionList[this.categoryPointer].selectedOption
    ).length;
    
    if (totalTouchedQues > 0) {
      this.score = 0;
      this.resultArray[this.categoryPointer].answers = [];
      for (let i = 0; i < totalTouchedQues; i++) {
        if (
          Number(this.decodeCorrectAnswer(this.questions[i].correct_answer)) ===
          this.selectedOptionList[this.categoryPointer].selectedOption[i]
        ) {
          this.score += 1;
          //Push the correct answer in resultArray
          this.resultArray[this.categoryPointer].answers.push({
            'answer': 'Correct',
            'question_no':i,
          });
        } else {
          //Push the incorrect answer in resultArray
          this.resultArray[this.categoryPointer].answers.push({
            'answer': 'Incorrect',
            'question_no':i,
          });
        }
      }
    }
  }

  decodeCorrectAnswer(correctAnswer: string) {
    return atob(correctAnswer);
  }

  onOptionChange(optionId: number) {
    this.selectedOptionList[this.categoryPointer].selectedOption[
      this.quesPointer
    ] = optionId;
  }

  isSelected(optionId: number): boolean {
    return (
      this.selectedOptionList[this.categoryPointer].selectedOption[
        this.quesPointer
      ] === optionId
    );
  }
}
