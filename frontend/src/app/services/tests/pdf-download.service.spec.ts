import { BehaviorSubject } from 'rxjs';

// Mock BehaviorSubject and observables
const createMockBehaviorSubject = <T>(initialValue: T) => {
    let currentValue = initialValue;
    const observers: Array<(value: T) => void> = [];

    const subject = {
        next: jest.fn((value: T) => {
            currentValue = value;
            observers.forEach(observer => observer(value));
        }),
        asObservable: jest.fn(() => ({
            subscribe: jest.fn((observer: (value: T) => void) => {
                observers.push(observer);
                observer(currentValue); // Emit current value immediately
                return {
                    unsubscribe: jest.fn()
                };
            })
        })),
        getValue: () => currentValue
    };

    return subject;
};

// Mock browser APIs
const mockFetch = jest.fn();
const mockURL = {
    createObjectURL: jest.fn().mockReturnValue('mock-blob-url'),
    revokeObjectURL: jest.fn()
};

const mockDocument = {
    createElement: jest.fn(),
    body: {
        appendChild: jest.fn(),
        removeChild: jest.fn()
    }
};

const mockLink = {
    href: '',
    download: '',
    style: { display: '' },
    click: jest.fn()
};

// Reset function for mockLink
const resetMockLink = () => {
    mockLink.href = '';
    mockLink.download = '';
    mockLink.style.display = '';
    mockLink.click.mockClear();
};

// Mock class that replicates PdfDownloadService logic without Angular decorators
class MockPdfDownloadService {
    private errorSubject = createMockBehaviorSubject<string | null>(null);
    public error$ = this.errorSubject.asObservable();

    constructor(private platformId: string) {
        // Setup global mocks
        (global as any).fetch = mockFetch;
        (global as any).window = {
            URL: mockURL,
            setTimeout: setTimeout // Add real setTimeout
        };
        (global as any).document = mockDocument;

        // Setup document.createElement mock to return actual link references
        mockDocument.createElement.mockImplementation((tagName: string) => {
            if (tagName === 'a') {
                // Return the same mockLink object so properties persist
                return mockLink;
            }
            return {};
        });
    }

    isPlatformBrowser(): boolean {
        return this.platformId === 'browser';
    }

    async downloadPDF(fileName: string, displayName?: string): Promise<boolean> {
        if (!this.isPlatformBrowser()) {
            this.setError('Descărcarea nu este disponibilă pe server');
            return false;
        }

        try {
            this.clearError();
            const url = `/assets/files/${fileName}`;

            console.log('Încercare descărcare:', url); // Add debug logging

            const response = await mockFetch(url);

            console.log('Response status:', response.status); // Add debug logging

            if (!response.ok) {
                throw new Error(`Fișierul nu a fost găsit (${response.status})`);
            }

            const blob = await response.blob();

            console.log('Blob size:', blob.size); // Add debug logging

            if (blob.size === 0) {
                throw new Error('Fișierul este gol');
            }

            const downloadUrl = mockURL.createObjectURL(blob);
            const link = mockDocument.createElement('a') as typeof mockLink;

            // Set properties on the link
            link.href = downloadUrl;
            link.download = displayName || fileName;
            link.style.display = 'none';

            mockDocument.body.appendChild(link);
            link.click();
            mockDocument.body.removeChild(link);

            // Mock setTimeout for URL cleanup
            setTimeout(() => mockURL.revokeObjectURL(downloadUrl), 100);

            console.log('Descărcare reușită'); // Add debug logging
            return true;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută la descărcare';
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

    // Expose private methods for testing
    callSetError(message: string) {
        this.setError(message);
    }

    callClearError() {
        this.clearError();
    }

    getCurrentError(): string | null {
        return this.errorSubject.getValue();
    }
}

// Test data
const testFileName = 'test-document.pdf';
const testDisplayName = 'My Document.pdf';

const createMockResponse = (ok: boolean = true, status: number = 200, blobSize: number = 1024) => ({
    ok,
    status,
    blob: jest.fn().mockResolvedValue({
        size: blobSize,
        type: 'application/pdf'
    })
});

const createMockBlob = (size: number = 1024) => ({
    size,
    type: 'application/pdf'
});

describe('PdfDownloadService Logic Tests', () => {
    let service: MockPdfDownloadService;
    let consoleSpy: jest.SpyInstance<any>;
    let consoleErrorSpy: jest.SpyInstance<any>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Reset mock link state
        resetMockLink();

        // Setup console spy to capture logs
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Create service instance for browser
        service = new MockPdfDownloadService('browser');
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        jest.restoreAllMocks();
        delete (global as any).fetch;
        delete (global as any).window;
        delete (global as any).document;
    });

    it('should initialize with null error state', () => {
        expect(service.getCurrentError()).toBeNull();
    });

    it('should provide error observable', (done) => {
        service.error$.subscribe(error => {
            expect(error).toBeNull();
            done();
        });
    });

    it('should fail download when not in browser platform', async () => {
        const serverService = new MockPdfDownloadService('server');

        const result = await serverService.downloadPDF(testFileName);

        expect(result).toBe(false);
        expect(serverService.getCurrentError()).toBe('Descărcarea nu este disponibilă pe server');
    });

    it('should successfully download PDF with valid file', async () => {
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadPDF(testFileName, testDisplayName);

        expect(result).toBe(true);
        expect(mockFetch).toHaveBeenCalledWith('/assets/files/test-document.pdf');
        expect(mockURL.createObjectURL).toHaveBeenCalled();
        expect(mockDocument.createElement).toHaveBeenCalledWith('a');
        expect(mockLink.download).toBe(testDisplayName);
        expect(mockLink.click).toHaveBeenCalled();
        expect(service.getCurrentError()).toBeNull();
    });

    it('should use original filename when displayName not provided', async () => {
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadPDF(testFileName);

        expect(result).toBe(true);
        expect(mockLink.download).toBe(testFileName);
    });

    it('should handle 404 file not found error', async () => {
        const mockResponse = createMockResponse(false, 404, 0);
        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadPDF(testFileName);

        expect(result).toBe(false);
        expect(service.getCurrentError()).toBe('Fișierul nu a fost găsit (404)');
    });

    it('should handle 500 server error', async () => {
        const mockResponse = createMockResponse(false, 500, 0);
        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadPDF(testFileName);

        expect(result).toBe(false);
        expect(service.getCurrentError()).toBe('Fișierul nu a fost găsit (500)');
    });

    it('should handle empty file error', async () => {
        const mockResponse = createMockResponse(true, 200, 0);
        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadPDF(testFileName);

        expect(result).toBe(false);
        expect(service.getCurrentError()).toBe('Fișierul este gol');
    });

    it('should handle network fetch errors', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        const result = await service.downloadPDF(testFileName);

        expect(result).toBe(false);
        expect(service.getCurrentError()).toBe('Network error');
    });

    it('should handle unknown errors', async () => {
        mockFetch.mockRejectedValue('Unknown error type');

        const result = await service.downloadPDF(testFileName);

        expect(result).toBe(false);
        expect(service.getCurrentError()).toBe('Eroare necunoscută la descărcare');
    });

    it('should clear errors before new download attempt', async () => {
        // First, set an error
        service.callSetError('Previous error');
        expect(service.getCurrentError()).toBe('Previous error');

        // Mock successful response
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadPDF(testFileName);

        expect(result).toBe(true);
        expect(service.getCurrentError()).toBeNull();
    });

    it('should create correct download URL path', async () => {
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        await service.downloadPDF('my-cv.pdf');

        expect(mockFetch).toHaveBeenCalledWith('/assets/files/my-cv.pdf');
    });

    it('should setup link element correctly', async () => {
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        await service.downloadPDF(testFileName, testDisplayName);

        expect(mockDocument.createElement).toHaveBeenCalledWith('a');
        expect(mockLink.href).toBe('mock-blob-url');
        expect(mockLink.download).toBe(testDisplayName);
        expect(mockLink.style.display).toBe('none');
    });

    it('should add and remove link from DOM', async () => {
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        await service.downloadPDF(testFileName);

        expect(mockDocument.body.appendChild).toHaveBeenCalled();
        expect(mockLink.click).toHaveBeenCalled();
        expect(mockDocument.body.removeChild).toHaveBeenCalled();
    });



    it('should emit error changes through observable', (done) => {
        const errorMessages: (string | null)[] = [];

        service.error$.subscribe(error => {
            errorMessages.push(error);

            if (errorMessages.length === 3) {
                expect(errorMessages[0]).toBeNull(); // Initial state
                expect(errorMessages[1]).toBe('Test error'); // After setError
                expect(errorMessages[2]).toBeNull(); // After clearError
                done();
            }
        });

        service.callSetError('Test error');
        service.callClearError();
    });

    it('should handle multiple subscribers to error observable', () => {
        const subscriber1 = jest.fn();
        const subscriber2 = jest.fn();

        service.error$.subscribe(subscriber1);
        service.error$.subscribe(subscriber2);

        service.callSetError('Multi-subscriber test');

        expect(subscriber1).toHaveBeenCalledWith(null); // Initial
        expect(subscriber1).toHaveBeenCalledWith('Multi-subscriber test'); // Update
        expect(subscriber2).toHaveBeenCalledWith(null); // Initial
        expect(subscriber2).toHaveBeenCalledWith('Multi-subscriber test'); // Update
    });

    it('should log debug information during download', async () => {
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        await service.downloadPDF(testFileName);

        expect(consoleSpy).toHaveBeenCalledWith('Încercare descărcare:', '/assets/files/test-document.pdf');
        expect(consoleSpy).toHaveBeenCalledWith('Response status:', 200);
        expect(consoleSpy).toHaveBeenCalledWith('Blob size:', 1024);
        expect(consoleSpy).toHaveBeenCalledWith('Descărcare reușită');
    });

    it('should handle blob creation errors', async () => {
        const mockResponse = {
            ok: true,
            status: 200,
            blob: jest.fn().mockRejectedValue(new Error('Blob creation failed'))
        };
        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadPDF(testFileName);

        expect(result).toBe(false);
        expect(service.getCurrentError()).toBe('Blob creation failed');
    });

    it('should handle concurrent download requests', async () => {
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        const promise1 = service.downloadPDF('file1.pdf');
        const promise2 = service.downloadPDF('file2.pdf');

        const [result1, result2] = await Promise.all([promise1, promise2]);

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should preserve error state until next download or clear', async () => {
        // Trigger an error
        mockFetch.mockRejectedValue(new Error('Test error'));
        await service.downloadPDF(testFileName);

        expect(service.getCurrentError()).toBe('Test error');

        // Error should persist
        expect(service.getCurrentError()).toBe('Test error');

        // Clear manually
        service.callClearError();
        expect(service.getCurrentError()).toBeNull();
    });

    it('should handle special characters in filenames', async () => {
        const specialFileName = 'test file with spaces & symbols.pdf';
        const mockResponse = createMockResponse(true, 200, 1024);
        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadPDF(specialFileName);

        expect(result).toBe(true);
        expect(mockFetch).toHaveBeenCalledWith('/assets/files/test file with spaces & symbols.pdf');
        expect(mockLink.download).toBe(specialFileName);
    });
});