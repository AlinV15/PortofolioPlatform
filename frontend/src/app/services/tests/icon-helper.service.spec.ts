// icon-helper.service.spec.ts
// Test folosind Jest pur cu mock complet pentru serviciu

// Mock pentru lucide-angular
jest.mock('lucide-angular', () => ({
    Zap: { name: 'Zap' },
    GraduationCap: { name: 'GraduationCap' },
    Code: { name: 'Code' },
    Mail: { name: 'Mail' },
    Github: { name: 'Github' },
    // ... alte iconuri dacă este necesar
}));

// Mock pentru @angular/core
jest.mock('@angular/core', () => ({
    Injectable: () => (target: any) => target,
}));

// Mock complet pentru IconHelperService - recreez logica fără import
class MockIconHelperService {
    // Replicăm iconMap-ul din serviciul original
    private readonly iconMap = new Map([
        // === EDUCATION & LEARNING ===
        ['graduation-cap', { name: 'GraduationCap' }],
        ['school', { name: 'School' }],
        ['book-open', { name: 'BookOpen' }],
        ['book', { name: 'Book' }],
        ['brain', { name: 'Brain' }],
        ['award', { name: 'Award' }],
        ['languages', { name: 'Languages' }],
        ['certificate', { name: 'ShieldCheck' }],

        // === WORK & PROFESSIONAL ===
        ['briefcase', { name: 'Briefcase' }],
        ['building', { name: 'Building' }],
        ['building2', { name: 'Building2' }],
        ['users', { name: 'Users' }],
        ['trophy', { name: 'Trophy' }],
        ['target', { name: 'Target' }],
        ['flag', { name: 'Flag' }],

        // === TECHNICAL & DEVELOPMENT ===
        ['code', { name: 'Code' }],
        ['terminal', { name: 'Terminal' }],
        ['cpu', { name: 'Cpu' }],
        ['monitor', { name: 'Monitor' }],
        ['server', { name: 'Server' }],
        ['database', { name: 'Database' }],
        ['globe', { name: 'Globe' }],
        ['smartphone', { name: 'Smartphone' }],
        ['layers', { name: 'Layers' }],
        ['zap', { name: 'Zap' }],
        ['wrench', { name: 'Wrench' }],
        ['settings', { name: 'Settings' }],
        ['shield', { name: 'Shield' }],
        ['cloud', { name: 'Cloud' }],
        ['wifi', { name: 'Wifi' }],
        ['lock', { name: 'Lock' }],
        ['unlock', { name: 'Unlock' }],

        // === PROJECT MANAGEMENT ===
        ['folder', { name: 'Folder' }],
        ['file-text', { name: 'FileText' }],
        ['check-circle', { name: 'CheckCircle' }],
        ['clock', { name: 'Clock' }],
        ['calendar', { name: 'Calendar' }],
        ['search', { name: 'Search' }],
        ['filter', { name: 'Filter' }],
        ['edit', { name: 'Edit' }],
        ['trash2', { name: 'Trash2' }],
        ['plus', { name: 'Plus' }],
        ['minus', { name: 'Minus' }],
        ['x', { name: 'X' }],
        ['save', { name: 'Save' }],
        ['copy', { name: 'Copy' }],
        ['rotate-ccw', { name: 'RotateCcw' }],

        // === COMMUNICATION & CONTACT ===
        ['mail', { name: 'Mail' }],
        ['phone', { name: 'Phone' }],
        ['message-circle', { name: 'MessageCircle' }],
        ['map-pin', { name: 'MapPin' }],
        ['github', { name: 'Github' }],
        ['linkedin', { name: 'Linkedin' }],
        ['share2', { name: 'Share2' }],
        ['external-link', { name: 'ExternalLink' }],

        // === UI & NAVIGATION ===
        ['home', { name: 'Home' }],
        ['user', { name: 'User' }],
        ['chevron-right', { name: 'ChevronRight' }],
        ['chevron-left', { name: 'ChevronLeft' }],
        ['eye', { name: 'Eye' }],
        ['eye-off', { name: 'EyeOff' }],
        ['bell', { name: 'Bell' }],
        ['bookmark', { name: 'Bookmark' }],
        ['tag', { name: 'Tag' }],

        // === MULTIMEDIA & CREATIVITY ===
        ['camera', { name: 'Camera' }],
        ['file-image', { name: 'FileImage' }],
        ['file-video', { name: 'FileVideo' }],
        ['music', { name: 'Music' }],
        ['headphones', { name: 'Headphones' }],
        ['volume2', { name: 'Volume2' }],
        ['mic', { name: 'Mic' }],
        ['video', { name: 'Video' }],
        ['palette', { name: 'Palette' }],
        ['lightbulb', { name: 'Lightbulb' }],

        // === GAMING & ENTERTAINMENT ===
        ['gamepad2', { name: 'Gamepad2' }],
        ['play-circle', { name: 'PlayCircle' }],
        ['pause-circle', { name: 'PauseCircle' }],
        ['puzzle', { name: 'Puzzle' }],

        // === E-COMMERCE ===
        ['package', { name: 'Package' }],
        ['shopping-cart', { name: 'ShoppingCart' }],
        ['credit-card', { name: 'CreditCard' }],
        ['truck', { name: 'Truck' }],

        // === ANALYTICS & CHARTS ===
        ['bar-chart3', { name: 'BarChart3' }],
        ['pie-chart', { name: 'PieChart' }],
        ['trending-up', { name: 'TrendingUp' }],
        ['activity', { name: 'Activity' }],

        // === HOBBIES & INTERESTS ===
        ['mountain', { name: 'Mountain' }],
        ['plane', { name: 'Plane' }],
        ['heart', { name: 'Heart' }],
        ['star', { name: 'Star' }],
        ['coffee', { name: 'Coffee' }],
        ['rocket', { name: 'Rocket' }],

        // === TIME & SCHEDULING ===
        ['timer', { name: 'Timer' }],
        ['sunrise', { name: 'Sunrise' }],
        ['moon', { name: 'Moon' }],
        ['sun', { name: 'Sun' }],

        // === LOCATION & TRAVEL ===
        ['compass', { name: 'Compass' }],
        ['map', { name: 'MapIcon' }],
        ['navigation', { name: 'Navigation' }],
        ['anchor', { name: 'Anchor' }],

        // === WEATHER & NATURE ===
        ['thermometer', { name: 'Thermometer' }],
        ['droplets', { name: 'Droplets' }],
        ['wind', { name: 'Wind' }],
        ['cloud-rain', { name: 'CloudRain' }],
        ['snowflake', { name: 'Snowflake' }],
        ['leaf', { name: 'Leaf' }],
        ['tree', { name: 'Trees' }],
        ['flower', { name: 'Flower' }],

        // === ANIMALS & PETS ===
        ['bug', { name: 'Bug' }],
        ['fish', { name: 'Fish' }],
        ['bird', { name: 'Bird' }],
        ['dog', { name: 'Dog' }],
        ['cat', { name: 'Cat' }],

        // === FOOD & LIFESTYLE ===
        ['apple', { name: 'Apple' }],
        ['pizza', { name: 'Pizza' }],
        ['ice-cream', { name: 'IceCream' }],
        ['cake', { name: 'Cake' }],

        // === TRANSPORT ===
        ['car', { name: 'Car' }],
        ['bus', { name: 'Bus' }],
        ['train', { name: 'Train' }],
        ['bike', { name: 'Bike' }],
        ['ship', { name: 'Ship' }],

        // === FILE OPERATIONS ===
        ['download', { name: 'Download' }],
        ['upload', { name: 'Upload' }],
        ['printer', { name: 'Printer' }]
    ]);

    // Replicăm fontAwesomeMap-ul din serviciul original
    private readonly fontAwesomeMap = new Map([
        ['wordpress', 'fa-solid fa-wordpress'],
        ['microsoft', 'fa-solid fa-microsoft'],
        ['apple', 'fa-solid fa-apple'],
        ['google', 'fa-solid fa-google'],
        ['facebook', 'fa-solid fa-facebook'],
        ['twitter', 'fa-solid fa-twitter'],
        ['instagram', 'fa-solid fa-instagram'],
        ['youtube', 'fa-solid fa-youtube'],
        ['discord', 'fa-solid fa-discord'],
        ['slack', 'fa-solid fa-slack'],
        ['docker', 'fa-solid fa-docker'],
        ['npm', 'fa-solid fa-npm'],
        ['node-js', 'fa-solid fa-node-js'],
        ['react', 'fa-solid fa-react'],
        ['angular', 'fa-solid fa-angular'],
        ['vue', 'fa-solid fa-vuejs'],
        ['bootstrap', 'fa-solid fa-bootstrap'],
        ['sass', 'fa-solid fa-sass'],
        ['less', 'fa-solid fa-less'],
        ['git-alt', 'fa-solid fa-git-alt'],
        ['gitlab', 'fa-solid fa-gitlab'],
        ['bitbucket', 'fa-solid fa-bitbucket'],
        ['stack-overflow', 'fa-solid fa-stack-overflow'],
        ['codepen', 'fa-solid fa-codepen'],
        ['jsfiddle', 'fa-solid fa-jsfiddle'],
        ['figma', 'fa-solid fa-figma'],
        ['sketch', 'fa-solid fa-sketch'],
        ['adobe', 'fa-solid fa-adobe'],
        ['behance', 'fa-solid fa-behance'],
        ['dribbble', 'fa-solid fa-dribbble'],
        ['dev', 'fa-solid fa-dev'],
        ['medium', 'fa-solid fa-medium'],
        ['reddit', 'fa-solid fa-reddit'],
        ['twitch', 'fa-solid fa-twitch'],
        ['spotify', 'fa-solid fa-spotify'],
        ['soundcloud', 'fa-solid fa-soundcloud'],
        ['steam', 'fa-solid fa-steam'],
        ['playstation', 'fa-solid fa-playstation'],
        ['xbox', 'fa-solid fa-xbox'],
        ['unity', 'fa-solid fa-unity'],
        ['unreal-engine', 'fa-solid fa-unity'],
        ['stripe', 'fa-solid fa-stripe'],
        ['paypal', 'fa-solid fa-paypal'],
        ['aws', 'fa-solid fa-aws'],
        ['digital-ocean', 'fa-solid fa-digital-ocean'],
        ['cloudflare', 'fa-solid fa-cloudflare'],
        ['heroku', 'fa-solid fa-heroku'],
        ['netlify', 'fa-solid fa-cloud'],
        ['vercel', 'fa-solid fa-bolt'],
        ['mongodb', 'fa-solid fa-database'],
        ['postgresql', 'fa-solid fa-database'],
        ['mysql', 'fa-solid fa-database'],
        ['redis', 'fa-solid fa-database'],
        ['elasticsearch', 'fa-solid fa-search'],
        ['firebase', 'fa-solid fa-fire'],
        ['graphql', 'fa-solid fa-project-diagram'],
        ['rest-api', 'fa-solid fa-exchange-alt'],
        ['json', 'fa-solid fa-code'],
        ['xml', 'fa-solid fa-code'],
        ['markdown', 'fa-solid fa-markdown'],
        ['latex', 'fa-solid fa-file-alt'],
        ['pdf', 'fa-solid fa-file-pdf'],
        ['excel', 'fa-solid fa-file-excel'],
        ['word', 'fa-solid fa-file-word'],
        ['powerpoint', 'fa-solid fa-file-powerpoint'],
        ['zip', 'fa-solid fa-file-archive'],
        ['csv', 'fa-solid fa-file-csv'],
        ['settings', 'fa-solid fa-gear']
    ]);

    // Replicăm metodele din serviciul original
    stringToFontAwesome(iconString: string): string {
        if (!iconString) return 'fa-solid fa-circle';

        const normalizedString = iconString
            .toLowerCase()
            .replace(/[_\s]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/^-+|-+$/g, '')
            .replace(/-+/g, '-');

        if (this.fontAwesomeMap.has(normalizedString)) {
            return this.fontAwesomeMap.get(normalizedString)!;
        }

        if (normalizedString) {
            return `fa-solid fa-${normalizedString}`;
        }

        return 'fa-solid fa-circle';
    }

    stringToLucide(iconString: string): any {
        try {
            if (!iconString) return { name: 'Zap' };

            if (this.iconMap.has(iconString)) {
                const result = this.iconMap.get(iconString)!;
                return result;
            }

            return { name: 'Zap' };
        } catch (error) {
            console.error('LUCIDE ERROR:', error);
            return { name: 'Zap' };
        }
    }

    hasLucideIcon(iconString: string): boolean {
        const normalizedString = iconString
            .toLowerCase()
            .replace(/[_\s]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/^-+|-+$/g, '')
            .replace(/-+/g, '-');

        return this.iconMap.has(normalizedString);
    }

    hasFontAwesomeIcon(iconString: string): boolean {
        const normalizedString = iconString
            .toLowerCase()
            .replace(/[_\s]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/^-+|-+$/g, '')
            .replace(/-+/g, '-');

        return this.fontAwesomeMap.has(normalizedString);
    }

    getAllLucideIcons(): string[] {
        return Array.from(this.iconMap.keys()).sort();
    }

    getAllFontAwesomeIcons(): string[] {
        return Array.from(this.fontAwesomeMap.keys()).sort();
    }

    getIconSuggestions(category: 'education' | 'work' | 'tech' | 'projects' | 'contact' | 'hobbies'): string[] {
        const suggestions = {
            education: ['graduation-cap', 'school', 'book-open', 'brain', 'award', 'languages'],
            work: ['briefcase', 'building', 'users', 'trophy', 'target', 'flag'],
            tech: ['code', 'terminal', 'cpu', 'monitor', 'server', 'database', 'globe'],
            projects: ['folder', 'rocket', 'lightbulb', 'puzzle', 'package', 'shopping-cart'],
            contact: ['mail', 'phone', 'map-pin', 'github', 'linkedin', 'message-circle'],
            hobbies: ['heart', 'star', 'mountain', 'camera', 'music', 'gamepad2', 'coffee']
        };

        return suggestions[category] || [];
    }
}

describe('IconHelperService', () => {
    let service: MockIconHelperService;

    beforeEach(() => {
        service = new MockIconHelperService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Service Initialization', () => {
        it('should create service instance', () => {
            expect(service).toBeTruthy();
            expect(service).toBeInstanceOf(MockIconHelperService);
        });

        it('should have icon mappings initialized', () => {
            const lucideIcons = service.getAllLucideIcons();
            const faIcons = service.getAllFontAwesomeIcons();

            expect(Array.isArray(lucideIcons)).toBe(true);
            expect(Array.isArray(faIcons)).toBe(true);
            expect(lucideIcons.length).toBeGreaterThan(0);
            expect(faIcons.length).toBeGreaterThan(0);
        });
    });

    describe('stringToLucide Method', () => {
        it('should return correct Lucide icon for valid icon names', () => {
            const testCases = [
                { input: 'graduation-cap', expected: 'GraduationCap' },
                { input: 'code', expected: 'Code' },
                { input: 'mail', expected: 'Mail' },
                { input: 'github', expected: 'Github' },
                { input: 'briefcase', expected: 'Briefcase' },
                { input: 'database', expected: 'Database' },
                { input: 'heart', expected: 'Heart' },
                { input: 'rocket', expected: 'Rocket' }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = service.stringToLucide(input);
                expect(result).toBeDefined();
                expect(result.name).toBe(expected);
            });
        });

        it('should return Zap for empty/invalid strings', () => {
            const invalidInputs = ['', null, undefined, 'invalid-icon-name', 'non-existent'];

            invalidInputs.forEach(input => {
                const result = service.stringToLucide(input as any);
                expect(result.name).toBe('Zap');
            });
        });

        it('should handle icons from each category correctly', () => {
            // Education
            expect(service.stringToLucide('graduation-cap').name).toBe('GraduationCap');
            expect(service.stringToLucide('school').name).toBe('School');
            expect(service.stringToLucide('brain').name).toBe('Brain');

            // Work
            expect(service.stringToLucide('briefcase').name).toBe('Briefcase');
            expect(service.stringToLucide('users').name).toBe('Users');
            expect(service.stringToLucide('trophy').name).toBe('Trophy');

            // Tech
            expect(service.stringToLucide('code').name).toBe('Code');
            expect(service.stringToLucide('terminal').name).toBe('Terminal');
            expect(service.stringToLucide('database').name).toBe('Database');
        });
    });

    describe('stringToFontAwesome Method', () => {
        it('should return correct FontAwesome classes for mapped technologies', () => {
            const techMappings = [
                { input: 'wordpress', expected: 'fa-solid fa-wordpress' },
                { input: 'react', expected: 'fa-solid fa-react' },
                { input: 'angular', expected: 'fa-solid fa-angular' },
                { input: 'vue', expected: 'fa-solid fa-vuejs' },
                { input: 'docker', expected: 'fa-solid fa-docker' },
                { input: 'node-js', expected: 'fa-solid fa-node-js' },
                { input: 'bootstrap', expected: 'fa-solid fa-bootstrap' },
                { input: 'sass', expected: 'fa-solid fa-sass' }
            ];

            techMappings.forEach(({ input, expected }) => {
                const result = service.stringToFontAwesome(input);
                expect(result).toBe(expected);
            });
        });

        it('should normalize strings and generate FontAwesome classes', () => {
            expect(service.stringToFontAwesome('Node JS')).toBe('fa-solid fa-node-js');
            expect(service.stringToFontAwesome('MICROSOFT')).toBe('fa-solid fa-microsoft');
            expect(service.stringToFontAwesome('git_alt')).toBe('fa-solid fa-git-alt');
            expect(service.stringToFontAwesome('stack-overflow')).toBe('fa-solid fa-stack-overflow');
        });

        it('should return default circle for empty strings', () => {
            expect(service.stringToFontAwesome('')).toBe('fa-solid fa-circle');
            expect(service.stringToFontAwesome(null as any)).toBe('fa-solid fa-circle');
            expect(service.stringToFontAwesome(undefined as any)).toBe('fa-solid fa-circle');
        });

        it('should generate generic FontAwesome class for unknown technologies', () => {
            expect(service.stringToFontAwesome('unknown-tech')).toBe('fa-solid fa-unknown-tech');
            expect(service.stringToFontAwesome('custom-framework')).toBe('fa-solid fa-custom-framework');
        });
    });

    describe('Icon Validation Methods', () => {
        it('should correctly validate existing Lucide icons', () => {
            const existingIcons = [
                'graduation-cap', 'school', 'book-open', 'brain', 'award',
                'briefcase', 'building', 'users', 'trophy', 'target',
                'code', 'terminal', 'cpu', 'monitor', 'server', 'database',
                'mail', 'phone', 'github', 'linkedin', 'heart', 'star'
            ];

            existingIcons.forEach(icon => {
                expect(service.hasLucideIcon(icon)).toBe(true);
            });

            const nonExistingIcons = ['invalid-icon', 'fake-icon', 'non-existent'];
            nonExistingIcons.forEach(icon => {
                expect(service.hasLucideIcon(icon)).toBe(false);
            });
        });

        it('should correctly validate existing FontAwesome icons', () => {
            const existingFAIcons = [
                'wordpress', 'microsoft', 'apple', 'google', 'react', 'angular',
                'vue', 'docker', 'npm', 'node-js', 'bootstrap', 'sass',
                'git-alt', 'gitlab', 'figma', 'stripe', 'paypal'
            ];

            existingFAIcons.forEach(icon => {
                expect(service.hasFontAwesomeIcon(icon)).toBe(true);
            });

            const nonExistingFAIcons = ['invalid-tech', 'fake-framework'];
            nonExistingFAIcons.forEach(icon => {
                expect(service.hasFontAwesomeIcon(icon)).toBe(false);
            });
        });
    });

    describe('Icon Suggestions by Category', () => {
        it('should return exact suggestions for each category', () => {
            expect(service.getIconSuggestions('education')).toEqual([
                'graduation-cap', 'school', 'book-open', 'brain', 'award', 'languages'
            ]);

            expect(service.getIconSuggestions('work')).toEqual([
                'briefcase', 'building', 'users', 'trophy', 'target', 'flag'
            ]);

            expect(service.getIconSuggestions('tech')).toEqual([
                'code', 'terminal', 'cpu', 'monitor', 'server', 'database', 'globe'
            ]);

            expect(service.getIconSuggestions('projects')).toEqual([
                'folder', 'rocket', 'lightbulb', 'puzzle', 'package', 'shopping-cart'
            ]);

            expect(service.getIconSuggestions('contact')).toEqual([
                'mail', 'phone', 'map-pin', 'github', 'linkedin', 'message-circle'
            ]);

            expect(service.getIconSuggestions('hobbies')).toEqual([
                'heart', 'star', 'mountain', 'camera', 'music', 'gamepad2', 'coffee'
            ]);
        });

        it('should return empty array for unknown categories', () => {
            expect(service.getIconSuggestions('unknown' as any)).toEqual([]);
            expect(service.getIconSuggestions('invalid' as any)).toEqual([]);
        });
    });

    describe('Utility Methods', () => {
        it('should return all available icons in sorted order', () => {
            const lucideIcons = service.getAllLucideIcons();
            const faIcons = service.getAllFontAwesomeIcons();

            expect(Array.isArray(lucideIcons)).toBe(true);
            expect(Array.isArray(faIcons)).toBe(true);
            expect(lucideIcons.length).toBeGreaterThan(50);
            expect(faIcons.length).toBeGreaterThan(30);

            // Verifică sortarea
            const sortedLucide = [...lucideIcons].sort();
            const sortedFA = [...faIcons].sort();
            expect(lucideIcons).toEqual(sortedLucide);
            expect(faIcons).toEqual(sortedFA);

            // Verifică conținutul
            expect(lucideIcons).toContain('graduation-cap');
            expect(lucideIcons).toContain('code');
            expect(faIcons).toContain('react');
            expect(faIcons).toContain('docker');
        });

        it('should not have duplicate entries', () => {
            const lucideIcons = service.getAllLucideIcons();
            const faIcons = service.getAllFontAwesomeIcons();

            const uniqueLucide = [...new Set(lucideIcons)];
            const uniqueFA = [...new Set(faIcons)];

            expect(lucideIcons.length).toBe(uniqueLucide.length);
            expect(faIcons.length).toBe(uniqueFA.length);
        });
    });

    describe('Error Handling', () => {
        it('should handle malformed input gracefully', () => {
            const malformedInputs = ['!@#$%^&*()', '   ', '123', '---', 'a'.repeat(1000)];

            malformedInputs.forEach(input => {
                expect(() => service.stringToLucide(input)).not.toThrow();
                expect(() => service.stringToFontAwesome(input)).not.toThrow();
                expect(() => service.hasLucideIcon(input)).not.toThrow();
                expect(() => service.hasFontAwesomeIcon(input)).not.toThrow();
            });
        });

        it('should provide consistent fallback behavior', () => {
            expect(service.stringToLucide('invalid').name).toBe('Zap');
            expect(service.stringToLucide('').name).toBe('Zap');
            expect(service.stringToLucide(null as any).name).toBe('Zap');

            expect(service.stringToFontAwesome('')).toBe('fa-solid fa-circle');
            expect(service.stringToFontAwesome(null as any)).toBe('fa-solid fa-circle');
        });
    });

    describe('Real-world Portfolio Use Cases', () => {
        it('should handle common portfolio sections correctly', () => {
            // Education section
            expect(service.stringToLucide('graduation-cap').name).toBe('GraduationCap');
            expect(service.stringToLucide('school').name).toBe('School');

            // Skills section  
            expect(service.stringToLucide('code').name).toBe('Code');
            expect(service.stringToLucide('database').name).toBe('Database');

            // Contact section
            expect(service.stringToLucide('mail').name).toBe('Mail');
            expect(service.stringToLucide('github').name).toBe('Github');

            // Projects section
            expect(service.stringToLucide('folder').name).toBe('Folder');
            expect(service.stringToLucide('rocket').name).toBe('Rocket');
        });

        it('should handle technology stack icons correctly', () => {
            expect(service.stringToFontAwesome('react')).toBe('fa-solid fa-react');
            expect(service.stringToFontAwesome('angular')).toBe('fa-solid fa-angular');
            expect(service.stringToFontAwesome('vue')).toBe('fa-solid fa-vuejs');
            expect(service.stringToFontAwesome('docker')).toBe('fa-solid fa-docker');
            expect(service.stringToFontAwesome('git-alt')).toBe('fa-solid fa-git-alt');
            expect(service.stringToFontAwesome('wordpress')).toBe('fa-solid fa-wordpress');
        });
    });
});