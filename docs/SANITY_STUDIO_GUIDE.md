# Sanity Studio Interface Guide

**Complete Walkthrough of Your Content Management System**

---

## 🎨 **Top Bar (Header)**

| Element | What It Does |
|---------|--------------|
| **"Breeze Motion Studio"** (with dropdown) | Project switcher - click to switch between Sanity projects (if you have multiple) |
| **➕ Plus icon** | Quick create - add a new document (project, case study, client, etc.) |
| **🔍 Search icon** | Global search - find any document across your entire Studio |
| **Structure / Vision tabs** | Switch between Structure view (what you're in now) and Vision (GROQ query testing tool) |
| **Icons on far right** | Calendar, Drafts menu, notifications, user settings, updates, etc. |

---

## 📁 **Left Sidebar — Your Content Navigation**

This is your **content structure** - organized by the custom `structure.ts` file we created. These are NOT pages on your website, but **content types** and **singleton documents**.

### **Top Section — Site Configuration**
- **⚙️ Site Settings** — Global settings (logo, contact info, social links, footer text)

### **Second Section — Singleton Pages**
These are **single documents** (only one exists):
- **🏠 Home Page** — Controls homepage content (hero, featured work, CTAs)
- **👤 About Page** — Founder bio, mission, how we work
- **✉️ Contact Page** — Contact form intro, display email

These control the content for their respective pages on your website.

### **Third Section — Portfolio Content**
These are **collections** (you can create many of each):
- **🎨 Studios** — Your 4 studio definitions (Machine, Commercial, Creative, Media Systems)
- **🖼️ Projects** — Individual portfolio projects (the main content of your site)
- **📄 Case Studies** — In-depth project write-ups

### **Fourth Section — Supporting Content**
- **👥 Clients** — Client profiles (companies you've worked with)
- **💬 Testimonials** — Client quotes and reviews
- **💡 Service Categories** — Service groupings (e.g., "Video & Motion Graphics")

**The arrow (›) next to each** means clicking opens a list of all documents of that type.

---

## 📝 **Main Content Area — Document Editor**

This is where you edit the actual content. The interface changes based on what document type you're editing.

### **Status Indicators (Top)**
- **🟢 Published** — This document has a published version (live on website)
- **⚪ Draft** — You have unpublished changes

**Possible States:**
- 🟢 **Published only** = No unpublished changes (synced with live site)
- 🟢 **Published + ⚪ Draft** = You have unpublished changes (draft differs from live)
- ⚪ **Draft only** = Never been published yet (not visible on live site)

### **Field Groups (Tabs)**

Fields are organized into logical sections to make editing easier.

**Example: Home Page has these tabs:**

| Tab | What's Inside |
|-----|---------------|
| **All fields** | Shows every field on the page (can be overwhelming - usually skip this) |
| **Hero Section** ⭐ | Hero title, subtitle, video, image, CTA buttons |
| **Studios Overview** | Studios section heading and intro text |
| **What We Do** | Services section content |
| **How We Work** | Process section with steps |
| **Final CTA** | Bottom call-to-action section |
| **SEO** | Meta title, description, OG image |

**How to use tabs:**
- Click a tab to see only those fields
- Changes are saved across all tabs
- Focus on one section at a time
- All tabs are published together when you hit "Publish"

### **Field Types You'll Encounter**

| Field Type | What It Looks Like | How to Use |
|------------|-------------------|------------|
| **String** | Single-line text box | Type text (titles, names, short descriptions) |
| **Text** | Multi-line text box | Longer text (summaries, descriptions) |
| **Block Content** | Rich text editor | Formatted content (bold, italic, headings, links) |
| **Image** | Upload area | Click to upload or drag & drop images |
| **Reference** | Dropdown selector | Select another document (client, studio, etc.) |
| **Array** | List with "+ Add" button | Multiple items (gallery images, process steps) |
| **URL** | Text input with validation | Web addresses (video URLs, website links) |
| **Boolean** | Toggle switch | Yes/No options (featured on homepage?) |
| **Number** | Number input | Display order, counts, years |

### **Bottom Bar**
- **"Last published [time] ago"** — Shows when this document was last published
- **🔵 Publish button** — Click to make your changes live (Draft → Published)
- **⋯ More options** — Additional actions (duplicate, delete, inspect, etc.)

---

## 🎯 **What You'll Use Most**

### **Daily Content Editing:**
1. **Home Page** — Update hero, featured work callouts, CTAs
2. **Projects** — Add new portfolio work (this will be your most frequent task)
3. **Studios** — Occasionally update studio descriptions

### **Initial Setup (Do Once):**
1. **Site Settings** — Set up contact info, social links, logos
2. **Service Categories** — Define your service offerings
3. **Clients** — Add approved clients
4. **Studios** — Define your 4 studios (Machine, Commercial, Creative, Media Systems)

### **Ongoing (As Needed):**
1. **Case Studies** — Create detailed project narratives (selective - not every project)
2. **Testimonials** — Add client quotes as you receive them
3. **About Page** — Update founder bio, mission, process
4. **Contact Page** — Update contact info if it changes

---

## 🎬 **Common Workflows**

### **Adding a New Project**
```
1. Left sidebar → click "Projects" (click the arrow)
2. You'll see a list of existing projects (or empty if none yet)
3. Click "+ Create" button (top of list)
4. Fill in required fields:
   ✓ Title (required) — Project name
   ✓ Slug — Click "Generate" next to it (creates URL-friendly version)
   ✓ Client (required) — Select from dropdown (create client first if needed)
   ✓ Studio (required) — Select which studio this belongs to
   ✓ Cover Image (required) — Upload project image + add alt text
   ✓ Summary (required) — Short description (max 300 characters)
5. Optional fields:
   - Full description (rich text)
   - Gallery images
   - Video URL
   - Services provided
   - Year
   - Featured on homepage (toggle on/off)
6. Click "Publish" (bottom right)
7. Verify at localhost:3000
```

### **Editing Homepage Content**
```
1. Left sidebar → click "Home Page"
2. Use tabs to navigate sections (Hero, Studios, What We Do, etc.)
3. Edit fields in that section
4. Move to next tab if needed
5. Auto-saves as draft continuously
6. Click "Publish" when ready to make live
7. Check localhost:3000 to preview
```

### **Adding a Client (Before Adding Projects)**
```
1. Left sidebar → click "Clients" (arrow)
2. Click "+ Create"
3. Fill in:
   ✓ Name (required)
   ✓ Generate slug
   ✓ Industry (required)
   - Logo (optional)
   - Website URL (optional)
   ✓ Approved (required) — Toggle ON for public display
4. Click "Publish"
5. Now you can reference this client when creating projects
```

### **Creating a Studio Definition**
```
1. Left sidebar → click "Studios" (arrow)
2. Click "+ Create"
3. Fill in:
   ✓ Title (e.g., "Machine Studio")
   ✓ Generate slug (e.g., "machine")
   ✓ Purpose (what this studio does)
   ✓ Industries Served (list of industries)
   - Hero Image/Video (optional)
   ✓ Display Order (1, 2, 3, 4 for the four studios)
4. Click "Publish"
5. Repeat for all 4 studios
```

### **Setting Up Site Settings (Do This First)**
```
1. Left sidebar → click "Site Settings"
2. Fill in:
   ✓ Site Title: "Breeze Motion Studio"
   - Tagline (optional)
   ✓ Default Meta Description (for SEO)
   - Logo (upload your logo)
   - Logo Light Version (for dark backgrounds)
   ✓ Contact Email: info@breezemotionstudio.com
   - Phone/WhatsApp (optional)
   - Social Links (add platform + URL for each)
   - Footer Copyright Text
3. Click "Publish"
4. These settings appear across entire website
```

---

## 💡 **Key Concepts**

### **Singletons vs Collections**

**Singletons** (🏠 Home Page, 👤 About Page, ⚙️ Site Settings):
- Only ONE document exists
- Clicking in sidebar opens the document directly
- Used for unique pages and global settings
- Can't create more than one

**Collections** (📦 Projects, 👥 Clients, 🎨 Studios):
- MANY documents can exist
- Clicking in sidebar shows a list of all documents
- Click a specific document to edit it
- Use "+ Create" button to add new ones
- Think of them like folders with multiple files

### **Draft vs Published Workflow**

**The Two-State System:**

1. **Draft State** (⚪ Draft indicator)
   - Your working copy
   - Visible in Studio
   - Visible on localhost:3000 (development only)
   - NOT visible on production website
   - Auto-saves as you type

2. **Published State** (🟢 Published indicator)
   - Live version
   - Visible on production website
   - Visible to the world
   - Created when you click "Publish"

**Important Rules:**
- ✅ Always click **Publish** to make changes live
- ⚠️ Saving (Cmd/Ctrl+S) only creates a draft
- 📝 Drafts are NOT live until published
- 🔄 You can have both published + draft (means you have unpublished changes)
- 🗑️ "Discard draft" removes unpublished changes, keeps published version

### **References — Linking Documents**

Many fields let you **reference** other documents:

**Example:** When creating a Project, you select a Client
- Click the "Select" button
- Choose from list of existing clients
- Or click "+ Create" to make a new client on the spot
- The project now "links" to that client
- On the website, client name appears automatically

**Why this matters:**
- Update client info once, it updates everywhere
- No duplicate data entry
- Keeps content organized and connected

### **Required Fields**

Fields marked with a **red asterisk (*)** are required:
- You cannot publish without filling these in
- Publish button will be disabled if required fields are empty
- Error messages appear when you try to publish

### **Validation Rules**

Some fields have validation:
- **Email** — Must be valid email format
- **URL** — Must be valid web address
- **Max length** — Character limits (e.g., summary max 300 characters)
- **Slug** — Must be URL-safe (lowercase, hyphens only, no spaces)

---

## 🔧 **Top Right Menu Options**

Click the **three dots (•••)** in the top right of any document for:

| Option | What It Does |
|--------|--------------|
| **Duplicate** | Copy this document (useful for creating similar projects) |
| **Unpublish** | Remove published version (makes content private again) |
| **Discard draft** | Delete unpublished changes (keeps published version) |
| **Delete** | Permanently remove document (careful! can't undo) |
| **Inspect** | View raw JSON data (for developers/debugging) |
| **Review changes** | See differences between draft and published |
| **History** | View all past versions and who edited them |

---

## ⌨️ **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| **Cmd/Ctrl + S** | Save draft (auto-saves anyway, but forces immediate save) |
| **Cmd/Ctrl + Enter** | Publish document |
| **Cmd/Ctrl + K** | Open search (find any document quickly) |
| **Cmd/Ctrl + Alt + P** | Open publish dialog |
| **Esc** | Close dialogs/modals |

---

## 🚀 **Pro Tips**

### **Content Editing**
1. **Cmd/Ctrl + S** — Quick save (creates draft)
2. **Use tabs** — Don't try to fill everything at once; focus on one section
3. **Publish often** — Don't leave drafts sitting; publish when a section is done
4. **Check localhost:3000** — Always preview how content looks on the site
5. **Required fields** have a red asterisk (*) — Must be filled before publishing

### **Images & Media**
1. **Always add alt text** — Required for accessibility + helps SEO
2. **Use descriptive filenames** — Rename files before uploading (not "IMG_1234.jpg")
3. **Optimize before upload** — Large images slow down your site
4. **Hotspot feature** — Click and drag on images to set focus point for crops
5. **Gallery arrays** — Add multiple images with captions for project galleries

### **Organization**
1. **Use display order fields** — Control how items appear on frontend (lower numbers = first)
2. **Featured toggle** — Mark best projects as featured for homepage
3. **Consistent slugs** — Keep URL slugs short, clear, lowercase with hyphens
4. **Complete profiles** — Fill out as much as possible (incomplete data looks unprofessional)

### **Workflow**
1. **Create dependencies first** — Add clients before projects that reference them
2. **Test immediately** — Create → Publish → Check localhost:3000 → Iterate
3. **One document at a time** — Finish and publish before moving to next
4. **Review before publishing** — Double-check spelling, grammar, image quality
5. **Unpublish vs Delete** — Unpublish keeps content for later; delete is permanent

---

## 🛠️ **Troubleshooting**

### **"I can't see my changes on localhost:3000"**

**Checklist:**
1. ✅ Did you click **Publish** (not just save)?
2. ✅ Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. ✅ Is the Next.js dev server running? (Check terminal)
4. ✅ Check console for errors (F12 → Console tab in browser)

### **"Publish button is disabled"**

**Cause:** Required fields are not filled in

**Solution:**
- Look for red asterisks (*) next to field labels
- Fill in all required fields
- Publish button will activate

### **"I deleted something by accident"**

**Solution:**
1. Click the three dots (•••) → **History**
2. Find the version before deletion
3. Click **Restore** on that version
4. Or, if you have a published version and only deleted the draft, click "Discard draft"

### **"Images aren't uploading"**

**Common causes:**
- File too large (try compressing)
- Wrong file format (use JPG, PNG, WebP)
- Browser cache issue (hard refresh)
- Network connection problem

### **"Can't create a project - no clients in dropdown"**

**Solution:**
1. You need to create a client first
2. Go to Clients → Create client → Publish
3. Then return to Projects → Now client appears in dropdown

---

## 📊 **Understanding the Vision Tab**

**Vision** is Sanity's GROQ query testing tool (top navigation, next to "Structure").

**What it's for:**
- Testing queries before using them in code
- Debugging data structure issues
- Exploring your content database
- Advanced users only

**You probably won't need it** for day-to-day content editing, but it's useful for:
- Checking if content exists
- Testing search queries
- Understanding relationships between documents

---

## 📅 **Content Publishing Schedule Recommendation**

**When to publish immediately:**
- Homepage updates
- New client testimonials
- Service category changes
- Site settings updates

**When to batch publish:**
- Multiple new projects (add several, then publish all at once)
- Case studies (draft first, refine over time, publish when polished)
- Studio descriptions (get all 4 right before publishing)

**Draft workflow for big content:**
1. Create draft
2. Review over a day or two
3. Get feedback (if applicable)
4. Polish and refine
5. Publish when perfect

---

## 🎓 **Summary: Your Daily Studio Routine**

### **Morning Content Check**
```
1. Open localhost:3333
2. Check "Drafts" menu (top right) for any unfinished work
3. Finish and publish drafts
```

### **Adding New Work**
```
1. Create project → Fill fields → Upload images → Publish
2. Create case study if it's a significant project
3. Add testimonial if client provided one
4. Update homepage if project should be featured
```

### **Quick Content Updates**
```
1. Open relevant document (Home Page, About, etc.)
2. Edit specific field
3. Publish
4. Verify on localhost:3000
```

### **Before Closing Studio**
```
1. Check for unsaved drafts
2. Publish or discard drafts
3. Verify nothing is in "Draft" state unintentionally
```

---

## 📍 **Quick Reference**

**URL:** `http://localhost:3333`

**Most Used Actions:**
- Add Project: Left sidebar → Projects → + Create
- Edit Homepage: Left sidebar → Home Page
- Publish Changes: Blue "Publish" button (bottom right)
- Search Everything: Cmd/Ctrl + K or 🔍 icon
- Create New: ➕ icon (top bar)

**Status Meanings:**
- 🟢 Published = Live on website
- ⚪ Draft = Work in progress, not public yet
- 🟢 + ⚪ = Published + you have unpublished changes

---

**Remember:** Sanity Studio is your content control center. Everything you add, edit, or publish here appears on your website (after publishing). Take your time, publish often, and always preview on localhost:3000! 🚀

---

## 📊 Current Content Status (as of 2026-02-18 Night)

**🎉 All foundational content PUBLISHED and LIVE (75 documents total):**

**✅ Singleton Pages (Published):**
- **Site Settings (1)** — Fully configured with contact info, tagline, meta description
- **Home Page (1)** — Hero, studios overview, what we do, how we work, final CTA sections
- **About Page (1)** — Studio overview, mission, values, founder bio, services intro, process steps
- **Contact Page (1)** — Heading, intro text, contact email, form heading

**✅ Content Collections (Published):**
- **Studios (4)** — Machine, Commercial, Creative, Media Systems — all with full descriptions
- **Service Categories (10)** — All categories with concise, bullet-pointed descriptions and services lists
- **Clients (33)** — All approved clients published with industry classifications
  - Original 12: ROVD Group, SAR Electronics SA, Trihedron, Symec Digital, IDD, SOGA Organic, Cressi, Emily May Aesthetics, Bend Wellness, Equinox Consulting, Death By Coffee Roastery, Raylene Pilates
  - Additional 21: AE Manufacturing, Bennie Bekker, Daniel Meu Amor, Ecliptic Estate Management, Erin Smith, Gourmet Gecko, GuwasVisuals, Jame Fletcher, Tinaire Van De Merwe, MAVTECH Automation, Rooftop, Sebastian Geel, Shannon Lilley, AI Apparel Solutions, Burnera Collective, CORMA, Frankie & The Misfits, Hinterveld, S4 Integration, Volkswagen Eastern Cape, DRILLX
- **Testimonials (12)** — All client quotes published and linked to clients
- **Case Studies (12)** — All narrative deep-dives published with comprehensive content:
  - ROVD Group, SAR Electronics SA, Trihedron, Symec Digital, IDD (Machine Studio)
  - Cressi, Emily May Aesthetics, Bend Wellness, Equinox, Death By Coffee, Raylene, SOGA Organic (Commercial Studio)
  - Each with Challenge → Solution → Deliverables → Outcome structure
  - All linked to clients, studios, and testimonials
  - SEO fields populated
  - **Need images:** Cover images and gallery images for all case studies

**⏳ Still to Create:**
- **Projects** — Actual portfolio work (requires real project data and assets) — deferred by user

**Next Steps:**
1. Add images to all 12 case studies (cover + gallery images)
2. Create actual portfolio projects as work is completed
3. All content is LIVE and ready for Next.js frontend consumption
