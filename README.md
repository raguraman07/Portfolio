# RAGURAMAN Portfolio

## Description

A modern, responsive personal portfolio website showcasing my profile, skills, education, certifications, projects, resume, and contact information. Built with React, TypeScript, and Three.js, featuring a dynamic 3D ID card, animated welcome screen, and a fully integrated EmailJS contact form.

## Features

- ✅ Responsive Design — works seamlessly on Desktop, Laptop, Tablet, and Mobile
- ✅ Dark Theme — premium black-and-white visual identity throughout
- ✅ Smooth Animations — powered by Framer Motion with micro-interactions
- ✅ 3D Interactive ID Card — draggable lanyard card powered by Three.js + React Three Fiber + Rapier Physics
- ✅ Email Contact Form — EmailJS-integrated with validation, loading states, and success/error notifications
- ✅ Resume Download — direct PDF download on all screen sizes
- ✅ Mobile Friendly — hamburger menu, touch-optimized interactions
- ✅ SEO Optimized — Open Graph, Twitter Cards, meta tags
- ✅ Accessibility Improvements — ARIA labels, keyboard navigation, semantic HTML
- ✅ Tech Stack Globe — interactive 3D spinning sphere of technologies
- ✅ Portfolio Showcase — Projects, Certificates, and Tech tabs with swipe support

## Technologies

- **HTML5** — semantic, accessible markup
- **CSS3 + Tailwind CSS v4** — utility-first styling with custom animations
- **TypeScript + React 19** — type-safe component architecture
- **React Router v7** — client-side routing
- **Framer Motion** — declarative animations and page transitions
- **Three.js + @react-three/fiber** — 3D rendering engine
- **@react-three/drei** — Three.js helpers (GLTF, Environment, Lightformers)
- **@react-three/rapier** — physics simulation for the ID card lanyard
- **EmailJS** — email sending directly from the browser
- **Lucide React + React Icons** — icon libraries
- **Vite** — lightning-fast build tooling
- **AI-Assisted Development** — Antigravity AI (Google DeepMind)

## Folder Structure

```
portfolio/
├── public/
│   ├── assets/
│   │   ├── models/
│   │   │   └── RAGURAMAN.glb       # Custom 3D ID card model with your portrait
│   │   ├── resume/
│   │   │   └── RAGURAMAN_Resume.pdf # Your downloadable resume
│   │   ├── avatar.png              # Profile/avatar image used in About page
│   │   ├── card-front.png          # Card front face image
│   │   ├── kartu.glb               # Original reference GLB model
│   │   └── new.png                 # RAGU branding asset
│   └── favicon.ico                 # Browser tab icon
├── src/
│   ├── assets/
│   │   └── hero-eye.png            # Hero section background image
│   ├── components/
│   │   ├── BandCard.tsx            # 3D draggable ID card (Three.js + Physics)
│   │   ├── ContactSection.tsx      # Contact form (EmailJS) + social links + footer
│   │   ├── FrontendDeveloperSection.tsx  # "Cyber Security" about section with 3D card toggle
│   │   ├── Showcase.tsx            # Projects, Certificates, Tech Stack globe tabs
│   │   └── WelcomeScreen.tsx       # Animated loading splash screen
│   ├── pages/
│   │   └── About.tsx               # About Me page with resume download button
│   ├── App.tsx                     # Root component with routing and hero section
│   ├── main.tsx                    # React app entry point
│   └── styles.css                  # Tailwind CSS design system tokens
├── index.html                      # HTML shell with SEO meta tags
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
└── vercel.json                     # Vercel deployment configuration
```

## Installation

### Prerequisites

- Node.js v18 or later
- npm or bun

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/raguraman07/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:8080
```

## EmailJS Setup

The contact form is powered by EmailJS. To enable it:

1. Create a free account at [https://emailjs.com](https://emailjs.com)
2. Add an **Email Service** (Gmail, Outlook, etc.) and note the **Service ID**
3. Create an **Email Template** and note the **Template ID**
4. Copy your **Public Key** from Account → API Keys

Then open `src/components/ContactSection.tsx` and replace the placeholders at the top of the file:

```ts
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // ← paste here
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // ← paste here
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // ← paste here
```

### Recommended EmailJS Template Variables

Your EmailJS template should reference these variables:

| Variable | Description |
|---|---|
| `{{from_name}}` | Sender's name |
| `{{from_email}}` | Sender's email |
| `{{subject}}` | Message subject |
| `{{message}}` | Message body |

## Deployment

### Vercel (Recommended)

The project includes a `vercel.json` for SPA routing out of the box.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repository directly at [https://vercel.com](https://vercel.com) and it will auto-deploy on every push.

### Netlify

```bash
# Build the project
npm run build

# The output is in the /dist folder
# Upload /dist to Netlify drag-and-drop, or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

> ⚠️ For Netlify, add a `_redirects` file in the `/public` folder:
> ```
> /* /index.html 200
> ```

### GitHub Pages

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "vite build && gh-pages -d dist"

npm run deploy
```

> ⚠️ GitHub Pages requires the base URL to be set in `vite.config.ts`:
> ```ts
> base: "/your-repo-name/"
> ```

## Customization

### Update Resume

Replace the file at:
```
public/assets/resume/RAGURAMAN_Resume.pdf
```
Keep the same filename, or update the `href` in `src/App.tsx` and `src/pages/About.tsx`.

### Update Contact Information

Edit `src/components/ContactSection.tsx` — update the `href` values in the social icon links (LinkedIn, GitHub, Email).

### Update Skills

Edit the `techStack` array in `src/components/Showcase.tsx`.

### Update Projects

Edit the `projects` array in `src/components/Showcase.tsx`.

### Update Personal Text / About Me

Edit `src/pages/About.tsx` — the `<p>` paragraph blocks in the scrollable glass container.

### Update 3D ID Card Design

Edit the `CARD_CONFIG` object at the top of `src/components/BandCard.tsx`:

```ts
export const CARD_CONFIG = {
  name: "RAGURAMAN",
  role: "CS Engineering Student",
  specialization: "CYBER SECURITY ENTHUSIAST",
  id: "ID: RAGU-CSE-2026",
  accessLevel: "SECURITY ACCESS",
  badgeIcon: "🛡️"
};
```

### Replace the 3D GLB Model

Replace the file at:
```
public/assets/models/RAGURAMAN.glb
```
The model must have nodes named `card`, `clip`, and `clamp` matching the `kartu.glb` reference structure.

## Contact

**Email:** [raguramandhanasekaran@gmail.com](mailto:raguramandhanasekaran@gmail.com)

**GitHub:** [https://github.com/raguraman07](https://github.com/raguraman07)

**LinkedIn:** [https://linkedin.com/in/raguraman-d](https://linkedin.com/in/raguraman-d)

## License

MIT License — feel free to use this as inspiration for your own portfolio.
