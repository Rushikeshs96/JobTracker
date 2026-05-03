import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private themeService: ThemeService,
  ) {}

  // This getter helps the HTML decide which icon to show
  get isDarkMode(): boolean {
    return this.themeService.getTheme() === 'dark';
  }

  // This is called when the button is clicked
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToJobApplications() {
    this.router.navigate(['/jobs']);
  }

  naviagateToNewJob() {
    this.router.navigate(['/jobs/new']);
  }

  naviagateToContacts() {
    this.router.navigate(['/contacts']);
  }

  naviagateToInterviews() {
    this.router.navigate(['/interviews']);
  }

  naviagateTostripeSession() {
    this.router.navigate(['/stripe-session']);
  }
}
