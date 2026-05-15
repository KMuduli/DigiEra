# 📘 DigitalEra CMS - User Guide

Welcome to your professional Technology & Programming Blogging CMS! This guide explains how to manage your new platform effectively as an administrator.

---

## 1. Getting Started

### 🔐 Accessing the Admin Panel fgfgggg
1.  Navigate to your website URL.
2.  Click **Admin** in the top navigation bar or go directly to `/admin/login`.
3.  **Credentials**:
    *   **Email**: `admin@digitalera.com`
    *   **Password**: `admin123`

---

### http://localhost:5173/admin/login


## 2. Managing Content

### ✍️ Creating a New Article
1.  In the Admin sidebar, click **New Article**.
2.  **Title**: Enter a catchy, SEO-friendly title.
3.  **Editor**: Use the rich-text editor to format your content. You can add bold text, lists, quotes, and even code blocks.
4.  **Category**: Select a logical category for your post (managed in the Categories menu).
5.  **Featured Image**: Upload a high-quality cover photo.
6.  **Tags**: Type a tag (like "react" or "tutorial") and press **Enter**.
7.  **Status**: 
    *   **Save as Draft**: Keeps the post hidden for later work.
    *   **Publish**: Makes the post immediately visible on your homepage.

### 🔍 Search Engine Optimization (SEO)
At the bottom of the article editor, you'll find the **SEO Metadata** section:
*   **Meta Title**: How your page title appears in Google results.
*   **Meta Description**: The 2-line summary people see on Search Engines. 
*   **Expert Tip**: Keep the description under 160 characters for best results.

---

## 3. Organizing the Blog

### 📁 Category Management
Categories are the main "pillars" of your blog (e.g., Tech news, Coding Tutorials).
*   Go to **Categories** in the admin sidebar.
*   Add a name and description.
*   The system automatically creates a "Slug" URL for each category (e.g., `/category/tech`).

---

## 4. Community Management

### 💬 Comment Moderation
By default, all comments are submitted for review to prevent spam.
*   Go to **Comments** in the admin sidebar.
*   **Pending**: New comments that need your approval.
*   **Approved**: Thoughts that are already live on your site.
*   **Delete**: Click the trash icon to permanently remove unwanted entries.

---

## 5. Technical Maintenance

### 📊 Database View (Prisma Studio)
If you ever want to see your data in a spreadsheet format:
1.  Open your terminal.
2.  Run: `cd server && npx prisma studio`.
3.  Open [http://localhost:5555](http://localhost:5555) in your browser.

---

### 🚀 Production Deployment
Your code is fully configured for **Vercel**. When you push changes to GitHub, Vercel will automatically build and update your site.

**Happy Blogging!**
