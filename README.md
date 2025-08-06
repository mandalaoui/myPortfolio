
# 💼 Omer Mandalaoui – Portfolio Website

A sleek and interactive **3D Developer Portfolio** built with modern frontend technologies.  
Showcases featured **university** and **independent projects**, some with demo videos, external links, and rich visual interactions.

---

## ✨ Features

- 🌐 Responsive fullstack developer portfolio
- 🧊 Fully animated 3D background (Three.js + @react-three/fiber)
- 🚀 Smooth scroll-based camera transitions and hero intro
- 📁 Categorized project cards with video hover & modal display
- 🎬 Live video demo on hover, with modal support
- 💡 Tech tag filtering and interactive layout
- 📄 Resume section with animated reveal and download button
- 📬 Contact section with animated form and 3D-enhanced layout
- 🖱️ Horizontal scroll with smart arrows
- 🪞 Tilt & glare effect on project cards
- ✨ Custom reveal-line animation with delay per element
- 🔄 IntersectionObserver-based entry animation


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

✅ Updates & Enhancements (August 7, 2025)
🔹 Global Design & Interaction
- Added reveal-line animation to all sections with custom delays using CSS variables (--delay)
- Created intersection observer hook (useFadeAndLineObserver) to trigger animations only on scroll into view
- Introduced smooth, staged animations for titles, buttons, and content blocks
- Improved layout responsiveness and section alignment

🔹 Hero Section
- Upgraded 3D hero with phoenix model that tracks mouse movement
- Camera starts from deep space and zooms into focus on page load
- Floating blocks animation using FloatingCodeBlocks component

🔹 Project Section
- Wrapped each ProjectCard with animated <div className="reveal-line"> for entry effect
- Maintained consistent card sizing and spacing with inline display: contents workaround
- Preserved full animation flow without affecting layout

🔹 Resume Section
Added Resume.jsx section with:
- reveal-line title and download button
- Centered layout with spacing and animation delay
- Downloadable PDF from /files/Resume_OmerMandalaoui.pdf

🔹 Contact Section
- Integrated Contact.jsx with:
- Fully styled contact form and detail block
- Centered design and subtle spacing
- 3D background integration with form elements
- Font styling and icon links for LinkedIn and GitHub

🔹 Styles & UI Polish
- Improved .btn-animate with middle alignment and spacing
- Fixed animation delays for better visual hierarchy
- Refined resume/contact spacing and margins
- Used dynamic colors and responsiveness for consistent UX


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
npm install aos --legacy-peer-deps
npm install react-type-animation --legacy-peer-deps
npm install aos --legacy-peer-deps
npm install react-parallax-tilt --legacy-peer-deps


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
