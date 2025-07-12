import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Phone, PhoneCall, MapPin, Github, Linkedin, Send, Copy, ExternalLink } from 'lucide-angular';

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
}

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent {
  // Icon variables for template
  readonly mailIcon = Mail;
  readonly phoneIcon = Phone;
  readonly phoneCallIcon = PhoneCall;
  readonly mapPinIcon = MapPin;
  readonly githubIcon = Github;
  readonly linkedinIcon = Linkedin;
  readonly sendIcon = Send;
  readonly copyIcon = Copy;
  readonly externalLinkIcon = ExternalLink;

  contactInfo: ContactInfo = {
    email: 'alinviorelciobanu@gmail.com',
    phone: '0753586216',
    location: 'Iași, Romania',
    github: 'https://github.com/AlinV15',
    linkedin: 'https://www.linkedin.com/in/alin-v-ciobanu-84b06b269/'
  };

  // Metode pentru acțiuni
  copyToClipboard(text: string, type: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`${type} copied to clipboard`);
      // Aici poți adăuga o notificare toast
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  sendEmail(): void {
    window.location.href = `mailto:${this.contactInfo.email}`;
  }

  callPhone(): void {
    window.location.href = `tel:${this.contactInfo.phone}`;
  }
}