# Workflow Guide — Working with Claude & Sanity

**Quick Reference for Breeze Motion Studio Website Development**

---

## 🚀 Starting a Development Session

### 1. Open Required Applications

**Terminal (Warp):**
- Open Warp and navigate to project directory:
  ```bash
  cd C:\Users\Rebek\breeze-motion-studio
  ```

**Browser Tabs (prepare these URLs):**
- 🎨 **Sanity Studio:** `http://localhost:3333` (content editing)
- 🌐 **Next.js Website:** `http://localhost:3000` (live preview)
- 📊 **Sanity Dashboard:** `https://sanity.io/manage` (cloud management)
- 🚀 **Vercel Dashboard:** `https://vercel.com` (deployment status)
- 💬 **Claude Code:** Already open in Warp

### 2. Start Development Services

**Open two terminal windows/tabs in Warp:**

**Terminal 1 — Sanity Studio:**
```bash
npm run dev
# Runs on http://localhost:3333
# Keep this running throughout your session
```

**Terminal 2 — Next.js Website:**
```bash
cd web
npm run dev
# Runs on http://localhost:3000
# Keep this running throughout your session
```

### 3. Verify Everything is Running

- ✅ Sanity Studio loads at `:3333`
- ✅ Next.js site loads at `:3000`
- ✅ No error messages in terminals
- ✅ Claude Code is ready in Warp

---

## 💡 Working with Claude During Your Session

### Essential Claude Commands

**Get Help:**
```
/help
```

**Commit Changes (with git):**
```
/commit
```

**Review Current Tasks:**
```
show me the task list
```

**Update Documentation:**
```
update the vault documents with latest developments
```

### Useful Prompts for Common Tasks

#### Schema Changes
```
"Add a new field to the [documentType] schema for [description]"

"Create a new schema type called [name] with fields: [list fields]"

"Update the [field] validation in [schema] to [requirements]"
```

#### Content Work
```
"Help me populate the site settings in Sanity Studio"

"Create placeholder content for the homepage"

"Add [number] sample projects to the studio with realistic data"
```

#### Frontend Development
```
"Build the [ComponentName] component with [description]"

"Implement the [page] page using data from Sanity"

"Add responsive styling to [component] following the design system"
```

#### Troubleshooting
```
"Why isn't my [field/component] showing up?"

"Debug this error: [paste error message]"

"Check if the Sanity query for [content] is correct"
```

#### Documentation & Planning
```
"Show me what's left to build"

"Create a task list for implementing [feature]"

"Document the current state of [feature/system]"

"What should I prioritize next?"
```

### Best Practices During Sessions

1. **Make incremental changes** — Test after each significant change
2. **Check both :3000 and :3333** — Ensure changes work in Studio and frontend
3. **Save Sanity content** — Always click "Publish" after editing in Studio
4. **Commit frequently** — Use `/commit` after completing discrete tasks
5. **Keep docs updated** — Ask Claude to update vault documents periodically
6. **Read Claude's output** — Review file paths and changes before proceeding

### Quick Reference: What Runs Where

| Service | Port | Purpose | How to Access |
|---------|------|---------|---------------|
| **Sanity Studio** | 3333 | Content editing interface | `localhost:3333` |
| **Next.js Frontend** | 3000 | Public website preview | `localhost:3000` |
| **Sanity API** | Cloud | Content delivery | Automatic (via queries) |
| **Claude Code** | Terminal | AI development assistant | Warp terminal |

---

## 🎨 Working in Sanity Studio

### Content Editing Workflow

1. **Open Studio:** `http://localhost:3333`
2. **Navigate to content type** (e.g., "Home Page", "Projects", "Studios")
3. **Edit fields** — Make your changes
4. **Save draft** — Ctrl+S / Cmd+S (auto-saves as draft)
5. **Publish** — Click "Publish" button to make live
6. **Check frontend** — Refresh `localhost:3000` to see changes

### Studio Tips

- **Drafts vs Published:** Drafts are NOT visible on the frontend until published
- **Required fields:** Red asterisk (*) means field is required before publishing
- **Image uploads:** Use the "Upload" button, always add alt text
- **References:** Click "+ Add" to link documents (clients, studios, etc.)
- **Order matters:** Use "displayOrder" fields to control sorting on frontend

### Common Studio Tasks

**Site Settings (Global):**
```
Sanity Studio → Site Settings
- Update contact email, phone, social links
- Upload logos
- Set default meta description
- Publish
```

**Homepage Content:**
```
Sanity Studio → Home Page
- Edit hero title, subtitle, CTAs
- Toggle featured projects (set `featured: true` on projects)
- Add process steps
- Publish
```

**Adding a New Project:**
```
Sanity Studio → Projects → Create
- Fill in title (slug generates automatically)
- Select client (or create new client first)
- Select studio
- Add cover image with alt text
- Write summary and description
- Publish
```

---

## 🔄 End of Session Checklist

### 1. Review Changes

**In Terminal:**
```bash
git status
git diff
```

**Ask Claude:**
```
"Show me what files have changed"
"Summarize the work we completed today"
```

### 2. Commit Your Work

**Using Claude's /commit command:**
```
/commit
```

Claude will:
- Review all changed files
- Draft a descriptive commit message
- Create the commit with proper attribution

**Or manually:**
```bash
git add [files]
git commit -m "Description of changes"
```

### 3. Update Vault Documentation

**Ask Claude:**
```
"Update the vault documents with latest developments"
```

This updates:
- `docs/PROJECT_STATUS.md` — Progress log
- `docs/ARCHITECTURE.md` — Technical decisions
- `docs/CONTENT_MODEL.md` — Schema changes
- `docs/DESIGN_SYSTEM.md` — Design implementation

### 4. Push to GitHub (Optional)

**If ready to push:**
```bash
git push origin master
```

**Note:** Vercel will auto-deploy when you push to GitHub (if configured)

### 5. Stop Development Services

**In both terminal windows:**
- Press `Ctrl+C` to stop the dev servers
- Confirm shutdown

### 6. Review Next Steps

**Ask Claude before closing:**
```
"What should I work on next session?"
"Create a task list for the next priorities"
```

---

## 🛠️ Troubleshooting Common Issues

### Issue: Changes Not Showing on Frontend

**Checklist:**
1. Did you **Publish** in Sanity Studio? (not just save draft)
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check if query is correct (ask Claude to review)
4. Check browser console for errors (F12 → Console tab)

### Issue: Sanity Studio Won't Load

**Solutions:**
```bash
# Stop the server (Ctrl+C) and restart:
npm run dev

# If that doesn't work, clear cache:
rm -rf .sanity
npm run dev
```

### Issue: Next.js Site Shows Error

**Check terminal for errors:**
- Read the error message carefully
- Copy error to Claude: `"Debug this error: [paste]"`
- Check if environment variables are set (`.env.local` files)

### Issue: Git Conflicts

**Ask Claude:**
```
"Help me resolve this git conflict"
```

**Or manually:**
```bash
git status          # See conflicted files
# Edit files, resolve conflicts
git add [files]
git commit
```

### Issue: Can't Find a File

**Ask Claude:**
```
"Where is the [filename] located?"
"Find all files related to [feature]"
```

---

## 📋 Quick Command Reference

### Git Commands
```bash
git status                    # See what's changed
git diff                      # See detailed changes
git add .                     # Stage all changes
git commit -m "message"       # Commit with message
git push origin master        # Push to GitHub
git log --oneline -5          # See recent commits
```

### Development Commands
```bash
# From project root
npm run dev                   # Start Sanity Studio
npm run build                 # Build Studio for production
npm run deploy                # Deploy Studio to Sanity Cloud

# From /web directory
cd web
npm run dev                   # Start Next.js dev server
npm run build                 # Build for production
npm run start                 # Run production build locally
npm run lint                  # Check for code issues
```

### Claude Commands
```bash
/help                         # Get help
/commit                       # Create git commit
/clear                        # Clear conversation
```

---

## 💎 Pro Tips

### Productivity
1. **Use Claude as your copilot** — Ask questions, don't struggle alone
2. **Test immediately** — Check `:3000` after every frontend change
3. **Publish early** — Don't wait to publish Sanity content; drafts don't appear on site
4. **Keep terminals visible** — Watch for errors and warnings
5. **Save your prompts** — If a prompt works well, save it for reuse

### Content Management
1. **Fill required fields first** — Can't publish without them
2. **Use consistent naming** — Titles, slugs, and IDs should be clear
3. **Add alt text to images** — Required for accessibility, helps SEO
4. **Set display order** — Control how content appears on the frontend
5. **Featured items** — Toggle `featured` on best work for homepage

### Development Workflow
1. **Schema changes require rebuild** — Restart dev servers after schema changes
2. **Read Claude's explanations** — Understand what's being changed
3. **One feature at a time** — Complete and test before moving on
4. **Commit working code** — Don't commit broken features
5. **Update docs regularly** — Keeps vault current for future sessions

### Safety
1. **Test locally first** — Don't push untested code
2. **Check git status before committing** — Review what's staged
3. **Keep `.env.local` private** — Never commit API keys or tokens
4. **Backup important content** — Export from Sanity if making major changes
5. **Use branches for experiments** — Keep master stable

---

## 🎯 Session Templates

### Quick Content Update Session
```
1. Start Sanity Studio only (npm run dev)
2. Edit content in Studio at :3333
3. Publish changes
4. Commit: /commit
5. Optional: Push to trigger deployment
```

### Feature Development Session
```
1. Start both services (Studio + Next.js)
2. Ask Claude: "Plan implementation for [feature]"
3. Build feature incrementally
4. Test at :3000 and :3333
5. Commit when working: /commit
6. Update docs: "update vault documents"
```

### Bug Fix Session
```
1. Start both services
2. Reproduce bug
3. Ask Claude: "Debug this issue: [description]"
4. Apply fix
5. Test thoroughly
6. Commit: /commit
```

### Planning Session
```
1. No services needed
2. Ask Claude: "Review project status"
3. Ask: "What should we prioritize?"
4. Ask: "Create task list for [goal]"
5. Update docs: "update vault documents"
```

---

## 📚 Additional Resources

- **Project Docs:** `C:\Users\Rebek\breeze-motion-studio\docs\`
- **CLAUDE.md:** Main project documentation
- **Sanity Docs:** https://www.sanity.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS Docs:** https://tailwindcss.com/docs

---

**Remember:** Claude is here to help! Ask questions, request explanations, and iterate. Development is collaborative between you, Claude, Sanity, and your code. 🚀
