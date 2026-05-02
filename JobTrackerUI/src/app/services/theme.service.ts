import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeKey = 'selected-theme';

  constructor() {
    // 1. When the app starts, check localStorage for a saved preference
    const savedTheme = localStorage.getItem(this.themeKey) || 'light';
    this.applyTheme(savedTheme);
  }

  // 2. This applies the theme to the HTML tag (Bootstrap 5.3 style)
  private applyTheme(theme: string) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(this.themeKey, theme);
  }

  // 3. Get the current theme name
  getTheme(): string {
    return localStorage.getItem(this.themeKey) || 'light';
  }

  // 4. Switch between light and dark
  toggleTheme() {
    const newTheme = this.getTheme() === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
}
