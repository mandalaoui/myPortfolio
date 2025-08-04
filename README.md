
# 💼 Omer Mandalaoui – Portfolio Website

A sleek and interactive **3D Developer Portfolio** built with modern frontend technologies.  
Showcases featured **university** and **independent projects**, some with demo videos, external links, and rich visual interactions.

---

## ✨ Features

- 🌐 Responsive fullstack developer portfolio
- 🎬 Live video demo on hover
- 🧊 3D animated hero section (Three.js + React Three Fiber)
- 💡 Tech tag filtering and interactive layout
- 🖱️ Horizontal scroll with smart arrows
- 🪞 Tilt & glare effect on project cards
- 🎥 Modal-based video player

---

## 🧠 Tech Stack

| Area              | Technology                                    |
|-------------------|-----------------------------------------------|
| UI Framework      | **React** + ReactDOM                          |
| 3D & Canvas       | **Three.js** + **@react-three/fiber** + drei |
| Animations        | **react-tilt**, CSS Transitions               |
| Icons             | **react-icons** (FontAwesome)                |
| Styling           | **CSS Modules** + Custom Responsive Design    |
| Deployment        | Local / GitHub Pages / Netlify                |

---

## 📁 Project Structure
portfolio-v2/
│
├── public/ # Static assets (images/videos)
│ ├── images/
│ └── videos/
│
├── src/
│ ├── components/ # Reusable components (Modal, Tag)
│ ├── data/ # Project metadata (projects.js)
│ ├── sections/
│ │ ├── heroSection/ # Hero3D.jsx + CSS
│ │ └── projectSection/ # Projects, ProjectCard, styles
│ ├── styles/ # Global CSS files
│ └── App.jsx # Main component
│
└── README.md

---

## 🚀 Installation & Running

```bash
# Clone the project
git clone https://github.com/mandalaoui/portfolio-v2.git
cd portfolio-v2

# Install dependencies
npm install

# Start development server
npm start
```

### ⚙️ Required Dependencies

Installed using:

```bash
npm install --legacy-peer-deps
```

Includes:

- **Core 3D rendering**: `three`, `@react-three/fiber`, `@react-three/drei`
- **Tilt and icon support**: `react-tilt`, `react-icons`

### 🔐 .env Configuration

To avoid unnecessary source map generation during build, add the following file:

`.env`

Content:

```env
GENERATE_SOURCEMAP=false
```

This keeps the production build lighter and cleaner.

### 🖼 Media Assets

Place your assets here:

```
public/
├── images/    →  .png/.jpg previews
└── videos/    →  .mp4 demo videos
```

Reference them in `src/data/projects.js`:

```js
image: "/images/Netfilm.png",
video: "/videos/Netfilm.mp4",
```

---

## ✅ Completed Milestones

- Responsive Hero 3D section
- Modular card system with tags
- Project list with scroll + arrows
- Watch Demo modal
- Project video-on-hover
- Code clean-up + restructuring
- Deployment to GitHub Pages

---

## ⏭️ Next Steps

- Add light/dark mode toggle
- Improve SEO & metadata
- Add contact form section
- Enhance mobile layout further
- Option to filter by tech stack
- Internationalization support (i18n)

---

## 🧑‍💻 Created by

**Omer Mandalaoui**  
[Portfolio](https://mandalaoui.github.io) • [GitHub](https://github.com/mandalaoui)
