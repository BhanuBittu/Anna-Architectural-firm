import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="header-content">
          <div class="brand">
            <h1>Anna's Architectural Firm</h1>
            <p>Client Management System</p>
          </div>
          <nav class="nav">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📊</span>
              Dashboard
            </a>
            <a routerLink="/clients" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">👥</span>
              Clients
            </a>
            <a routerLink="/meetings" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📅</span>
              Meetings
            </a>
          </nav>
        </div>
      </header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="footer">
        <p>&copy; 2024 Anna's Architectural Firm. Developed by Henna Solutions.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f8f9fa;
    }

    .header {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .brand p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
      font-weight: 300;
    }

    .nav {
      display: flex;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }

    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    .nav-icon {
      font-size: 1.1rem;
    }

    .main-content {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      width: 100%;
    }

    .footer {
      background-color: #2c3e50;
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: auto;
    }

    .footer p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .nav {
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }

      .main-content {
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .brand h1 {
        font-size: 1.2rem;
      }

      .nav-link {
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem;
        font-size: 0.8rem;
      }

      .nav-icon {
        font-size: 1.2rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Client Management System';
}
