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
            this.setError('The download is not supported on the server');
            return false;
        }

        try {
            this.clearError();
            const url = `/assets/files/${fileName}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`The file was not found (${response.status})`);
            }

            const blob = await response.blob();

            if (blob.size === 0) {
                throw new Error('The file is empty');
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

            return true;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred during download';
            console.error('Download error:', error);
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