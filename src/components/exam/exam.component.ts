import { Component } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [TimerComponent, CommonModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent {
  data: any[] = [
    [
      {
        index: 0,
        categoryId: 5,
        category: 'Cloud',
        subCategoryId: 6,
        subCategory: 'AWS',
        questionId: 11,
        question: 'What is RDS service in AWS?',
        options: [
          {
            optionId: 201,
            option: 'It is a NO-SQL database service of AWS',
          },
          {
            optionId: 202,
            option: 'It is a RDBMS service of AWS',
          },
          {
            optionId: 203,
            option: 'It is a container service of AWS',
          },
          {
            optionId: 204,
            option: 'It is a Load-balancer service',
          },
        ],
        correctAnswer: '201',
      },
      {
        index: 1,
        categoryId: 5,
        category: 'Cloud',
        subCategoryId: 6,
        subCategory: 'AWS',
        questionId: 12,
        question: 'What is EC2 service in AWS?',
        options: [
          {
            optionId: 205,
            option: 'It is used to create K8S in AWS',
          },
          {
            optionId: 206,
            option:
              'It is security feature to prvent DDOS and brut droce attack.',
          },
          {
            optionId: 207,
            option: 'It is a Virtual Machine or server of AWS',
          },
          {
            optionId: 208,
            option: 'It is used to create Load-balancers in server',
          },
        ],
        correctAnswer: '207',
      },
      {
        index: 2,
        categoryId: 5,
        category: 'Cloud',
        subCategoryId: 6,
        subCategory: 'AWS',
        questionId: 13,
        question: 'What is IAAS in Cloud?',
        options: [
          {
            optionId: 209,
            option: 'It is used to provide on-demand storage',
          },
          {
            optionId: 210,
            option: 'It is used to provide on-demand networking',
          },
          {
            optionId: 211,
            option: 'It is used to provide on-demand virtualization',
          },
          {
            optionId: 212,
            option: 'All Of the above',
          },
        ],
        correctAnswer: '212',
      },
    ],
    [
      {
        index: 0,
        categoryId: 6,
        category: 'DevOps',
        subCategoryId: 9,
        subCategory: 'K8S',
        questionId: 21,
        question:
          'Which of the below is/are container orchestration technologies?',
        options: [
          {
            optionId: 301,
            option: 'Docker Swarn',
          },
          {
            optionId: 302,
            option: 'Mesos',
          },
          {
            optionId: 303,
            option: 'Kubernetes',
          },
          {
            optionId: 304,
            option: 'All of these',
          },
        ],
        correctAnswer: '304',
      },
      {
        index: 1,
        categoryId: 6,
        category: 'DevOps',
        subCategoryId: 9,
        subCategory: 'K8S',
        questionId: 21,
        question: 'Which of the below are container runtimes?',
        options: [
          {
            optionId: 305,
            option: 'CRI-O',
          },
          {
            optionId: 306,
            option: 'Containerd',
          },
          {
            optionId: 307,
            option: 'Docker-Engine',
          },
          {
            optionId: 308,
            option: 'All of these',
          },
        ],
        correctAnswer: '308',
      },
    ],
  ];

  //totalCategory: number;
  categoryPointer: number = 0;
  quesPointer: number = 0;
  isTestFinish: boolean = false;

  constructor() {
    console.log(`In constructor ${this.data.length}`);
    //this.totalCategory = this.data.length;
  }
  ngOnInit() {
    console.log('In ngOnInit');
  }
  nextQuestion() {
    if (this.categoryPointer == this.data.length - 1) {
      if(this.quesPointer == this.data[this.categoryPointer].length - 1) {
        console.log("Test Completed");
        this.isTestFinish = true;
        return;
      }
    }
    // Logic to change Category and Question on next button click
    if (this.data[this.categoryPointer].length == this.quesPointer + 1) {
      this.categoryPointer += 1;
      this.quesPointer = 0;
    } else {
      this.quesPointer += 1;
    }
  }
  skipQuestion() {

  }
}
