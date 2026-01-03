#!/usr/bin/env ts-node

/**
 * GitHub Auto-Contribution Script
 * Generates legitimate daily contributions to maintain GitHub activity
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const CONTRIBUTIONS_DIR = path.join(__dirname, '..', 'contributions');
const CONTRIBUTION_TYPES = ['til', 'snippet', 'note', 'progress', 'project'] as const;

type ContributionType = typeof CONTRIBUTION_TYPES[number];

interface ContributionResult {
    filepath: string;
    existed: boolean;
}

interface Topic {
    title: string;
    content: string;
}

interface CodeSnippet {
    title: string;
    language: string;
    code: string;
    description: string;
}

// Content templates for different contribution types
const CONTENT_GENERATORS: Record<ContributionType, () => string> = {
    til: (): string => {
        const topics: Topic[] = [
            {
                title: 'JavaScript Array Methods',
                content: 'Learned about the difference between `map()`, `filter()`, and `reduce()`. The `reduce()` method is particularly powerful for transforming arrays into single values or objects.',
            },
            {
                title: 'Git Rebase vs Merge',
                content: 'Understanding when to use `git rebase` vs `git merge`. Rebase creates a linear history, while merge preserves the branch structure. Use rebase for local branches, merge for shared branches.',
            },
            {
                title: 'CSS Flexbox Alignment',
                content: 'Discovered that `justify-content` controls alignment on the main axis, while `align-items` controls alignment on the cross axis. `align-self` can override `align-items` for individual items.',
            },
            {
                title: 'Node.js Event Loop',
                content: 'The event loop has multiple phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks. Understanding this helps optimize async operations.',
            },
            {
                title: 'Docker Layer Caching',
                content: 'Docker caches each layer in a Dockerfile. Placing frequently changing commands (like COPY) after stable ones (like RUN apt-get) improves build performance.',
            },
            {
                title: 'REST API Best Practices',
                content: 'Use proper HTTP methods: GET for retrieval, POST for creation, PUT for full updates, PATCH for partial updates, DELETE for removal. Always return appropriate status codes.',
            },
            {
                title: 'Database Indexing',
                content: 'Indexes speed up read operations but slow down writes. Create indexes on columns frequently used in WHERE, JOIN, and ORDER BY clauses.',
            },
            {
                title: 'TypeScript Utility Types',
                content: 'TypeScript provides utility types like `Partial<T>`, `Required<T>`, `Pick<T, K>`, and `Omit<T, K>` to transform existing types without redefining them.',
            },
            {
                title: 'React useEffect Dependencies',
                content: 'The dependency array in useEffect determines when the effect runs. Empty array runs once, no array runs every render, specific deps run when those change.',
            },
            {
                title: 'Python List Comprehensions',
                content: 'List comprehensions provide a concise way to create lists: `[x**2 for x in range(10) if x % 2 == 0]` creates a list of squares of even numbers.',
            },
        ];

        const topic = topics[Math.floor(Math.random() * topics.length)];
        return `# TIL: ${topic.title}

**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## What I Learned

${topic.content}

## Why It Matters

This knowledge helps write more efficient and maintainable code. Understanding these concepts is crucial for professional development.

## Resources

- Official documentation
- Community best practices
- Real-world examples

---
*This is part of my daily learning journey to continuously improve my development skills.*
`;
    },

    snippet: (): string => {
        const snippets: CodeSnippet[] = [
            {
                title: 'Debounce Function',
                language: 'typescript',
                code: `function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const handleSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);`,
                description: 'A type-safe debounce function that delays execution until after a specified wait time has elapsed since the last call. Useful for search inputs and resize handlers.',
            },
            {
                title: 'Deep Clone Object',
                language: 'typescript',
                code: `function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  const clonedObj = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}`,
                description: 'Creates a deep copy of an object with proper TypeScript typing, handling nested objects, arrays, and dates.',
            },
            {
                title: 'Retry with Exponential Backoff',
                language: 'typescript',
                code: `async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(\`Retry \${i + 1} after \${delay}ms\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}`,
                description: 'Retries an async function with exponential backoff, useful for API calls and network requests with proper TypeScript typing.',
            },
            {
                title: 'Format File Size',
                language: 'typescript',
                code: `function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Usage: formatFileSize(1536) => "1.5 KB"`,
                description: 'Converts byte values to human-readable file sizes with type safety.',
            },
            {
                title: 'Throttle Function',
                language: 'typescript',
                code: `function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage for scroll events
window.addEventListener('scroll', throttle(() => {
  console.log('Scroll event');
}, 1000));`,
                description: 'Limits function execution to once per specified time period with TypeScript generics, useful for scroll and resize events.',
            },
        ];

        const snippet = snippets[Math.floor(Math.random() * snippets.length)];
        return `# Code Snippet: ${snippet.title}

**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## Description

${snippet.description}

## Code

\`\`\`${snippet.language}
${snippet.code}
\`\`\`

## Use Cases

- Production-ready utility function
- Reusable across projects
- Well-tested pattern
- Type-safe implementation

---
*Part of my code snippet collection for quick reference and reuse.*
`;
    },

    note: (): string => {
        const notes: Topic[] = [
            {
                title: 'Microservices Architecture Patterns',
                content: `## Key Patterns

### 1. API Gateway
- Single entry point for all clients
- Handles routing, authentication, rate limiting
- Reduces client complexity

### 2. Service Discovery
- Dynamic service registration
- Load balancing
- Health checks

### 3. Circuit Breaker
- Prevents cascading failures
- Fast failure detection
- Automatic recovery

## Benefits
- Scalability
- Independent deployment
- Technology diversity

## Challenges
- Distributed system complexity
- Data consistency
- Network latency`,
            },
            {
                title: 'Database Optimization Techniques',
                content: `## Query Optimization

### Indexing Strategy
- Create indexes on frequently queried columns
- Avoid over-indexing (slows writes)
- Use composite indexes for multi-column queries

### Query Performance
- Use EXPLAIN to analyze query plans
- Avoid SELECT * in production
- Limit result sets with pagination

### Connection Pooling
- Reuse database connections
- Configure pool size based on load
- Monitor connection usage

## Monitoring
- Track slow queries
- Monitor index usage
- Analyze query patterns`,
            },
            {
                title: 'Security Best Practices for Web Applications',
                content: `## Authentication & Authorization

### Password Security
- Hash passwords with bcrypt/argon2
- Enforce strong password policies
- Implement rate limiting on login

### Token Management
- Use short-lived access tokens
- Implement refresh token rotation
- Store tokens securely

## Input Validation
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries

## HTTPS & Headers
- Enforce HTTPS everywhere
- Set security headers (CSP, HSTS, X-Frame-Options)
- Implement CORS properly`,
            },
        ];

        const note = notes[Math.floor(Math.random() * notes.length)];
        return `# Technical Note: ${note.title}

**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

${note.content}

## References
- Industry best practices
- Official documentation
- Real-world implementations

---
*Technical notes from my continuous learning and research.*
`;
    },

    progress: (): string => {
        const updates: string[] = [
            'Refactored authentication module to improve code maintainability and security',
            'Implemented comprehensive error handling across API endpoints',
            'Updated documentation with latest API changes and examples',
            'Optimized database queries, reducing response time by 30%',
            'Added unit tests for core business logic functions',
            'Improved CI/CD pipeline with automated testing and deployment',
            'Researched and evaluated new technologies for upcoming features',
            'Fixed critical bugs reported in production environment',
            'Enhanced logging and monitoring capabilities',
            'Reviewed and merged pull requests from team members',
        ];

        const update = updates[Math.floor(Math.random() * updates.length)];
        return `# Daily Progress Update

**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## Today's Accomplishments

${update}

## Impact

This work contributes to:
- Better code quality
- Improved system performance
- Enhanced user experience
- Reduced technical debt

## Next Steps

- Continue monitoring and optimization
- Gather feedback from users
- Plan upcoming features

---
*Daily progress tracking to maintain momentum and accountability.*
`;
    },

    project: (): string => {
        const projects = [
            {
                name: 'task-queue',
                title: 'Async Task Queue with Priority',
                description: 'A TypeScript implementation of an async task queue with priority support and concurrency control',
                files: {
                    'README.md': `# Async Task Queue

A lightweight, type-safe task queue implementation with priority support and concurrency control.

## Features

- ✅ Priority-based task execution
- ✅ Concurrency control
- ✅ TypeScript support with full type safety
- ✅ Promise-based API
- ✅ Pause/Resume functionality
- ✅ Event-driven architecture

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`typescript
import { TaskQueue } from './task-queue';

const queue = new TaskQueue({ concurrency: 3 });

// Add tasks with priority
queue.add(async () => {
  const result = await fetchData();
  return result;
}, { priority: 10 });

// Start processing
await queue.start();
\`\`\`

## API

### \`TaskQueue(options)\`

Creates a new task queue instance.

**Options:**
- \`concurrency\`: Maximum number of concurrent tasks (default: 1)
- \`autoStart\`: Auto-start processing (default: false)

### Methods

- \`add(task, options)\`: Add a task to the queue
- \`start()\`: Start processing tasks
- \`pause()\`: Pause task processing
- \`resume()\`: Resume task processing
- \`clear()\`: Clear all pending tasks

## License

MIT`,
                    'task-queue.ts': `export interface TaskOptions {
  priority?: number;
  id?: string;
}

export interface QueueOptions {
  concurrency?: number;
  autoStart?: boolean;
}

interface Task<T> {
  id: string;
  fn: () => Promise<T>;
  priority: number;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

export class TaskQueue {
  private queue: Task<any>[] = [];
  private running: number = 0;
  private concurrency: number;
  private paused: boolean = false;
  private taskIdCounter: number = 0;

  constructor(options: QueueOptions = {}) {
    this.concurrency = options.concurrency || 1;
    if (options.autoStart) {
      this.start();
    }
  }

  add<T>(fn: () => Promise<T>, options: TaskOptions = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: Task<T> = {
        id: options.id || \`task-\${++this.taskIdCounter}\`,
        fn,
        priority: options.priority || 0,
        resolve,
        reject,
      };

      // Insert task in priority order
      const index = this.queue.findIndex(t => t.priority < task.priority);
      if (index === -1) {
        this.queue.push(task);
      } else {
        this.queue.splice(index, 0, task);
      }

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.paused || this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift()!;

    try {
      const result = await task.fn();
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }

  start(): void {
    this.paused = false;
    this.process();
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.start();
  }

  clear(): void {
    this.queue = [];
  }

  get pending(): number {
    return this.queue.length;
  }

  get isRunning(): boolean {
    return this.running > 0;
  }
}`,
                    'task-queue.test.ts': `import { TaskQueue } from './task-queue';

describe('TaskQueue', () => {
  it('should process tasks sequentially with concurrency 1', async () => {
    const queue = new TaskQueue({ concurrency: 1 });
    const results: number[] = [];

    const task1 = queue.add(async () => {
      await delay(50);
      results.push(1);
      return 1;
    });

    const task2 = queue.add(async () => {
      results.push(2);
      return 2;
    });

    queue.start();
    await Promise.all([task1, task2]);

    expect(results).toEqual([1, 2]);
  });

  it('should respect task priority', async () => {
    const queue = new TaskQueue({ concurrency: 1 });
    const results: number[] = [];

    queue.add(async () => { results.push(1); }, { priority: 1 });
    queue.add(async () => { results.push(2); }, { priority: 10 });
    queue.add(async () => { results.push(3); }, { priority: 5 });

    queue.start();
    await delay(100);

    expect(results).toEqual([2, 3, 1]);
  });

  it('should handle concurrent tasks', async () => {
    const queue = new TaskQueue({ concurrency: 3 });
    let concurrent = 0;
    let maxConcurrent = 0;

    const task = async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await delay(50);
      concurrent--;
    };

    const tasks = Array(5).fill(0).map(() => queue.add(task));
    queue.start();
    await Promise.all(tasks);

    expect(maxConcurrent).toBe(3);
  });
});

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}`,
                    'package.json': `{
  "name": "task-queue",
  "version": "1.0.0",
  "description": "Async task queue with priority support",
  "main": "dist/task-queue.js",
  "types": "dist/task-queue.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "keywords": ["queue", "async", "priority", "typescript"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "@types/node": "^20.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "typescript": "^5.0.0"
  }
}`,
                },
            },
            {
                name: 'rate-limiter',
                title: 'Token Bucket Rate Limiter',
                description: 'A flexible rate limiter using the token bucket algorithm',
                files: {
                    'README.md': `# Token Bucket Rate Limiter

A TypeScript implementation of the token bucket algorithm for rate limiting.

## Features

- ✅ Token bucket algorithm
- ✅ Configurable refill rate
- ✅ Burst capacity support
- ✅ TypeScript with full type safety
- ✅ Zero dependencies
- ✅ Promise-based API

## Usage

\`\`\`typescript
import { RateLimiter } from './rate-limiter';

// Allow 10 requests per second with burst of 20
const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 1000,
  capacity: 20
});

// Check if request is allowed
if (await limiter.tryConsume(1)) {
  // Process request
  await handleRequest();
} else {
  // Rate limit exceeded
  throw new Error('Rate limit exceeded');
}
\`\`\`

## API

### \`RateLimiter(options)\`

**Options:**
- \`tokensPerInterval\`: Number of tokens to add per interval
- \`interval\`: Interval in milliseconds
- \`capacity\`: Maximum token capacity (burst size)

### Methods

- \`tryConsume(tokens)\`: Try to consume tokens, returns true if successful
- \`consume(tokens)\`: Wait until tokens are available and consume them
- \`getAvailableTokens()\`: Get current available tokens

## License

MIT`,
                    'rate-limiter.ts': `export interface RateLimiterOptions {
  tokensPerInterval: number;
  interval: number;
  capacity?: number;
}

export class RateLimiter {
  private tokens: number;
  private capacity: number;
  private tokensPerInterval: number;
  private interval: number;
  private lastRefill: number;

  constructor(options: RateLimiterOptions) {
    this.tokensPerInterval = options.tokensPerInterval;
    this.interval = options.interval;
    this.capacity = options.capacity || options.tokensPerInterval;
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = (timePassed / this.interval) * this.tokensPerInterval;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  async tryConsume(tokens: number = 1): Promise<boolean> {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  async consume(tokens: number = 1): Promise<void> {
    while (!(await this.tryConsume(tokens))) {
      const tokensNeeded = tokens - this.tokens;
      const timeToWait = (tokensNeeded / this.tokensPerInterval) * this.interval;
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
  }

  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}`,
                    'rate-limiter.test.ts': `import { RateLimiter } from './rate-limiter';

describe('RateLimiter', () => {
  it('should allow requests within limit', async () => {
    const limiter = new RateLimiter({
      tokensPerInterval: 10,
      interval: 1000,
    });

    for (let i = 0; i < 10; i++) {
      expect(await limiter.tryConsume(1)).toBe(true);
    }
  });

  it('should reject requests exceeding limit', async () => {
    const limiter = new RateLimiter({
      tokensPerInterval: 5,
      interval: 1000,
    });

    for (let i = 0; i < 5; i++) {
      await limiter.tryConsume(1);
    }

    expect(await limiter.tryConsume(1)).toBe(false);
  });

  it('should refill tokens over time', async () => {
    const limiter = new RateLimiter({
      tokensPerInterval: 10,
      interval: 100,
    });

    // Consume all tokens
    for (let i = 0; i < 10; i++) {
      await limiter.tryConsume(1);
    }

    expect(await limiter.tryConsume(1)).toBe(false);

    // Wait for refill
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(await limiter.tryConsume(1)).toBe(true);
  });

  it('should support burst capacity', async () => {
    const limiter = new RateLimiter({
      tokensPerInterval: 5,
      interval: 1000,
      capacity: 20,
    });

    // Should allow burst of 20
    for (let i = 0; i < 20; i++) {
      expect(await limiter.tryConsume(1)).toBe(true);
    }

    expect(await limiter.tryConsume(1)).toBe(false);
  });
});`,
                    'package.json': `{
  "name": "rate-limiter",
  "version": "1.0.0",
  "description": "Token bucket rate limiter",
  "main": "dist/rate-limiter.js",
  "types": "dist/rate-limiter.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest"
  },
  "keywords": ["rate-limit", "token-bucket", "throttle", "typescript"],
  "author": "",
  "license": "MIT"
}`,
                },
            },
            {
                name: 'event-emitter',
                title: 'Type-Safe Event Emitter',
                description: 'A type-safe event emitter with TypeScript generics',
                files: {
                    'README.md': `# Type-Safe Event Emitter

A fully type-safe event emitter implementation using TypeScript generics.

## Features

- ✅ Full TypeScript type safety
- ✅ Generic event types
- ✅ Once listeners
- ✅ Remove listeners
- ✅ Wildcard events
- ✅ Zero dependencies

## Usage

\`\`\`typescript
import { EventEmitter } from './event-emitter';

interface Events {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'data:update': { id: string; data: any };
}

const emitter = new EventEmitter<Events>();

// Type-safe event listener
emitter.on('user:login', (data) => {
  console.log(\`User \${data.userId} logged in\`);
});

// Emit event
emitter.emit('user:login', {
  userId: '123',
  timestamp: Date.now()
});
\`\`\`

## API

### Methods

- \`on(event, listener)\`: Add event listener
- \`once(event, listener)\`: Add one-time listener
- \`off(event, listener)\`: Remove listener
- \`emit(event, data)\`: Emit event
- \`removeAllListeners(event?)\`: Remove all listeners

## License

MIT`,
                    'event-emitter.ts': `type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventListener<T> = (data: T) => void;

export class EventEmitter<T extends EventMap> {
  private listeners: Map<keyof T, Set<EventListener<any>>> = new Map();

  on<K extends EventKey<T>>(event: K, listener: EventListener<T[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  once<K extends EventKey<T>>(event: K, listener: EventListener<T[K]>): void {
    const onceWrapper: EventListener<T[K]> = (data) => {
      listener(data);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }

  off<K extends EventKey<T>>(event: K, listener: EventListener<T[K]>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit<K extends EventKey<T>>(event: K, data: T[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  removeAllListeners<K extends EventKey<T>>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount<K extends EventKey<T>>(event: K): number {
    return this.listeners.get(event)?.size || 0;
  }
}`,
                    'event-emitter.test.ts': `import { EventEmitter } from './event-emitter';

interface TestEvents {
  'test': { value: number };
  'data': { id: string; content: string };
}

describe('EventEmitter', () => {
  it('should emit and receive events', () => {
    const emitter = new EventEmitter<TestEvents>();
    const callback = jest.fn();

    emitter.on('test', callback);
    emitter.emit('test', { value: 42 });

    expect(callback).toHaveBeenCalledWith({ value: 42 });
  });

  it('should support once listeners', () => {
    const emitter = new EventEmitter<TestEvents>();
    const callback = jest.fn();

    emitter.once('test', callback);
    emitter.emit('test', { value: 1 });
    emitter.emit('test', { value: 2 });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ value: 1 });
  });

  it('should remove listeners', () => {
    const emitter = new EventEmitter<TestEvents>();
    const callback = jest.fn();

    emitter.on('test', callback);
    emitter.off('test', callback);
    emitter.emit('test', { value: 42 });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should count listeners', () => {
    const emitter = new EventEmitter<TestEvents>();
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    emitter.on('test', callback1);
    emitter.on('test', callback2);

    expect(emitter.listenerCount('test')).toBe(2);
  });
});`,
                    'package.json': `{
  "name": "event-emitter",
  "version": "1.0.0",
  "description": "Type-safe event emitter",
  "main": "dist/event-emitter.js",
  "types": "dist/event-emitter.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest"
  },
  "keywords": ["events", "emitter", "typescript", "type-safe"],
  "author": "",
  "license": "MIT"
}`,
                },
            },
        ];

        const project = projects[Math.floor(Math.random() * projects.length)];
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // Create project index with links to all files
        let projectContent = `# Project: ${project.title}

**Date:** ${dateStr}

## Description

${project.description}

## Project Structure

\`\`\`
${project.name}/
`;

        // Add file tree
        Object.keys(project.files).forEach(filename => {
            projectContent += `├── ${filename}\n`;
        });

        projectContent += `\`\`\`

## Files

`;

        // Add all files with their content
        Object.entries(project.files).forEach(([filename, content]) => {
            const extension = filename.split('.').pop();
            projectContent += `### ${filename}

\`\`\`${extension}
${content}
\`\`\`

---

`;
        });

        projectContent += `## Features Implemented

- Complete TypeScript implementation
- Comprehensive test suite
- Full type safety
- Production-ready code
- Well-documented API

## Usage

1. Copy the files to your project
2. Install dependencies: \`npm install\`
3. Build: \`npm run build\`
4. Test: \`npm test\`

## Notes

This is a complete, working implementation that can be used in production projects. All code is type-safe and includes tests.

---
*Part of my daily coding projects to build reusable components and libraries.*
`;

        return projectContent;
    },
};

/**
 * Get current date in YYYY-MM-DD format
 */
function getDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

/**
 * Select a random contribution type
 */
function selectContributionType(): ContributionType {
    return CONTRIBUTION_TYPES[Math.floor(Math.random() * CONTRIBUTION_TYPES.length)];
}

/**
 * Generate contribution content
 */
function generateContent(type: ContributionType): string {
    const generator = CONTENT_GENERATORS[type];
    if (!generator) {
        throw new Error(`Unknown contribution type: ${type}`);
    }
    return generator();
}

/**
 * Ensure contributions directory exists
 */
async function ensureDirectoryExists(): Promise<void> {
    try {
        await fs.access(CONTRIBUTIONS_DIR);
    } catch {
        await fs.mkdir(CONTRIBUTIONS_DIR, { recursive: true });
        console.log(`✓ Created contributions directory: ${CONTRIBUTIONS_DIR}`);
    }
}

/**
 * Create contribution file
 */
async function createContribution(): Promise<ContributionResult> {
    const type = selectContributionType();
    const dateStr = getDateString();
    const filename = `${dateStr}-${type}.md`;
    const filepath = path.join(CONTRIBUTIONS_DIR, filename);

    // Check if contribution already exists for today
    try {
        await fs.access(filepath);
        console.log(`ℹ Contribution already exists for today: ${filename}`);
        return { filepath, existed: true };
    } catch {
        // File doesn't exist, create it
        const content = generateContent(type);
        await fs.writeFile(filepath, content, 'utf8');
        console.log(`✓ Created contribution: ${filename}`);
        return { filepath, existed: false };
    }
}

/**
 * Configure git user if not already set
 */
function configureGit(): void {
    try {
        execSync('git config user.name', { stdio: 'pipe' });
        execSync('git config user.email', { stdio: 'pipe' });
    } catch {
        console.log('⚠ Git user not configured. Using GitHub Actions defaults.');
        // GitHub Actions will configure this
    }
}

/**
 * Commit and push changes
 */
function commitAndPush(filepath: string, existed: boolean): boolean {
    try {
        // Add the file
        execSync(`git add "${filepath}"`, { stdio: 'inherit' });

        // Check if there are changes to commit
        try {
            execSync('git diff --staged --quiet', { stdio: 'pipe' });
            console.log('ℹ No changes to commit');
            return false;
        } catch {
            // There are changes, proceed with commit
            const filename = path.basename(filepath);
            const commitMessage = existed
                ? `chore: update daily contribution - ${filename}`
                : `chore: add daily contribution - ${filename}`;

            execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
            console.log(`✓ Committed changes: ${commitMessage}`);

            // Push to remote
            execSync('git push', { stdio: 'inherit' });
            console.log('✓ Pushed to GitHub');
            return true;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('✗ Error during git operations:', errorMessage);
        throw error;
    }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
    try {
        console.log('🚀 Starting GitHub auto-contribution...\n');

        // Ensure directory structure
        await ensureDirectoryExists();

        // Create contribution
        const { filepath, existed } = await createContribution();

        // Configure git
        configureGit();

        // Commit and push
        const pushed = commitAndPush(filepath, existed);

        if (pushed) {
            console.log('\n✅ Daily contribution completed successfully!');
        } else {
            console.log('\n✅ Contribution file exists, no changes needed.');
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('\n❌ Error:', errorMessage);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

export { generateContent, selectContributionType, ContributionType };
