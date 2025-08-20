import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

export interface ToastConfig {
    message: string;
    action?: string;
    duration?: number;
    panelClass?: string | string[];
    verticalPosition?: 'top' | 'bottom';
    horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
}

@Injectable({
    providedIn: 'root'
})
export class MaterialToastService {
    private isBrowser: boolean;
    private messageQueue: ToastConfig[] = [];

    constructor(
        private snackBar: MatSnackBar,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);

        if (this.isBrowser) {
            // Process queued messages after hydration
            setTimeout(() => this.processQueue(), 100);
        }
    }

    private processQueue() {
        this.messageQueue.forEach(config => {
            this.showSnackBar(config);
        });
        this.messageQueue = [];
    }

    private showSnackBar(config: ToastConfig): MatSnackBarRef<any> | null {
        if (!this.isBrowser) {
            this.messageQueue.push(config);
            return null;
        }

        const snackBarConfig: MatSnackBarConfig = {
            duration: config.duration || 3000,
            horizontalPosition: config.horizontalPosition || 'right',
            verticalPosition: config.verticalPosition || 'top',
            panelClass: config.panelClass || 'default-toast'
        };

        return this.snackBar.open(config.message, config.action, snackBarConfig);
    }

    success(message: string, action?: string, duration: number = 3000) {
        return this.showSnackBar({
            message,
            action,
            duration,
            panelClass: ['success-toast', 'material-toast']
        });
    }

    error(message: string, action: string = 'Close', duration: number = 5000) {
        return this.showSnackBar({
            message,
            action,
            duration,
            panelClass: ['error-toast', 'material-toast']
        });
    }

    warning(message: string, action?: string, duration: number = 4000) {
        return this.showSnackBar({
            message,
            action,
            duration,
            panelClass: ['warning-toast', 'material-toast']
        });
    }

    info(message: string, action?: string, duration: number = 3000) {
        return this.showSnackBar({
            message,
            action,
            duration,
            panelClass: ['info-toast', 'material-toast']
        });
    }

    custom(config: ToastConfig) {
        return this.showSnackBar(config);
    }

    dismiss() {
        if (this.isBrowser) {
            this.snackBar.dismiss();
        }
    }

    dismissAll() {
        if (this.isBrowser) {
            this.snackBar.dismiss();
        }
        this.messageQueue = [];
    }
}