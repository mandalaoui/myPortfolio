
# 💼 Omer Mandalaoui – Portfolio Website

A sleek and interactive **3D Developer Portfolio** built with modern frontend technologies.  
Showcases featured **university** and **independent projects**, some with demo videos, external links, and rich visual interactions.

---

## ✨ Features

- 🌐 **Responsive fullstack developer portfolio**
- 🧊 **Fully animated 3D background** (Three.js + @react-three/fiber)
- 🦅 **Animated phoenix model** that follows mouse movement
- 📜 **FloatingCodeBlocks** animation for dynamic 3D code effect
- 🚀 **Smooth staged hero intro** — camera starts from space and zooms into scene
- 📁 Categorized project cards with:
  - 🎬 Live video demo on hover
  - 📦 Modal view for details
  - 🏷️ Tech tag filtering
- 📄 Resume section with animated reveal & download button
- 📬 Contact section with animated form & 3D-enhanced background
- 🖱️ Horizontal scroll with smart arrows
- ✨ Custom `reveal-line` animation with delay per element
- 🔄 IntersectionObserver-based entry animation for **all sections** (Hero, Projects, About, Skills, Resume, Contact)
- 📱 Mobile-responsive design with optimized layout for all screen sizes

---

## 🧠 Tech Stack

| Area              | Technology |
|-------------------|------------|
| **UI Framework**  | React + ReactDOM |
| **3D & Canvas**   | Three.js, @react-three/fiber, @react-three/drei |
| **Animations**    | CSS Transitions, Custom IntersectionObserver logic |
| **Custom Hooks**  | `useFadeAndLineObserver` (line/fade animations) |
| **Icons**         | react-icons (FontAwesome) |
| **Styling**       | CSS Modules + custom responsive design |
| **Deployment**    | GitHub Pages, Netlify |
| **3D Models**     | Mixamo (animations), Sketchfab (models) – *No Blender used* |

---

## 📁 Project Structure

portfolio-v2/
│
├── public/
│   ├── images/       →  .png/.jpg previews
│   ├── models/       →  .glb/.gltf 3D models
│   └── videos/       →  .mp4 demo videos
│
├── src/
│   ├── components/   →  Reusable (e.g. Modal, PhoenixModel, Backgrounds)
│   ├── data/         →  Project metadata (projects.js)
│   ├── hooks/        →  Custom hooks (e.g. useFadeAndLineObserver)
│   ├── sections/     
│   │   ├── heroSection/
│   │   ├── aboutSection/
│   │   ├── projectSection/
│   │   ├── resumeSection/
│   │   ├── skillsSection/
│   │   └── contactSection/
│   ├── styles/       →  Global styles and animations
│   └── App.jsx       →  Main entry component
│
└── README.md

---

## ✅ Recent Updates (August 2025)

### 🔹 Global Design & Animation
- `reveal-line` animation on all sections with **custom delay via CSS variables**
- `useFadeAndLineObserver` hook for scroll-triggered animations
- Improved **mobile responsiveness** for all screen sizes

### 🔹 Hero Section
- Phoenix model with **mouse tracking**
- Camera zoom-in intro from deep space
- **FloatingCodeBlocks** animation for extra depth

### 🔹 Projects Section
- Consistent card sizing
- Video hover previews
- Modal for full project info

### 🔹 Resume Section
- Centered layout with reveal-line animations
- Downloadable PDF (Resume_OmerMandalaoui.pdf)

### 🔹 Contact Section
- Fully styled form with 3D-enhanced background
- Icon links for LinkedIn & GitHub

---

## 🚀 Installation & Running

```bash
# Clone the project
git clone https://github.com/mandalaoui/portfolio-v2.git
cd portfolio-v2

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

### 📦 Main Dependencies
- Core 3D Rendering: three, @react-three/fiber, @react-three/drei
- Icons: react-icons (FontAwesome)
- Animations: Custom IntersectionObserver hook
- React: react, react-dom

Installed using:

```bash
npm install --legacy-peer-deps
npm install react-type-animation --legacy-peer-deps
npm install aos --legacy-peer-deps
npm install react-parallax-tilt --legacy-peer-deps
```

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

## 🌍 Live Demo
- GitHub Pages: https://mandalaoui.github.io
- Netlify: Coming soon

---

## 🖼 Media Assets
- ### 3D Models:
    - Mixamo — character animations
    - Sketchfab — 3D model sources
- No Blender usage — models imported directly into project

---

## ✅ Completed Milestones
- 3D hero with phoenix model & code blocks animation
- Modular card system with tags & filters
- Scroll-triggered animations for all sections
- Mobile & desktop optimized layout
- GitHub Pages deployment

---

## 🧑‍💻 Created by

**Omer Mandalaoui**  
[Portfolio](https://mandalaoui.github.io) • [GitHub](https://github.com/mandalaoui)
