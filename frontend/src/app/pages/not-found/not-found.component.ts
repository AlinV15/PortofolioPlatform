import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: "not-found.component.html",
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