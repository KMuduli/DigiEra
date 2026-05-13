// DigitalEra - Database Seed Script
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DigitalEra database...\n');

  // ── Create Admin User ──
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@digitalera.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@digitalera.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user created: ${admin.email} (password: admin123)`);

  // ── Create Categories ──
  const categoryData = [
    { name: 'Technology', slug: 'technology', description: 'Latest in tech, gadgets, and innovation' },
    { name: 'Programming', slug: 'programming', description: 'Coding tutorials, tips, and best practices' },
    { name: 'Web Development', slug: 'web-development', description: 'Frontend, backend, and full-stack web development' },
    { name: 'AI & Machine Learning', slug: 'ai-machine-learning', description: 'Artificial intelligence and ML insights' },
    { name: 'Productivity', slug: 'productivity', description: 'Tools and tips to boost your productivity' },
    { name: 'Reviews', slug: 'reviews', description: 'Product and software reviews' },
  ];

  const categories = [];
  for (const cat of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
  }
  console.log(`✅ ${categories.length} categories created`);

  // ── Create Tags ──
  const tagData = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'React', slug: 'react' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'Python', slug: 'python' },
    { name: 'Docker', slug: 'docker' },
    { name: 'CSS', slug: 'css' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'PostgreSQL', slug: 'postgresql' },
    { name: 'AI', slug: 'ai' },
    { name: 'Tutorial', slug: 'tutorial' },
  ];

  const tags = [];
  for (const t of tagData) {
    const tag = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
    tags.push(tag);
  }
  console.log(`✅ ${tags.length} tags created`);

  // ── Create Sample Articles ──
  const articles = [
    {
      title: 'Getting Started with React 18: A Complete Guide',
      slug: 'getting-started-with-react-18',
      excerpt: 'Learn the fundamentals of React 18 including concurrent features, automatic batching, and new hooks that make building UIs more efficient.',
      content: `<h2>Introduction to React 18</h2>
<p>React 18 introduces several groundbreaking features that fundamentally change how we build user interfaces. In this comprehensive guide, we'll explore the key features and how to get started.</p>

<h3>Concurrent Rendering</h3>
<p>The biggest addition in React 18 is concurrent rendering. This allows React to prepare multiple versions of the UI at the same time. It's not a feature per se, but a new behind-the-scenes mechanism that enables React to prepare UI updates without blocking the main thread.</p>

<h3>Automatic Batching</h3>
<p>React 18 introduces automatic batching for all state updates, regardless of where they originate. Previously, React only batched updates inside React event handlers. Now, updates inside timeouts, promises, native event handlers, and any other event are batched automatically.</p>

<pre><code class="language-javascript">
// Before React 18 - these would cause two re-renders
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);

// In React 18 - these are automatically batched into one re-render
</code></pre>

<h3>New Hooks</h3>
<p><strong>useId</strong>: Generates unique IDs that are stable across server and client rendering.</p>
<p><strong>useTransition</strong>: Marks updates as transitions, telling React they can be interrupted.</p>
<p><strong>useDeferredValue</strong>: Lets you defer re-rendering a non-urgent part of the tree.</p>

<h3>Getting Started</h3>
<p>To start using React 18, simply update your project:</p>
<pre><code class="language-bash">npm install react@18 react-dom@18</code></pre>

<h3>Conclusion</h3>
<p>React 18 is a significant milestone that brings concurrent features to the mainstream. By adopting these new capabilities, you can create more responsive user experiences while keeping your codebase clean and maintainable.</p>`,
      categoryId: categories[2].id, // Web Development
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-15'),
      metaTitle: 'Getting Started with React 18 - Complete Guide | DigitalEra',
      metaDesc: 'Learn React 18 fundamentals including concurrent features, automatic batching, and new hooks.',
      views: 1523,
      tags: { connect: [{ id: tags[1].id }, { id: tags[0].id }, { id: tags[9].id }] },
    },
    {
      title: 'Building RESTful APIs with Node.js and Express',
      slug: 'building-restful-apis-nodejs-express',
      excerpt: 'A step-by-step tutorial on creating production-ready REST APIs using Node.js, Express, and modern best practices.',
      content: `<h2>Building Production-Ready REST APIs</h2>
<p>REST APIs form the backbone of modern web applications. In this tutorial, we'll build a complete API server using Node.js and Express with proper error handling, validation, and security.</p>

<h3>Project Structure</h3>
<p>A well-organized project structure is crucial for maintainability:</p>
<pre><code>server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── index.js
├── prisma/
├── uploads/
└── package.json</code></pre>

<h3>Setting Up Express</h3>
<p>First, initialize your project and install dependencies. We'll use Express 4.x with essential middleware for security, logging, and request parsing.</p>

<h3>Middleware Stack</h3>
<p>A production API needs several middleware layers:</p>
<ul>
<li><strong>Helmet</strong> - Sets security headers</li>
<li><strong>CORS</strong> - Handles cross-origin requests</li>
<li><strong>Rate Limiting</strong> - Prevents abuse</li>
<li><strong>Morgan</strong> - HTTP request logging</li>
<li><strong>Error Handler</strong> - Centralized error handling</li>
</ul>

<h3>Authentication with JWT</h3>
<p>JSON Web Tokens provide stateless authentication. We'll implement secure login with httpOnly cookies to prevent XSS attacks.</p>

<h3>Conclusion</h3>
<p>Building a production-ready API requires attention to security, error handling, and code organization. Following these patterns will help you create scalable and maintainable backends.</p>`,
      categoryId: categories[1].id, // Programming
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-02-10'),
      metaTitle: 'Building RESTful APIs with Node.js and Express | DigitalEra',
      metaDesc: 'Step-by-step tutorial for creating production-ready REST APIs with Node.js and Express.',
      views: 2341,
      tags: { connect: [{ id: tags[2].id }, { id: tags[0].id }, { id: tags[9].id }] },
    },
    {
      title: 'Docker for Developers: From Zero to Production',
      slug: 'docker-for-developers-zero-to-production',
      excerpt: 'Master Docker containerization from basics to production deployment. Learn Dockerfile, Docker Compose, and best practices.',
      content: `<h2>Why Docker?</h2>
<p>Docker has revolutionized how we develop, ship, and run applications. By containerizing your apps, you ensure consistency across development, staging, and production environments.</p>

<h3>Core Concepts</h3>
<p><strong>Images</strong>: Read-only templates that contain your application and its dependencies.</p>
<p><strong>Containers</strong>: Running instances of images, isolated from the host system.</p>
<p><strong>Volumes</strong>: Persistent data storage that survives container restarts.</p>

<h3>Writing a Dockerfile</h3>
<pre><code class="language-dockerfile">FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/index.js"]</code></pre>

<h3>Docker Compose</h3>
<p>For multi-container applications, Docker Compose lets you define and manage all services in a single YAML file.</p>

<h3>Best Practices</h3>
<ul>
<li>Use multi-stage builds to reduce image size</li>
<li>Never run containers as root</li>
<li>Use .dockerignore to exclude unnecessary files</li>
<li>Pin specific image versions</li>
</ul>

<h3>Conclusion</h3>
<p>Docker simplifies deployment and ensures your application runs the same everywhere. Start containerizing your projects today!</p>`,
      categoryId: categories[0].id, // Technology
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-03-05'),
      metaTitle: 'Docker for Developers: Complete Guide | DigitalEra',
      metaDesc: 'Learn Docker from zero to production with practical examples and best practices.',
      views: 1876,
      tags: { connect: [{ id: tags[4].id }, { id: tags[2].id }, { id: tags[9].id }] },
    },
    {
      title: 'The Rise of AI-Powered Development Tools',
      slug: 'rise-of-ai-powered-development-tools',
      excerpt: 'Explore how AI is transforming software development with code assistants, automated testing, and intelligent debugging.',
      content: `<h2>AI is Changing How We Code</h2>
<p>Artificial intelligence is no longer just a buzzword in software development. AI-powered tools are actively transforming how developers write, review, and debug code. Let's explore the landscape.</p>

<h3>AI Code Assistants</h3>
<p>Tools like GitHub Copilot, Amazon CodeWhisperer, and Google's Gemini Code Assist are changing the development workflow. These tools can suggest entire functions, write boilerplate code, and even help with complex algorithms.</p>

<h3>Automated Testing with AI</h3>
<p>AI is making testing smarter by automatically generating test cases, identifying edge cases, and predicting where bugs are most likely to occur.</p>

<h3>Intelligent Debugging</h3>
<p>Modern AI tools can analyze error logs, stack traces, and code patterns to suggest fixes, significantly reducing debugging time.</p>

<h3>The Future</h3>
<p>As AI models become more capable, we can expect even deeper integration into the development lifecycle — from requirements analysis to deployment monitoring.</p>

<h3>Should You Worry?</h3>
<p>AI tools augment developers, they don't replace them. Understanding fundamentals and system design remains crucial. AI handles the repetitive work, freeing you to focus on architecture and creative problem-solving.</p>`,
      categoryId: categories[3].id, // AI & ML
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-04-20'),
      metaTitle: 'AI-Powered Development Tools: The Complete Overview | DigitalEra',
      metaDesc: 'How AI is transforming software development with code assistants, automated testing, and more.',
      views: 3102,
      tags: { connect: [{ id: tags[8].id }, { id: tags[9].id }] },
    },
    {
      title: '10 VS Code Extensions Every Developer Needs in 2024',
      slug: '10-vscode-extensions-developers-2024',
      excerpt: 'Boost your productivity with these essential VS Code extensions for web development, debugging, and code quality.',
      content: `<h2>Must-Have VS Code Extensions</h2>
<p>Visual Studio Code is the most popular code editor, and its extension ecosystem is what makes it truly powerful. Here are 10 extensions you should install right now.</p>

<h3>1. ESLint</h3>
<p>Automatically finds and fixes problems in your JavaScript/TypeScript code. Essential for code quality.</p>

<h3>2. Prettier</h3>
<p>An opinionated code formatter that ensures consistent styling across your entire codebase.</p>

<h3>3. GitLens</h3>
<p>Supercharges Git capabilities in VS Code. See blame annotations, file history, and compare branches effortlessly.</p>

<h3>4. Thunder Client</h3>
<p>A lightweight REST API client built into VS Code. Perfect for testing APIs without leaving your editor.</p>

<h3>5. Auto Rename Tag</h3>
<p>Automatically renames paired HTML/XML tags. A small timesaver that adds up.</p>

<h3>6. Better Comments</h3>
<p>Color-codes your comments by type: alerts, queries, TODOs, and highlights.</p>

<h3>7. Error Lens</h3>
<p>Highlights errors and warnings inline, making them impossible to miss.</p>

<h3>8. Path Intellisense</h3>
<p>Autocompletes filenames and paths in your imports.</p>

<h3>9. Docker</h3>
<p>Manage containers, images, and compose files directly from VS Code.</p>

<h3>10. Material Theme</h3>
<p>A beautiful theme that makes coding more enjoyable with carefully chosen colors.</p>

<h3>Conclusion</h3>
<p>The right extensions can dramatically improve your development experience. Try these out and customize your VS Code setup for maximum productivity!</p>`,
      categoryId: categories[4].id, // Productivity
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-05-01'),
      metaTitle: '10 Best VS Code Extensions for Developers 2024 | DigitalEra',
      metaDesc: 'Essential VS Code extensions for web developers to boost productivity and code quality.',
      views: 4210,
      tags: { connect: [{ id: tags[0].id }, { id: tags[9].id }] },
    },
    {
      title: 'PostgreSQL vs MongoDB: Choosing the Right Database',
      slug: 'postgresql-vs-mongodb-choosing-right-database',
      excerpt: 'A detailed comparison of PostgreSQL and MongoDB to help you choose the best database for your next project.',
      content: `<h2>The Database Dilemma</h2>
<p>Choosing between SQL and NoSQL databases is one of the most important architectural decisions in any project. Let's compare two industry leaders.</p>

<h3>PostgreSQL: The Relational Powerhouse</h3>
<p>PostgreSQL is an advanced, open-source relational database known for reliability, data integrity, and extensibility.</p>
<ul>
<li>ACID compliance</li>
<li>Complex queries and joins</li>
<li>JSON support (best of both worlds)</li>
<li>Strong typing and constraints</li>
</ul>

<h3>MongoDB: The Flexible Document Store</h3>
<p>MongoDB stores data in flexible JSON-like documents, making it ideal for applications with evolving schemas.</p>
<ul>
<li>Schema flexibility</li>
<li>Horizontal scaling</li>
<li>Great for unstructured data</li>
<li>Built-in replication</li>
</ul>

<h3>When to Use PostgreSQL</h3>
<p>Choose PostgreSQL when you need strong data consistency, complex relationships, and ACID transactions — think e-commerce, finance, and CMS platforms.</p>

<h3>When to Use MongoDB</h3>
<p>Choose MongoDB for rapid prototyping, real-time analytics, IoT data, and applications where schema flexibility is critical.</p>

<h3>Verdict</h3>
<p>There's no universal "best" database. Understand your data relationships, query patterns, and scaling needs before deciding.</p>`,
      categoryId: categories[5].id, // Reviews
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-06-12'),
      metaTitle: 'PostgreSQL vs MongoDB Comparison | DigitalEra',
      metaDesc: 'Detailed comparison of PostgreSQL and MongoDB to help you choose the right database.',
      views: 2890,
      tags: { connect: [{ id: tags[7].id }, { id: tags[9].id }] },
    },
    {
      title: 'CSS Grid vs Flexbox: When to Use Which',
      slug: 'css-grid-vs-flexbox-when-to-use',
      excerpt: 'Understanding the differences between CSS Grid and Flexbox, and knowing when to use each for optimal layouts.',
      content: `<h2>Layout Tools Compared</h2>
<p>Both CSS Grid and Flexbox are powerful layout systems, but they excel at different things. Understanding when to use each will level up your CSS game.</p>

<h3>Flexbox: One-Dimensional Layouts</h3>
<p>Flexbox is designed for one-dimensional layouts — either a row or a column. It excels at distributing space and aligning items along a single axis.</p>

<h3>CSS Grid: Two-Dimensional Layouts</h3>
<p>CSS Grid is designed for two-dimensional layouts — rows AND columns simultaneously. It's perfect for complex page layouts and grid-based designs.</p>

<h3>Use Flexbox When:</h3>
<ul>
<li>Aligning items in a navbar</li>
<li>Centering content vertically and horizontally</li>
<li>Creating flexible card rows</li>
<li>Building responsive controls</li>
</ul>

<h3>Use CSS Grid When:</h3>
<ul>
<li>Creating page layouts with header, sidebar, content, footer</li>
<li>Building image galleries</li>
<li>Designing dashboard layouts</li>
<li>Any layout that needs both row and column control</li>
</ul>

<h3>They Work Together!</h3>
<p>The best approach often combines both: use Grid for the overall page layout and Flexbox for component-level alignment within grid cells.</p>`,
      categoryId: categories[2].id, // Web Development
      authorId: admin.id,
      status: 'DRAFT',
      metaTitle: 'CSS Grid vs Flexbox Guide | DigitalEra',
      metaDesc: 'Learn when to use CSS Grid vs Flexbox for optimal web layouts.',
      views: 0,
      tags: { connect: [{ id: tags[5].id }, { id: tags[9].id }] },
    },
  ];

  for (const articleData of articles) {
    const { tags: tagConnect, ...data } = articleData;
    await prisma.article.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, tags: tagConnect },
    });
  }
  console.log(`✅ ${articles.length} articles created (${articles.filter(a => a.status === 'PUBLISHED').length} published, ${articles.filter(a => a.status === 'DRAFT').length} draft)`);

  // ── Create Sample Comments ──
  const publishedArticle = await prisma.article.findFirst({ where: { status: 'PUBLISHED' } });
  if (publishedArticle) {
    await prisma.comment.createMany({
      data: [
        { content: 'Great article! Very helpful for beginners.', authorName: 'John Doe', authorEmail: 'john@example.com', articleId: publishedArticle.id, approved: true },
        { content: 'Thanks for sharing this comprehensive guide!', authorName: 'Jane Smith', authorEmail: 'jane@example.com', articleId: publishedArticle.id, approved: true },
        { content: 'Could you write a follow-up on advanced patterns?', authorName: 'Alex Johnson', authorEmail: 'alex@example.com', articleId: publishedArticle.id, approved: false },
      ],
      skipDuplicates: true,
    });
    console.log('✅ 3 sample comments created');
  }

  console.log('\n🎉 Seeding complete!');
  console.log('─────────────────────────────');
  console.log('Admin Login Credentials:');
  console.log('  Email:    admin@digitalera.com');
  console.log('  Password: admin123');
  console.log('─────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
