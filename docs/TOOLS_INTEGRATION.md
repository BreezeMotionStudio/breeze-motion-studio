# Tools Integration Overview

**How Your Development Stack Connects Together**

---

## 🎯 Quick Overview

Your website is powered by **5 interconnected tools**, each handling a specific part of the system:

```
┌─────────────┐
│    Warp     │  Your terminal + Claude Code (AI assistant)
│   (Local)   │  Where you write commands and code
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Local Development                     │
│                                                           │
│  ┌──────────────┐              ┌──────────────┐         │
│  │    Sanity    │◄────────────►│   Next.js    │         │
│  │    Studio    │   Fetches    │   Website    │         │
│  │  :3333       │   Content    │   :3000      │         │
│  └──────┬───────┘              └──────┬───────┘         │
│         │                             │                  │
└─────────┼─────────────────────────────┼─────────────────┘
          │                             │
          │                             │
          ▼                             ▼
┌─────────────────┐          ┌─────────────────┐
│  Sanity Cloud   │          │     GitHub      │
│  (Content Lake) │          │  (Code Repo)    │
│                 │          │                 │
│  • Documents    │          │  • Source code  │
│  • Images       │          │  • Version ctrl │
│  • API access   │          │  • Backup       │
└─────────┬───────┘          └────────┬────────┘
          │                           │
          │                           │
          │                           ▼
          │                  ┌─────────────────┐
          │                  │     Vercel      │
          │                  │  (Deployment)   │
          │                  │                 │
          └─────────────────►│  • Builds site  │
                             │  • Hosts live   │
                             │  • Auto-deploy  │
                             └─────────────────┘
```

---

## 🧩 The Tools Explained

### 1. **Warp (Terminal + Claude Code)**

**What it does:**
- Your command-line terminal application
- Hosts Claude Code (AI development assistant)
- Where you run development commands, git operations, and interact with Claude

**What you do here:**
- Start/stop development servers (`npm run dev`)
- Run git commands (`git commit`, `git push`)
- Ask Claude for help and guidance
- Execute build and deployment commands

**Connections:**
- Talks to: **Local file system**, **Git/GitHub**, **Claude AI**
- Does NOT directly connect to Sanity or Vercel (you use commands that do)

---

### 2. **Sanity Studio (Local :3333)**

**What it does:**
- Content editing interface (like WordPress admin)
- Runs on your computer at `localhost:3333`
- Real-time sync with Sanity Cloud

**What you do here:**
- Create, edit, and publish content (projects, pages, settings)
- Upload images and media
- Manage content structure
- All changes sync immediately to Sanity Cloud when published

**Connections:**
- Talks to: **Sanity Cloud** (real-time sync)
- Lives in: Your local file system (the code)
- Independent from: Next.js website (they both connect to Sanity Cloud separately)

**Important Notes:**
- Studio code is in the **project root** (`/`)
- Changes to Studio structure require rebuilding (restart `npm run dev`)
- **Drafts** are local only; **Published** content goes to Sanity Cloud

---

### 3. **Next.js Website (Local :3000)**

**What it does:**
- Your public-facing website (frontend)
- Runs on your computer at `localhost:3000`
- Fetches content from Sanity Cloud and displays it

**What you do here:**
- Preview the website as you build it
- See how content from Sanity looks on the actual site
- Test responsive design, interactions, and features

**Connections:**
- Talks to: **Sanity Cloud** (fetches published content via API)
- Lives in: `/web` directory
- Independent from: Sanity Studio (they both use Sanity Cloud as the data source)

**Important Notes:**
- Only shows **published** content from Sanity (not drafts)
- Automatically refreshes when you make code changes
- Must be running (`cd web && npm run dev`) to preview

---

### 4. **Sanity Cloud (Content Lake)**

**What it does:**
- Cloud database that stores all your content
- Provides API for fetching content
- Handles image optimization and delivery (CDN)
- Syncs with both Studio and Next.js

**What you do here:**
- Usually nothing directly — it's automatic
- Occasionally visit https://sanity.io/manage to:
  - Check usage/analytics
  - Manage project settings
  - Add team members
  - View API tokens

**Connections:**
- Talks to: **Sanity Studio** (receives published content), **Next.js** (delivers content via API), **Vercel** (delivers content to production site)
- Accessed by: API calls with your project ID (`ce9w3sdr`)

**Important Notes:**
- This is the **single source of truth** for all content
- When you "Publish" in Studio, it goes here
- When Next.js fetches data, it comes from here
- Images are stored here and served via CDN

---

### 5. **GitHub (Code Repository)**

**What it does:**
- Stores your source code (version control)
- Tracks changes over time (commits)
- Acts as backup for your code
- Triggers Vercel deployments

**What you do here:**
- Usually nothing directly — you use `git` commands in Warp
- Occasionally visit https://github.com to:
  - Review commit history
  - Check repository status
  - Manage branches (if using)
  - Review deployment triggers

**Connections:**
- Talks to: **Vercel** (triggers auto-deploy when you push code)
- Accessed by: Git commands in Warp (`git push`, `git pull`)
- Stores: Only code, NOT content (content is in Sanity)

**Important Notes:**
- Code goes to GitHub, content goes to Sanity
- Pushing to GitHub triggers Vercel to rebuild and deploy
- Your local work isn't on GitHub until you `git push`

---

### 6. **Vercel (Production Hosting)**

**What it does:**
- Builds your Next.js site for production
- Hosts the live website at your domain
- Automatically deploys when you push to GitHub
- Provides HTTPS, CDN, and performance optimization

**What you do here:**
- Visit https://vercel.com to:
  - Check deployment status
  - View build logs if something fails
  - Manage domains and environment variables
  - Monitor site performance

**Connections:**
- Talks to: **GitHub** (watches for new commits), **Sanity Cloud** (fetches content when building)
- Triggered by: Pushing code to GitHub
- Delivers: Production website to your domain

**Important Notes:**
- Deployments are automatic (push to GitHub → Vercel builds & deploys)
- Build failures appear in Vercel dashboard
- Production site fetches content from Sanity Cloud (same as local)
- Environment variables (API keys) must be set in Vercel dashboard

---

## 🔄 Data Flow Examples

### Example 1: Creating a New Project

```
You (in Studio at :3333)
    ↓
1. Create project → add details → upload images
    ↓
2. Click "Publish"
    ↓
Sanity Cloud (Content Lake)
    ↓
3. Content is now available via API
    ↓
Next.js (:3000 locally)
    ↓
4. Refresh page → project appears
    ↓
(Same flow for production via Vercel)
```

### Example 2: Deploying Code Changes

```
You (in Warp terminal)
    ↓
1. Make code changes → save files
    ↓
2. Test at :3000 → looks good
    ↓
3. git add . → git commit → git push
    ↓
GitHub (receives your code)
    ↓
4. Triggers webhook to Vercel
    ↓
Vercel
    ↓
5. Pulls code from GitHub
6. Fetches content from Sanity Cloud
7. Builds Next.js site
8. Deploys to production domain
    ↓
Live website updated! 🎉
```

### Example 3: Editing Homepage Content

```
You (in Studio at :3333)
    ↓
1. Navigate to "Home Page"
2. Edit hero title
3. Click "Publish"
    ↓
Sanity Cloud
    ↓
4. Content updated in database
    ↓
Next.js (:3000)
    ↓
5. Refresh → new title shows immediately
    ↓
Production (Vercel)
    ↓
6. New title shows there too (no deployment needed!)
```

**Key Insight:** Content changes don't require code deployment. They're instant!

---

## 🔐 Authentication & Access

### How Tools Authenticate

| Tool | How it Accesses Things | Where Credentials Live |
|------|------------------------|------------------------|
| **Sanity Studio** | Project ID + User login | `sanity.config.ts` + Browser session |
| **Next.js** | API tokens | `.env.local` (local) + Vercel env vars (production) |
| **GitHub** | SSH keys or personal token | Git config on your machine |
| **Vercel** | GitHub OAuth | Linked via Vercel dashboard |
| **Claude Code** | Anthropic API key | Warp/system configuration |

### Project Identifiers

| Resource | ID/Value |
|----------|----------|
| **Sanity Project ID** | `ce9w3sdr` |
| **Sanity Dataset** | `production` |
| **Vercel Project ID** | `prj_4gOS5f8whFepZKtL84dlIioD07eX` |
| **GitHub Repo** | `breeze-motion-studio` |
| **Domain** | `breezemotionstudio.com` (pending DNS) |

---

## ⚡ Key Concepts

### Local vs Cloud vs Production

**Local (Your Computer):**
- Sanity Studio at `:3333`
- Next.js at `:3000`
- Code in file system
- Fast, private, for development only

**Cloud (Sanity):**
- Content storage (documents, images)
- Always in sync with Studio
- Accessed by both local and production sites
- Single source of truth for content

**Production (Vercel):**
- Live website on your domain
- Automatically built and deployed
- Fetches content from Sanity Cloud
- What your clients/visitors see

### Content vs Code

**Content** (lives in Sanity):
- Text, images, project data
- Edited in Sanity Studio
- Changes are instant (no deployment needed)
- Published → immediately live

**Code** (lives in Git/Vercel):
- Website structure, design, components
- Edited in code editor (via Claude)
- Changes require deployment (git push)
- Push → Vercel builds → goes live (~2-5 min)

---

## 🚨 Common Misunderstandings

### "I published in Sanity, but changes aren't on :3000"

**Problem:** Changes are published in Sanity Cloud, but Next.js hasn't refetched yet

**Solution:**
- Hard refresh browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)
- Or restart Next.js dev server

---

### "I changed code, but Vercel didn't update"

**Problem:** You changed code locally but didn't push to GitHub

**Solution:**
```bash
git add .
git commit -m "description"
git push origin master
```

Vercel deploys when GitHub receives the push.

---

### "Studio changes disappeared"

**Problem:** You saved a draft but didn't publish

**Solution:** Sanity has two states:
- **Draft** — only you see it in Studio
- **Published** — visible everywhere (frontend, production)

Always click "Publish" to make changes live.

---

### "Site is broken on Vercel but works locally"

**Problem:** Environment variables not set in Vercel

**Solution:**
- Go to Vercel dashboard → Project Settings → Environment Variables
- Add same variables from local `.env.local`
- Redeploy

---

## 🎓 Summary: Who Does What

| Tool | Primary Role | You Interact Via |
|------|--------------|------------------|
| **Warp** | Terminal + AI assistant | Keyboard commands, asking Claude |
| **Sanity Studio** | Content management | Web browser at :3333 |
| **Next.js** | Website preview | Web browser at :3000 |
| **Sanity Cloud** | Content storage | Automatic (via Studio & Next.js) |
| **GitHub** | Code version control | Git commands in Warp |
| **Vercel** | Production hosting | Automatic (triggered by GitHub) |

---

## 💡 Mental Model

Think of your website like a **restaurant**:

- **Warp + Claude** = Your kitchen and chef (where work happens)
- **Sanity Studio** = The menu-writing desk (where you write content)
- **Sanity Cloud** = The menu storage (where menu versions are kept)
- **Next.js (local)** = Kitchen tasting (preview before serving)
- **GitHub** = Recipe book (version control for recipes)
- **Vercel** = The restaurant dining room (what customers see)

**When you update the menu:**
- Write changes in Studio (menu desk)
- Publish to Sanity Cloud (menu storage)
- Menu appears in dining room immediately (no rebuild needed)

**When you remodel the kitchen:**
- Change code locally (rearrange kitchen)
- Test with :3000 (try out new kitchen)
- Push to GitHub (document changes)
- Vercel deploys (opens remodeled restaurant to customers)

---

**Bottom Line:** Sanity handles content, GitHub handles code, Vercel handles hosting, and Claude helps you build it all. Each tool has a clear job, and they work together seamlessly! 🚀
