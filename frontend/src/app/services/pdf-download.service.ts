// services/pdf-download.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PdfDownloadService {
    private errorSubject = new BehaviorSubject<string | null>(null);
    public error$ = this.errorSubject.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    async downloadPDF(fileName: string, displayName?: string): Promise<boolean> {
        if (!isPlatformBrowser(this.platformId)) {
            this.setError('Descărcarea nu este disponibilă pe server');
            return false;
        }

        try {
            this.clearError();
            const url = `/assets/files/${fileName}`;

            console.log('Încercare descărcare:', url); // Debug

            const response = await fetch(url);
            console.log('Response status:', response.status); // Debug

            if (!response.ok) {
                throw new Error(`Fișierul nu a fost găsit (${response.status})`);
            }

            const blob = await response.blob();
            console.log('Blob size:', blob.size); // Debug

            if (blob.size === 0) {
                throw new Error('Fișierul este gol');
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = displayName || fileName;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100);

            console.log('Descărcare reușită'); // Debug
            return true;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută la descărcare';
            console.error('Eroare descărcare:', error);
            this.setError(errorMessage);
            return false;
        }
    }

    private setError(message: string) {
        this.errorSubject.next(message);
    }

    private clearError() {
        this.errorSubject.next(null);
    }
} 