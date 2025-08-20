// Jest types declaration for TypeScript
declare namespace jest {
    interface Matchers<R> {
        // Basic matchers
        toBe(expected: any): R;
        toEqual(expected: any): R;
        toStrictEqual(expected: any): R;

        // Truthiness matchers
        toBeTruthy(): R;
        toBeFalsy(): R;
        toBeUndefined(): R;
        toBeNull(): R;
        toBeDefined(): R;

        // Number matchers
        toBeGreaterThan(expected: number): R;
        toBeGreaterThanOrEqual(expected: number): R;
        toBeLessThan(expected: number): R;
        toBeLessThanOrEqual(expected: number): R;
        toBeCloseTo(expected: number, precision?: number): R;

        // String matchers
        toMatch(expected: string | RegExp): R;
        toContain(expected: any): R;

        // Array/Collection matchers
        toHaveLength(expected: number): R;
        toContainEqual(expected: any): R;

        // Object matchers
        toHaveProperty(propertyPath: string, value?: any): R;
        toMatchObject(expected: object): R;

        // Function/Mock matchers
        toHaveBeenCalled(): R;
        toHaveBeenCalledTimes(expected: number): R;
        toHaveBeenCalledWith(...args: any[]): R;
        toHaveBeenLastCalledWith(...args: any[]): R;
        toHaveBeenNthCalledWith(nthCall: number, ...args: any[]): R;
        toHaveReturnedWith(expected: any): R;
        toHaveReturnedTimes(expected: number): R;
        toReturn(): R;

        // Promise matchers
        toResolve(): R;
        toReject(): R;

        // Error matchers
        toThrow(expected?: string | RegExp | Error): R;
        toThrowError(expected?: string | RegExp | Error): R;

        // Type matchers
        toBeInstanceOf(expected: any): R;

        // Negation
        not: Matchers<R>;
    }

    interface Mock<T extends (...args: any[]) => any = (...args: any[]) => any> {
        (...args: Parameters<T>): ReturnType<T>;
        mockClear(): this;
        mockReset(): this;
        mockRestore(): void;
        mockImplementation(fn?: T): this;
        mockImplementationOnce(fn: T): this;
        mockReturnValue(value: ReturnType<T>): this;
        mockReturnValueOnce(value: ReturnType<T>): this;
        mockResolvedValue(value: any): this;
        mockResolvedValueOnce(value: any): this;
        mockRejectedValue(value: any): this;
        mockRejectedValueOnce(value: any): this;
        getMockName(): string;
        mockName(name: string): this;
        mock: {
            calls: Parameters<T>[];
            results: Array<{
                type: 'return' | 'throw' | 'incomplete';
                value: any;
            }>;
            instances: any[];
            contexts: any[];
            invocationCallOrder: number[];
        };
    }

    interface MockedFunction<T extends (...args: any[]) => any> extends Mock<T> {
        (...args: Parameters<T>): ReturnType<T>;
    }

    interface MockedClass<T extends new (...args: any[]) => any> extends MockedFunction<T> {
        new(...args: ConstructorParameters<T>): MockedObject<InstanceType<T>>;
        prototype: MockedObject<InstanceType<T>>;
    }

    interface MockedObject<T extends object> {
        [K]: T[K] extends (...args: any[]) => any
        ? MockedFunction<T[K]>
        : T[K] extends new (...args: any[]) => any
        ? MockedClass<T[K]>
        : T[K] extends object
        ? MockedObject<T[K]>
        : T[K];
    }

    interface SpyInstance<T extends (...args: any[]) => any> extends MockedFunction<T> {
        mockRestore(): void;
    }
}

declare const jest: {
    // Mock functions
    fn<T extends (...args: any[]) => any>(implementation?: T): jest.MockedFunction<T>;
    Mock: jest.Mock;

    // Module mocking with typed returns
    mocked<T>(item: T, deep?: false): jest.MockedFunction<T>;
    mocked<T extends object>(item: T, deep: true): jest.MockedObject<T>;

    // Spies
    spyOn<T extends object, K extends keyof T>(
        object: T,
        method: K
    ): jest.SpyInstance<T[K] extends (...args: any[]) => any ? T[K] : never>;

    // Mock management
    clearAllMocks(): void;
    resetAllMocks(): void;
    restoreAllMocks(): void;

    // Module mocking
    mock(moduleName: string, factory?: () => any, options?: { virtual?: boolean }): typeof jest;
    unmock(moduleName: string): typeof jest;
    doMock(moduleName: string, factory?: () => any, options?: { virtual?: boolean }): typeof jest;
    dontMock(moduleName: string): typeof jest;

    // Auto mock
    createMockFromModule<T = any>(moduleName: string): T;
    genMockFromModule<T = any>(moduleName: string): T;
    requireActual<T = any>(moduleName: string): T;
    requireMock<T = any>(moduleName: string): T;

    // Timers
    useFakeTimers(implementation?: 'modern' | 'legacy'): typeof jest;
    useRealTimers(): typeof jest;
    runAllTimers(): void;
    runOnlyPendingTimers(): void;
    advanceTimersByTime(msToRun: number): void;
    clearAllTimers(): void;
    getTimerCount(): number;

    // Configuration
    setTimeout(timeout: number): typeof jest;
    retryTimes(numRetries: number): typeof jest;

    // Environment
    isolateModules(fn: () => void): void;
};

declare const expect: {
    <T = any>(actual: T): jest.Matchers<void>;

    // Custom matchers
    extend(matchers: Record<string, any>): void;

    // Utilities
    anything(): any;
    any(constructor: any): any;
    objectContaining(object: object): any;
    arrayContaining(array: any[]): any;
    stringContaining(string: string): any;
    stringMatching(regexp: RegExp | string): any;


    // Assertions count
    assertions(count: number): void;
    hasAssertions(): void;
};

// Test structure functions
declare const describe: {
    (name: string, fn: () => void): void;
    each<T extends readonly any[]>(
        table: ReadonlyArray<T>
    ): (name: string, fn: (...args: T) => void) => void;
    only: (name: string, fn: () => void) => void;
    skip: (name: string, fn: () => void) => void;
};

declare const it: {
    (name: string, fn?: (done?: any) => void | Promise<any>): void;
    each<T extends readonly any[]>(
        table: ReadonlyArray<T>
    ): (name: string, fn: (...args: T) => void | Promise<any>) => void;
    only: (name: string, fn?: (done?: any) => void | Promise<any>) => void;
    skip: (name: string, fn?: (done?: any) => void | Promise<any>) => void;
    todo: (name: string) => void;
};

declare const test: typeof it;

// Setup and teardown hooks
declare const beforeAll: (fn: (done?: any) => void | Promise<any>) => void;
declare const afterAll: (fn: (done?: any) => void | Promise<any>) => void;
declare const beforeEach: (fn: (done?: any) => void | Promise<any>) => void;
declare const afterEach: (fn: (done?: any) => void | Promise<any>) => void;

// Global variables
declare const __filename: string;
declare const __dirname: string;

// Process and environment
declare namespace NodeJS {
    interface Global {
        [key: string]: any;
    }
}

declare const global: NodeJS.Global;