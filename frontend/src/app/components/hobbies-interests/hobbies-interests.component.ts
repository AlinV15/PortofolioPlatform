import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Crown, Zap, BookOpen, Laptop, Globe, Rocket, Bot, Lightbulb, Leaf, Handshake, Brain, TrendingUp, Users, Palette, Briefcase, Target, Heart, HelpCircle, Search, Compass, Puzzle, Scale, Dot, Plus, LucideIconData } from 'lucide-angular';

interface Hobby {
  id: number;
  name: string;
  description: string;
  icon: LucideIconData;
  category: 'intellectual' | 'physical' | 'creative' | 'social' | 'technical';
  years_active: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  related_skills: string[];
  impact_on_work: string;
  favorite_aspect: string;
  achievements?: string[];
}

interface Interest {
  id: number;
  name: string;
  description: string;
  icon: LucideIconData;
  category: 'learning' | 'technology' | 'culture' | 'entertainment';
  why_interested: string;
  recent_discoveries: string[];
}

interface PersonalityTrait {
  trait: string;
  description: string;
  icon: LucideIconData;
  examples: string[];
}

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
  hobbies: Hobby[] = [
    {
      id: 1,
      name: 'Chess',
      description: 'Strategic thinking through chess develops analytical mindset and long-term planning skills that directly translate to programming and problem-solving.',
      icon: this.icons.chess,
      category: 'intellectual',
      years_active: 8,
      level: 'advanced',
      related_skills: ['Strategic Thinking', 'Pattern Recognition', 'Problem Solving', 'Planning', 'Decision Making'],
      impact_on_work: 'Chess has significantly improved my ability to think several steps ahead in software architecture and anticipate potential issues before they arise.',
      favorite_aspect: 'The combination of tactical calculations and strategic planning mirrors the complexity of software development.',
      achievements: ['Participated in university chess tournaments', 'Consistent strategic mindset development']
    },
    {
      id: 2,
      name: 'Team Sports',
      description: 'Active participation in team sports builds collaboration, communication, and leadership skills essential for effective teamwork in development projects.',
      icon: this.icons.teamSports,
      category: 'physical',
      years_active: 10,
      level: 'intermediate',
      related_skills: ['Teamwork', 'Communication', 'Leadership', 'Time Management', 'Stress Management'],
      impact_on_work: 'Team sports experience helps me collaborate effectively in development teams and handle project pressure with composure.',
      favorite_aspect: 'The coordination required in team play directly applies to coordinating with development teams.',
      achievements: ['Team captain experience', 'Improved physical and mental resilience']
    },
    {
      id: 3,
      name: 'Literature Study',
      description: 'Deep engagement with specialized literature enhances analytical thinking, research skills, and the ability to synthesize complex information.',
      icon: this.icons.literature,
      category: 'intellectual',
      years_active: 6,
      level: 'advanced',
      related_skills: ['Critical Thinking', 'Research', 'Analysis', 'Writing', 'Communication'],
      impact_on_work: 'Literature study sharpens my ability to understand complex technical documentation and communicate ideas clearly.',
      favorite_aspect: 'The process of analyzing complex narratives and themes develops structured thinking.',
      achievements: ['Enhanced French language skills through francophone literature', 'Improved technical writing abilities']
    },
    {
      id: 4,
      name: 'Technology Exploration',
      description: 'Continuous exploration of new technologies, frameworks, and development methodologies to stay current with industry trends.',
      icon: this.icons.technology,
      category: 'technical',
      years_active: 4,
      level: 'advanced',
      related_skills: ['Learning Agility', 'Research', 'Experimentation', 'Innovation', 'Adaptation'],
      impact_on_work: 'Keeps me updated with the latest development tools and best practices, directly benefiting my projects.',
      favorite_aspect: 'The excitement of discovering new solutions to old problems and implementing cutting-edge technologies.',
      achievements: ['7+ personal projects using modern tech stacks', 'Continuous learning mindset']
    },
    {
      id: 5,
      name: 'Language Learning',
      description: 'Active development of French and English language skills, enhancing communication abilities and cultural understanding.',
      icon: this.icons.language,
      category: 'intellectual',
      years_active: 5,
      level: 'intermediate',
      related_skills: ['Communication', 'Cultural Awareness', 'Patience', 'Discipline', 'Memory'],
      impact_on_work: 'Multilingual abilities enable better collaboration with international teams and access to global resources.',
      favorite_aspect: 'Opening doors to different cultures and expanding professional opportunities.',
      achievements: ['French B1-B2 proficiency', 'English A2-B1 proficiency', 'Active in francophone community']
    },
    {
      id: 6,
      name: 'Project Building',
      description: 'Creating personal coding projects and applications as a creative outlet and skill development practice.',
      icon: this.icons.projects,
      category: 'creative',
      years_active: 3,
      level: 'advanced',
      related_skills: ['Creativity', 'Problem Solving', 'Project Management', 'Innovation', 'Persistence'],
      impact_on_work: 'Personal projects allow me to experiment with new technologies and develop innovative solutions.',
      favorite_aspect: 'The satisfaction of building something from scratch and seeing it come to life.',
      achievements: ['7+ completed full-stack projects', 'Multiple projects deployed to production']
    }
  ];

  // Current interests and areas of exploration
  interests: Interest[] = [
    {
      id: 1,
      name: 'Artificial Intelligence & Machine Learning',
      description: 'Fascinated by the potential of AI to transform industries and solve complex problems.',
      icon: this.icons.ai,
      category: 'technology',
      why_interested: 'AI represents the future of technology and offers unlimited potential for innovation and problem-solving.',
      recent_discoveries: [
        'Large Language Models and their applications',
        'AI-powered development tools and workflows',
        'Machine learning integration in web applications'
      ]
    },
    {
      id: 2,
      name: 'Entrepreneurship & Innovation',
      description: 'Interested in how technology can be leveraged to create innovative business solutions.',
      icon: this.icons.innovation,
      category: 'learning',
      why_interested: 'Combining technical skills with business understanding to create meaningful impact.',
      recent_discoveries: [
        'Startup ecosystems and venture capital',
        'Product development methodologies',
        'Technology commercialization strategies'
      ]
    },
    {
      id: 3,
      name: 'Sustainable Technology',
      description: 'Exploring how technology can contribute to environmental sustainability and social impact.',
      icon: this.icons.sustainability,
      category: 'technology',
      why_interested: 'Technology should be used to solve global challenges and create a better future.',
      recent_discoveries: [
        'Green software development practices',
        'Energy-efficient coding techniques',
        'Technology for climate change solutions'
      ]
    },
    {
      id: 4,
      name: 'Cultural Exchange',
      description: 'Engaging with different cultures through language, literature, and international collaboration.',
      icon: this.icons.culture,
      category: 'culture',
      why_interested: 'Cultural diversity enriches perspective and enhances creativity and problem-solving.',
      recent_discoveries: [
        'Francophone business practices and opportunities',
        'International development methodologies',
        'Cross-cultural communication in tech teams'
      ]
    }
  ];

  // Personality traits that define approach to life and work
  personalityTraits: PersonalityTrait[] = [
    {
      trait: 'Analytical Mindset',
      description: 'Approaching problems systematically with logical thinking and structured analysis.',
      icon: this.icons.analytical,
      examples: ['Chess strategy development', 'Code architecture planning', 'Problem decomposition']
    },
    {
      trait: 'Continuous Learner',
      description: 'Always seeking to expand knowledge and stay updated with latest developments.',
      icon: this.icons.learner,
      examples: ['Learning new programming languages', 'Obtaining certifications', 'Reading technical literature']
    },
    {
      trait: 'Team Collaborator',
      description: 'Working effectively with others and contributing positively to group dynamics.',
      icon: this.icons.collaborator,
      examples: ['Team sports participation', 'Group project coordination', 'Volunteer leadership roles']
    },
    {
      trait: 'Creative Problem Solver',
      description: 'Finding innovative solutions to complex challenges through creative thinking.',
      icon: this.icons.creative,
      examples: ['Unique project implementations', 'Creative coding solutions', 'Innovative approaches to challenges']
    }
  ];

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

  // Track by functions
  trackByHobby(index: number, hobby: Hobby): number {
    return hobby.id;
  }

  trackByInterest(index: number, interest: Interest): number {
    return interest.id;
  }

  trackByTrait(index: number, trait: PersonalityTrait): string {
    return trait.trait;
  }

  trackByString(index: number, item: string): string {
    return item;
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
}