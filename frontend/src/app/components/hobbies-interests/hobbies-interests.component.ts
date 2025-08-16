import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Crown, Zap, BookOpen, Laptop, Globe, Rocket, Bot, Lightbulb, Leaf, Handshake, Brain, TrendingUp, Users, Palette, Briefcase, Target, Heart, HelpCircle, Search, Compass, Puzzle, Scale, Dot, Plus, LucideIconData } from 'lucide-angular';
import { Hobby, Interest, PersonalityTrait } from '../../shared/models/personal.interface';
import { IconHelperService } from '../../services/icon-helper.service';



@Component({
  selector: 'app-hobbies-interests',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './hobbies-interests.component.html',
  styleUrls: ['./hobbies-interests.component.css']
})
export class HobbiesInterestsComponent {

  // Icon variables for Lucide icons
  readonly icons = {
    // Hobby icons 
    chess: Crown,
    teamSports: Zap,
    literature: BookOpen,
    technology: Laptop,
    language: Globe,
    projects: Rocket,

    // Interest icons
    ai: Bot,
    innovation: Lightbulb,
    sustainability: Leaf,
    culture: Handshake,

    // Personality trait icons
    analytical: Brain,
    learner: TrendingUp,
    collaborator: Users,
    creative: Palette,

    // Section icons
    work: Briefcase,
    skills: Target,
    heart: Heart,
    thinking: HelpCircle,
    search: Search,
    beliefs: Compass,
    puzzle: Puzzle,
    balance: Scale,

    // UI icons
    dot: Dot,
    plus: Plus
  };

  // Hobbies based on CV info and logical extensions
  @Input() hobbies: Hobby[] = [];

  // Current interests and areas of exploration
  @Input() interests: Interest[] = []

  // Personality traits that define approach to life and work
  @Input() personalityTraits: PersonalityTrait[] = [];

  // Personal philosophy and approach
  personalPhilosophy = {
    main_quote: "I constantly develop an analytical and strategic mindset through the unique combination of studying specialized literature, practicing chess, and engaging in team sports.",
    core_beliefs: [
      'Technology should serve humanity and solve real problems',
      'Continuous learning is essential for personal and professional growth',
      'Collaboration and teamwork amplify individual capabilities',
      'Strategic thinking and planning lead to better outcomes'
    ],
    approach_to_challenges: 'I approach challenges with a combination of analytical thinking from chess, collaborative spirit from team sports, and deep research from literature study.',
    work_life_balance: 'Balancing intellectual pursuits with physical activities and social engagement creates a well-rounded foundation for professional success.'
  };

  constructor(private iconHelper: IconHelperService) {

  }

  // Track by functions


  trackByTrait(index: number, trait: PersonalityTrait): string {
    return trait.trait;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  trackByHobby(index: number, item: Hobby) {
    return item.id;
  }

  trackByInterest(index: number, item: Interest) {
    return item.id;
  }

  // Get category styling
  getCategoryClass(category: string): string {
    const classes = {
      'intellectual': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'physical': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'creative': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'social': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'technical': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'learning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'culture': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'entertainment': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[category as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  // Get level styling
  getLevelClass(level: string): string {
    const classes = {
      'beginner': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'advanced': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return classes[level as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  // Handle hobby interaction
  onHobbyClick(hobby: Hobby): void {
    console.log(`Hobby clicked: ${hobby.name}`);
  }

  onInterestClick(interest: Interest): void {
    console.log(`Interest clicked: ${interest.name}`);
  }

  stringToFontAwesome(iconString: string) {
    return this.iconHelper.stringToFontAwesome(iconString);
  }

  stringToLucide(icoString: string) {
    return this.iconHelper.stringToLucide(icoString);
  }
}