#!/usr/bin/env ts-node

/**
 * GitHub Auto-Contribution Script
 * Generates legitimate daily contributions to maintain GitHub activity
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const CONTRIBUTIONS_DIR = path.join(__dirname, 'contributions');
const CONTRIBUTION_TYPES = ['til', 'snippet', 'note', 'progress'] as const;

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
