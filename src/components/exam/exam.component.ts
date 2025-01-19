import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from '../timer/timer.component';
import { CommonModule } from '@angular/common';
import { ExamManagementService } from '../../services/exam-management.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [FormsModule, TimerComponent, CommonModule, LoaderComponent],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent {
  data: any[] = [
    // [
    //   {
    //     index: 1,
    //     categoryId: 5,
    //     category: 'Cloud',
    //     subCategoryId: 6,
    //     subCategory: 'AWS',
    //     questionId: 12,
    //     question: 'What is EC2 service in AWS?',
    //     options: [
    //       {
    //         optionId: 205,
    //         option: 'It is used to create K8S in AWS',
    //       },
    //       {
    //         optionId: 206,
    //         option:
    //           'It is security feature to prvent DDOS and brut droce attack.',
    //       },
    //       {
    //         optionId: 207,
    //         option: 'It is a Virtual Machine or server of AWS',
    //       },
    //       {
    //         optionId: 208,
    //         option: 'It is used to create Load-balancers in server',
    //       },
    //     ],
    //     correctAnswer: '207',
    //   },
    //   {
    //     index: 2,
    //     categoryId: 5,
    //     category: 'Cloud',
    //     subCategoryId: 6,
    //     subCategory: 'AWS',
    //     questionId: 13,
    //     question: 'What is IAAS in Cloud?',
    //     options: [
    //       {
    //         optionId: 209,
    //         option: 'It is used to provide on-demand storage',
    //       },
    //       {
    //         optionId: 210,
    //         option: 'It is used to provide on-demand networking',
    //       },
    //       {
    //         optionId: 211,
    //         option: 'It is used to provide on-demand virtualization',
    //       },
    //       {
    //         optionId: 212,
    //         option: 'All Of the above',
    //       },
    //     ],
    //     correctAnswer: '212',
    //   },
    // ],
    // [
    //   {
    //     index: 0,
    //     categoryId: 6,
    //     category: 'DevOps',
    //     subCategoryId: 9,
    //     subCategory: 'K8S',
    //     questionId: 21,
    //     question:
    //       'Which of the below is/are container orchestration technologies?',
    //     options: [
    //       {
    //         optionId: 301,
    //         option: 'Docker Swarn',
    //       },
    //       {
    //         optionId: 302,
    //         option: 'Mesos',
    //       },
    //       {
    //         optionId: 303,
    //         option: 'Kubernetes',
    //       },
    //       {
    //         optionId: 304,
    //         option: 'All of these',
    //       },
    //     ],
    //     correctAnswer: '304',
    //   },
    //   {
    //     index: 1,
    //     categoryId: 6,
    //     category: 'DevOps',
    //     subCategoryId: 9,
    //     subCategory: 'K8S',
    //     questionId: 21,
    //     question: 'Which of the below are container runtimes?',
    //     options: [
    //       {
    //         optionId: 305,
    //         option: 'CRI-O',
    //       },
    //       {
    //         optionId: 306,
    //         option: 'Containerd',
    //       },
    //       {
    //         optionId: 307,
    //         option: 'Docker-Engine',
    //       },
    //       {
    //         optionId: 308,
    //         option: 'All of these',
    //       },
    //     ],
    //     correctAnswer: '308',
    //   },
    // ],
  ];
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
  isTestFinish: boolean = false;

  constructor(private examService: ExamManagementService) {
  }

  ngOnInit() {
    this.examService.getCategories().subscribe((response) => {
      console.log(response);
      this.categories = response.categories;
      this.loaderCategory = false;
      if (this.categories.length > 0){
        this.currentCategory = this.categories[0];
        //User's answers will be save in resultArray category wise.
        for(let category of this.categories){
          this.resultArray.push({
            category: category.cat_name,
            answers: [],
          })
        }
        //console.log(this.resultArray);
      }else{
        console.log("No Categories Found in Database");
        this.categoryError = true;
      }
    });
    
    this.examService.getQuestions().subscribe((response) => {
      console.log(response);
      this.questions = response.questions;
      this.loaderQuestion = false;
      this.totalQuestions = this.questions.length;
      if(this.totalQuestions > 0){
        this.currentQuestion = this.questions[this.quesPointer];
      }else{
        console.log("No Questions Found in Database for the selected category");
        this.QuestionError = true;
      }
    });
  }
  nextQuestion() {
    //Check if the last question of the last category is reached
    if (this.categoryPointer == this.categories.length - 1) {
      if(this.quesPointer == this.questions.length - 1) {
        console.log("Test Completed");
        this.isTestFinish = true;
        return;
      }
    }

    // Logic to change Category and Question on next button click
    if (this.quesPointer < this.totalQuestions-1) {
      //Check if the selected option is correct or not
      if(Number(this.decodeCorrectAnswer(this.questions[this.quesPointer].correct_answer)) == this.selectedOptions){
        this.score += 1;
        //Push the correct answer in resultArray
        this.resultArray[this.categoryPointer].answers.push({
          [this.quesPointer]: "Correct"
        });
      }else{
        //Push the incorrect answer in resultArray
        this.resultArray[this.categoryPointer].answers.push({
          [this.quesPointer]: "Incorrect"
        });
      }
      this.quesPointer += 1; //Increment the question pointer
      this.currentQuestion = this.questions[this.quesPointer];
      this.selectedOptions = 0; //Reset the selected option
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
