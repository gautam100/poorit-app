import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})

export class TimerComponent implements OnInit, OnDestroy {

  private totalSeconds: number = 60 * 60; // 20 minutes
  minutes: number = 60;
  seconds: number = 0;
  isTimeExpired: boolean = false;
  
  private timerSubscription: Subscription | null = null;

  get formattedTime(): string {
    const paddedMinutes = this.minutes.toString().padStart(2, '0');
    const paddedSeconds = this.seconds.toString().padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        this.minutes = Math.floor(this.totalSeconds / 60);
        this.seconds = this.totalSeconds % 60;
      } else {
        this.onTimerExpired();
      }
    });
  }

  private stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private onTimerExpired() {
    this.isTimeExpired = true;
    this.stopTimer();
    this.submitExam();
  }

  private submitExam() {
    // Implement exam submission logic
    console.log('Exam time expired. Submitting automatically.');
    // You might want to call a service method to handle exam submission
  }
}
