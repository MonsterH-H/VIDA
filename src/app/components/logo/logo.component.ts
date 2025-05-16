import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="logo-container" [ngClass]="{'dark-theme': darkMode()}">
      <div class="logo-icon">
        <mat-icon>eco</mat-icon>
      </div>
      <div class="logo-text">
        <span class="app-name">VIDA</span>
        <span class="app-tagline">Météo Agricole</span>
      </div>
    </div>
  `,
  styles: [`
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 12px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        .logo-icon {
          transform: rotate(5deg) scale(1.05);
        }
      }
      
      .logo-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        color: white;
        font-size: 24px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
        
        .logo-svg {
          width: 28px;
          height: 28px;
          object-fit: contain;
        }
      }
      
      .logo-text {
        display: flex;
        flex-direction: column;
        
        .app-name {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 1.2;
        }
        
        .app-tagline {
          font-size: 0.8rem;
          color: #666;
          margin-top: 2px;
        }
      }
      
      &.dark-theme {
        .logo-icon {
          background: linear-gradient(135deg, #81C784, #4CAF50);
          box-shadow: 0 4px 12px rgba(129, 199, 132, 0.3);
        }
        
        .logo-text {
          .app-name {
            background: linear-gradient(135deg, #81C784, #4CAF50);
            -webkit-background-clip: text;
            background-clip: text;
          }
          
          .app-tagline {
            color: #aaa;
          }
        }
      }
    }
  `]
})
export class LogoComponent {
  readonly darkMode = input(false);
}