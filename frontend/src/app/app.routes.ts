import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component')
            .then(m => m.HomeComponent),
        title: 'Home - Portfolio',
        data: {
            description: 'Welcome to my portfolio - Web Developer & Software Engineer',
            keywords: 'portfolio, web developer, software engineer, home',
            preload: true,
            refreshData: true
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component')
            .then(m => m.AboutComponent),
        title: 'About Me - Portfolio',
        data: {
            description: 'Learn more about my background, experience and skills as a developer',
            keywords: 'about, experience, background, developer, skills',
            preload: true,
            refreshData: true
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects.component')
            .then(m => m.ProjectsComponent),
        title: 'Projects Portfolio',
        data: {
            description: 'Explore my portfolio of web development projects and applications',
            keywords: 'projects, portfolio, web development, applications, showcase',
            preload: true,
            refreshData: true
        },
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'projects/:id',
        loadComponent: () => import('./pages/projects/projects.component')
            .then(m => m.ProjectsComponent),
        title: 'Project Details',
        data: {
            description: 'View detailed information about this project',
            keywords: 'project details, case study, development process',
            preload: false,
            refreshData: true
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'skills',
        loadComponent: () => import('./pages/skills/skills.component')
            .then(m => m.SkillsComponent),
        title: 'Skills & Technologies - Portfolio',
        data: {
            description: 'My technical skills, technologies I work with and expertise areas',
            keywords: 'skills, technologies, expertise, programming languages, frameworks',
            preload: true,
            refreshData: true
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component')
            .then(m => m.ContactComponent),
        title: 'Contact Me - Portfolio',
        data: {
            description: 'Get in touch with me for projects, collaborations or opportunities',
            keywords: 'contact, hire, collaboration, projects, opportunities',
            preload: true,
            refreshData: true
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'hire-me',
        loadComponent: () => import('./components/hire-me/hire-me.component')
            .then(m => m.HireMeComponent),
        title: 'Hire Me - Available for Projects',
        data: {
            description: 'I am available for freelance projects and full-time opportunities',
            keywords: 'hire, freelance, full-time, available, projects, opportunities',
            preload: false,
            refreshData: true
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'terms',
        loadComponent: () => import('./pages/terms/terms.component')
            .then(m => m.TermsComponent),
        title: 'Terms of Service',
        data: {
            description: 'Terms of service and usage conditions for this website',
            keywords: 'terms, service, conditions, legal',
            preload: false,
            refreshData: false
        }
    },
    {
        path: 'privacy',
        loadComponent: () => import('./pages/privacy/privacy.component')
            .then(m => m.PrivacyComponent),
        title: 'Privacy Policy',
        data: {
            description: 'Privacy policy and data protection information',
            keywords: 'privacy, policy, data protection, GDPR',
            preload: false,
            refreshData: false
        }
    },

    // Redirect paths for common variations
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'portfolio',
        redirectTo: '/projects',
        pathMatch: 'full'
    },
    {
        path: 'work',
        redirectTo: '/projects',
        pathMatch: 'full'
    },

    // 404 Handler - MUST be last
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component')
            .then(m => m.NotFoundComponent).catch(() =>
                import('./pages/home/home.component').then(m => m.HomeComponent)
            ),
        title: 'Page Not Found - 404',
        data: {
            description: 'The page you are looking for does not exist',
            keywords: '404, not found, error',
            preload: false,
            refreshData: false
        }
    }
];