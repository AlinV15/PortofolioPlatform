import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Music, Hand } from 'lucide-angular';
import { KeyStats } from '../../shared/models/personal.interface';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  readonly musicIcon = Music;
  readonly handIcon = Hand;

  @Input() keyStats: KeyStats = {
    certificates: 0,
    educationYears: 0,
    technologies: 0,
    projects: 0
  }
}