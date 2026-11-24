# WiDS Frontend Portal (Winter in Data Science)

The official web portal for **Winter in Data Science (WiDS)**, presented by the **Analytics Club, IIT Bombay**.

Built using modern Next.js 16 App Router, React 19, and Tailwind CSS 4 with a custom cosmic Aurora theme. The portal provides an interactive experience for students to explore AI/ML projects, submit statements of purpose, and allows mentors to propose projects via a multi-step form with conditional co-mentorship workflows and cloud draft synchronization.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components & Client Components)
* **Library**: React 19
* **Styling**: Tailwind CSS 4 with PostCSS
* **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
* **Icons & Notifications**: Lucide React, React Icons, React Hot Toast
* **Authentication**: IIT Bombay Gymkhana OAuth2 SSO integration
* **Carousels / Sliders**: Swiper 9

---

## 📋 Prerequisites

Ensure you have the following installed:
* **Node.js** (v18.17.0 or higher, recommended v20 LTS)
* **npm** (v9+), **pnpm**, or **yarn**
* **Git**

---

## 🚀 Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ugac-iitb/wids-2025-frontend.git
cd wids-2025-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file by copying the template:
```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/apis-wids2025
NEXT_PUBLIC_CLIENT_ID=your_sso_client_id_here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/wids-2025/process-login/
```

### 4. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000/wids-2025/
```

> [!NOTE]
> The app is hosted under the base path `/wids-2025/`. Always access `http://localhost:3000/wids-2025/` rather than the root `http://localhost:3000/`.

---

## ⚙️ Environment Variables Reference

| Variable | Description | Local Dev Default | Production Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_DEBUG` | Enables debug logging & local mode | `true` | `false` |
| `NEXT_PUBLIC_API_URL` | Base URL of the Django backend | `http://127.0.0.1:8000/apis-wids2025` | `https://ugac.gymkhana.iitb.ac.in/apis-wids2025` |
| `NEXT_PUBLIC_CLIENT_ID`| Gymkhana OAuth2 Client ID | *Your Client ID* | *Production Client ID* |
| `NEXT_PUBLIC_REDIRECT_URI` | OAuth redirect URI callback | `http://localhost:3000/wids-2025/process-login/` | `https://ugac.gymkhana.iitb.ac.in/wids-2025/process-login/` |

---

## 🌐 Next.js BasePath Configuration

Because the site is hosted in production under a subdirectory on the IIT Bombay Gymkhana server, `next.config.js` configures:
```javascript
const nextConfig = {
  basePath: "/wids-2025",
  reactStrictMode: true,
};
```
* **Internal Next.js `<Link href="/about">`**: Automatically prefixes the link with `/wids-2025/about`.
* **Static Assets in `public/`**: When referencing images in standard `<img>` tags, prefix with `/wids-2025/` (e.g. `/wids-2025/images/logo/analytics-club-logo.jpeg`).
* **OAuth Redirect Callback**: Handled at `/wids-2025/process-login/`.

---

## 🔐 IIT Bombay SSO Login Flow

1. **Trigger**: When a user clicks **"Login with IITB SSO"** in the navigation bar, Mentor Portal, or Projects page, they are redirected to:
   ```text
   https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=<CLIENT_ID>&response_type=code&scope=basic%20profile%20ldap%20program&redirect_uri=<ENCODED_REDIRECT_URI>&state=some_state
   ```
2. **Callback**: Once authenticated by Gymkhana, the user is redirected back to `/wids-2025/process-login/?code=...`.
3. **Token Exchange**: `app/(site)/process-login/page.tsx` grabs the `code` parameter, makes a `POST` request to the backend endpoint `${API_URL}/auth/callback/`, and receives:
   * `access_token`
   * `token_type`
   * User profile (`name`, `email`, `roll_number`)
4. **State Persistence**: The token and profile are saved to `localStorage`, and an `authEvent` is broadcast to update UI components across the application.

> [!IMPORTANT]
> **Redirect URI Mismatch**: If you see `mismatching_redirect_uri` on the SSO login page, verify that your browser's current URL, scheme (`http` vs `https`), and port match the exact URI registered in the Gymkhana Developer Console.

---

## ✨ Key Features & Components

### 1. Multi-Step Mentor Registration Portal (`components/MentorPortal/`)
* **Dynamic Stepper Progress Bar**: Visual navigation bar indicating current, completed, and locked sections.
* **Conditional Co-Mentor Appendix**: If Question 9 (*"Do you want a Co-Mentor?"*) is answered with **"Yes"**, a dedicated **"Section 1 Appendix: Co-Mentor Details"** step opens dynamically.
* **Per-Section Form Validation**: Users cannot advance to the next section until all required fields of the active section are filled and valid.
* **Unrestricted Backward Navigation**: Mentors can freely return to previous sections at any point.
* **Dual-Layer Auto-Save**: Incomplete responses are automatically preserved in `localStorage` and continuously synced to the backend database as cloud drafts.
* **Final Submission Lock**: Once submitted, proposals are locked from further editing while remaining reviewable in read-only mode.

### 2. Projects & Preference Submission (`components/Projects/`, `components/Wishlist/`)
* Filter projects by **Domain** (NLP, Computer Vision, Agentic AI, Quant, Core ML, etc.), **Difficulty**, and **Project Category**.
* Add projects to personal wishlist.
* Submit Statements of Purpose (SOP) and ranked preferences for mentee selection.

### 3. Analytics Club Events Timeline (`app/(site)/about/page.tsx`)
* Curated chronological timeline of Analytics Club events and hackathons across the academic year.

---

## 📜 Available NPM Scripts

* **`npm run dev`**: Starts the Next.js development server on `http://localhost:3000/wids-2025`.
* **`npm run build`**: Compiles the application for production deployment with type-checking and asset optimization.
* **`npm run start`**: Starts the compiled production Next.js server.
* **`npm run lint`**: Runs ESLint to check for code quality and syntax issues.

---

## 🚢 Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Process Management with PM2
```bash
# Start or reload via PM2
pm2 start npm --name "wids-frontend" -- start -- -p 3000

# To save configuration across server reboots:
pm2 save
```

### 3. Nginx Reverse Proxy Configuration
```nginx
location /wids-2025/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## 📂 Repository Structure

```
wids-2025-frontend/
├── app/                          # Next.js 16 App Router
│   ├── (site)/                   # Grouped routes
│   │   ├── about/                # About Analytics Club & Events Timeline
│   │   ├── mentor/               # Mentor Registration & Proposal Portal
│   │   ├── projects/             # Projects Catalog & Filters
│   │   ├── wishlist/             # Saved Wishlist & Preference Ranking
│   │   ├── resources/            # Learning resources
│   │   └── process-login/        # SSO OAuth2 callback handler
│   ├── layout.tsx                # Global root layout & providers
│   └── page.tsx                  # Landing page (Hero, Timeline, Bootcamps)
├── components/                   # Modular UI components
│   ├── Header/                   # Navbar with SSO auth status
│   ├── Footer/                   # Global footer
│   ├── Hero/                     # Landing page hero section
│   ├── MentorPortal/             # Multi-step mentor proposal form & stepper
│   ├── Projects/                 # Project list & filter components
│   ├── Resources/                # Curated learning resources
│   └── Wishlist/                 # Mentee preference modal & list
├── lib/                          # Utility libraries & API constants
│   ├── api.ts                    # Fetch helpers
│   └── constants.js              # Environment-aware URLs & SSO credentials
├── public/                       # Static images, icons, and JSON data
├── types/                        # TypeScript type definitions
├── next.config.js                # BasePath and Next.js settings
├── package.json                  # Dependencies & scripts
├── .env.example                  # Environment configuration template
└── README.md                     # Documentation
```

---

## 🤝 Contributing
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Test your changes locally: `npm run build`
3. Commit your changes: `git commit -m "Add descriptive feature commit"`
4. Push to branch: `git push origin feature/your-feature-name`
5. Create a Pull Request on GitHub.
