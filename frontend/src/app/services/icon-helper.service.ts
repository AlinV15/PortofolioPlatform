import { Injectable } from '@angular/core';
import {
    Activity, Award, Book, BookOpen, Brain, Briefcase, Building, Building2,
    Calendar, Camera, CheckCircle, Code, Coffee, Cpu, Database,
    FileText, Flag, Folder, Gamepad2, Github, Globe, GraduationCap,
    Heart, Languages, Layers, Linkedin, LucideIconData, Mail, MapPin,
    MessageCircle, Monitor, Mountain, Music, Palette, Phone, Plane,
    School, Server, Settings, Smartphone, Star, Target, Terminal,
    Trophy, Users, Wrench, Zap, Shield, Clock, PlayCircle,
    PauseCircle, Download, Upload, Search, Filter, Edit, Trash2,
    Plus, Minus, X, ChevronRight, ChevronLeft, Home, User,
    Package, ShoppingCart, CreditCard, Truck, BarChart3,
    PieChart, TrendingUp, Lightbulb, Rocket, Puzzle,
    Cloud, Wifi, Lock, Unlock, Eye, EyeOff, Bell,
    Bookmark, Tag, Share2, ExternalLink, Copy,
    RotateCcw, Save, Printer, FileImage, FileVideo,
    Headphones, Volume2, Mic, Video, Calendar as CalendarIcon,
    Clock as ClockIcon, Timer, Compass
    , Map as MapIcon, Navigation, Anchor, Sunrise, Moon, Sun,
    Thermometer, Droplets, Wind, CloudRain, Snowflake,
    Leaf, Trees, Flower, Bug, Fish, Bird, Dog, Cat,
    Apple, Coffee as CoffeeIcon, Pizza, IceCream, Cake,
    Car, Bus, Train, Bike, Ship,
    ShieldCheck
} from 'lucide-angular';


@Injectable({
    providedIn: 'root'
})
export class IconHelperService {

    // Comprehensive icon mapping for portofolio app
    private readonly iconMap: Map<string, LucideIconData> = new Map([
        // === EDUCATION & LEARNING ===
        ['graduation-cap', GraduationCap],
        ['school', School],
        ['book-open', BookOpen],
        ['book', Book],
        ['brain', Brain],
        ['award', Award],
        ['languages', Languages],
        ['certificate', ShieldCheck],

        // === WORK & PROFESSIONAL ===
        ['briefcase', Briefcase],
        ['building', Building],
        ['building2', Building2],
        ['users', Users],
        ['trophy', Trophy],
        ['target', Target],
        ['flag', Flag],

        // === TECHNICAL & DEVELOPMENT ===
        ['code', Code],
        ['terminal', Terminal],
        ['cpu', Cpu],
        ['monitor', Monitor],
        ['server', Server],
        ['database', Database],
        ['globe', Globe],
        ['smartphone', Smartphone],
        ['layers', Layers],
        ['zap', Zap],
        ['wrench', Wrench],
        ['settings', Settings],
        ['shield', Shield],
        ['cloud', Cloud],
        ['wifi', Wifi],
        ['lock', Lock],
        ['unlock', Unlock],

        // === PROJECT MANAGEMENT ===
        ['folder', Folder],
        ['file-text', FileText],
        ['check-circle', CheckCircle],
        ['clock', Clock],
        ['calendar', CalendarIcon],
        ['search', Search],
        ['filter', Filter],
        ['edit', Edit],
        ['trash2', Trash2],
        ['plus', Plus],
        ['minus', Minus],
        ['x', X],
        ['save', Save],
        ['copy', Copy],
        ['rotate-ccw', RotateCcw],

        // === COMMUNICATION & CONTACT ===
        ['mail', Mail],
        ['phone', Phone],
        ['message-circle', MessageCircle],
        ['map-pin', MapPin],
        ['github', Github],
        ['linkedin', Linkedin],
        ['share2', Share2],
        ['external-link', ExternalLink],

        // === UI & NAVIGATION ===
        ['home', Home],
        ['user', User],
        ['chevron-right', ChevronRight],
        ['chevron-left', ChevronLeft],
        ['eye', Eye],
        ['eye-off', EyeOff],
        ['bell', Bell],
        ['bookmark', Bookmark],
        ['tag', Tag],

        // === MULTIMEDIA & CREATIVITY ===
        ['camera', Camera],
        ['file-image', FileImage],
        ['file-video', FileVideo],
        ['music', Music],
        ['headphones', Headphones],
        ['volume2', Volume2],
        ['mic', Mic],
        ['video', Video],
        ['palette', Palette],
        ['lightbulb', Lightbulb],

        // === GAMING & ENTERTAINMENT ===
        ['gamepad2', Gamepad2],
        ['play-circle', PlayCircle],
        ['pause-circle', PauseCircle],
        ['puzzle', Puzzle],

        // === E-COMMERCE  ===
        ['package', Package],
        ['shopping-cart', ShoppingCart],
        ['credit-card', CreditCard],
        ['truck', Truck],

        // === ANALYTICS & CHARTS ===
        ['bar-chart3', BarChart3],
        ['pie-chart', PieChart],
        ['trending-up', TrendingUp],
        ['activity', Activity],

        // === HOBBIES & INTERESTS ===
        ['mountain', Mountain],
        ['plane', Plane],
        ['heart', Heart],
        ['star', Star],
        ['coffee', CoffeeIcon],
        ['rocket', Rocket],

        // === TIME & SCHEDULING ===
        ['timer', Timer],
        ['sunrise', Sunrise],
        ['moon', Moon],
        ['sun', Sun],

        // === LOCATION & TRAVEL ===
        ['compass', Compass],
        ['map', MapIcon],
        ['navigation', Navigation],
        ['anchor', Anchor],

        // === WEATHER & NATURE ===
        ['thermometer', Thermometer],
        ['droplets', Droplets],
        ['wind', Wind],
        ['cloud-rain', CloudRain],
        ['snowflake', Snowflake],
        ['leaf', Leaf],
        ['tree', Trees],
        ['flower', Flower],

        // === ANIMALS & PETS ===
        ['bug', Bug],
        ['fish', Fish],
        ['bird', Bird],
        ['dog', Dog],
        ['cat', Cat],

        // === FOOD & LIFESTYLE ===
        ['apple', Apple],
        ['pizza', Pizza],
        ['ice-cream', IceCream],
        ['cake', Cake],

        // === TRANSPORT ===
        ['car', Car],
        ['bus', Bus],
        ['train', Train],
        ['bike', Bike],
        ['ship', Ship],

        // === FILE OPERATIONS ===
        ['download', Download],
        ['upload', Upload],
        ['printer', Printer]
    ]);

    // Font Awesome class mapping - just for specific cases
    private readonly fontAwesomeMap: Map<string, string> = new Map([
        // Specific Font Awesome icons that are not in Lucide
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

    /**
     * Convert a string to FontAwesome class
     */
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
            return `fa-solid fa-${normalizedString}`
        }


        return 'fa-solid fa-circle';
    }

    /**
     * Convert a string to Lucide icon data
     */
    stringToLucide(iconString: string): LucideIconData {
        try {
            if (!iconString) return Zap;




            if (this.iconMap.has(iconString)) {
                const result = this.iconMap.get(iconString)!;
                return result;
            }


            return Zap;
        } catch (error) {
            console.error('LUCIDE ERROR:', error);
            return Zap;
        }
    }

    /**
     * Verify if an icon exists in Lucide mapping
     */
    hasLucideIcon(iconString: string): boolean {
        const normalizedString = iconString
            .toLowerCase()
            .replace(/[_\s]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/^-+|-+$/g, '')
            .replace(/-+/g, '-');

        return this.iconMap.has(normalizedString);
    }

    /**
     * Verify if an icon exists in FontAwesome mapping
     */
    hasFontAwesomeIcon(iconString: string): boolean {
        const normalizedString = iconString
            .toLowerCase()
            .replace(/[_\s]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/^-+|-+$/g, '')
            .replace(/-+/g, '-');

        return this.fontAwesomeMap.has(normalizedString);
    }

    /**
     * Get all Lucide icons available in the mapping
     */
    getAllLucideIcons(): string[] {
        return Array.from(this.iconMap.keys()).sort();
    }

    /**
     * Get all FontAwesome icons available in the mapping
     */
    getAllFontAwesomeIcons(): string[] {
        return Array.from(this.fontAwesomeMap.keys()).sort();
    }

    /**
     * Get icon suggestions based on category
     */
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