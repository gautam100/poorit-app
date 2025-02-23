import { Component,HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from '../components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Poorit - Exam Portal';
/*
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.preventDefault();
    $event.returnValue = 'Do you really want to close?';
  }
  @HostListener('window:blur', ['$event'])
  onWindowBlur($event: FocusEvent): void {
    alert('Warning! Please do not switch tabs or windows during the exam.');
  }
  @HostListener('window:focus', ['$event'])
  onWindowFocus($event: FocusEvent): void {
    console.log('Window is in focus');
  }
  @HostListener('document:contextmenu', ['$event'])
  onRightClick($event: MouseEvent): void {
    $event.preventDefault();
  }*/

}
