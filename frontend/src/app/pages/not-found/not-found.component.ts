import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Page Not Found</h1>
        <p class="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div class="suggested-links">
          <h3>Try these instead:</h3>
          <ul>
            <li><a (click)="navigateTo('/')" class="nav-link">🏠 Home</a></li>
            <li><a (click)="navigateTo('/projects')" class="nav-link">💼 Projects</a></li>
            <li><a (click)="navigateTo('/about')" class="nav-link">👨‍💻 About Me</a></li>
            <li><a (click)="navigateTo('/skills')" class="nav-link">🛠️ Skills</a></li>
            <li><a (click)="navigateTo('/contact')" class="nav-link">📧 Contact</a></li>
          </ul>
        </div>
        
        <div class="action-buttons">
          <button 
            (click)="goBack()" 
            class="btn btn-secondary"
            [disabled]="!canInteract">
            ← Go Back
          </button>
          <button 
            (click)="navigateTo('/')" 
            class="btn btn-primary">
            🏠 Home Page
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .not-found-content {
      text-align: center;
      max-width: 600px;
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 3rem 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .error-code {
      font-size: 8rem;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #fff, #f0f0f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .error-message {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .suggested-links {
      margin: 2rem 0;
      text-align: left;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .suggested-links h3 {
      margin-bottom: 1rem;
      font-size: 1.3rem;
      text-align: center;
    }

    .suggested-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .suggested-links li {
      margin-bottom: 0.75rem;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-size: 1.1rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      display: inline-block;
      width: 100%;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(5px);
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .not-found-content {
        padding: 2rem 1rem;
      }

      .error-code {
        font-size: 6rem;
      }

      h1 {
        font-size: 2rem;
      }

      .error-message {
        font-size: 1rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .error-code {
        font-size: 4rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .not-found-container {
        padding: 1rem 0.5rem;
      }
    }
  `]
})
export class NotFoundComponent implements OnInit {
  private isBrowser: boolean;

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.setupSEO();
  }

  get canInteract(): boolean {
    return this.isBrowser;
  }

  private setupSEO(): void {
    this.title.setTitle('Page Not Found - 404 | Portfolio');

    this.meta.addTags([
      { name: 'description', content: 'The page you are looking for does not exist. Explore other sections of my portfolio.' },
      { name: 'keywords', content: '404, not found, error, portfolio' },
      { name: 'robots', content: 'noindex, nofollow' }, // Don't index 404 pages
      { property: 'og:title', content: 'Page Not Found - 404' },
      { property: 'og:description', content: 'The page you are looking for does not exist.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Page Not Found - 404' },
      { name: 'twitter:description', content: 'The page you are looking for does not exist.' }
    ]);
  }

  navigateTo(path: string): void {
    if (this.isBrowser) {
      this.router.navigate([path]);
    }
  }

  goBack(): void {
    if (this.isBrowser && window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateTo('/');
    }
  }
}