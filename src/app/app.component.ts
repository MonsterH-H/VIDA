import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AppHeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'VIDA';
  darkMode = false;

  constructor(
    private renderer: Renderer2,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // S'abonner au service de thème
    this.themeService.darkMode$.subscribe(isDarkMode => {
      this.darkMode = isDarkMode;
      this.applyTheme();
    });
    
    // Initialiser le thème
    this.themeService.initTheme();
  }
  
  private applyTheme(): void {
    // Appliquer la classe au document body
    if (this.darkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
    
    // Mettre à jour la meta theme-color pour les navigateurs mobiles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      this.renderer.setAttribute(
        metaThemeColor, 
        'content', 
        this.darkMode ? '#121212' : '#ffffff'
      );
    }
  }
}
