const projects = {
  university: [
    {
      id: 1,
      title: "Netfilm",
      description: "Fullstack movie streaming platform with content management, real-time recommendations, and an intuitive user experience on web and mobile.",
      longDescription: "Includes REST API, React client, and Android app. Users can stream movies, manage content, and interact in real-time using Socket.io.",
      tags: ["React", "Node.js", "MongoDB", "JWT", "REST API", "Android", "Socket"],
      icon: "fas fa-film",
      image: "/images/Netfilm.png",
      video: "/videos/Netfilm.mp4",
      link: "https://github.com/mandalaoui/Netfilm",
      linkLabel: "GitHub"
    },
    {
      id: 2,
      title: "Brick-Breaker",
      description: "A modular, object-oriented Arkanoid-style game in Java with animations, scoring, and collision logic using the biuoop library.",
      longDescription: "Developed in Java with Ant, this project demonstrates OOP design principles and GUI logic through game development.",
      tags: ["Java", "OOP", "biuoop", "Ant"],
      icon: "fas fa-gamepad",
      image: "/images/Brick-Breaker.png",
      video: "/videos/Brick-Breaker.mp4",
      link: "https://github.com/mandalaoui/Brick-Breaker",
      linkLabel: "GitHub"
    }
  ],

  independent: [
    {
      id: 3,
      title: "TrueValueIL",
      description: "Interactive web tool for estimating real estate property value in the Em HaMoshavot neighborhood of Petah Tikva.",
      longDescription: "Estimate apartment value using advanced logic based on dynamic parameters such as floor, rooms, parking, and renovations.",
      tags: ["Wix Velo", "JavaScript", "Wix CMS"],
      icon: "fas fa-building",
      image: "/images/TrueValueIL.png",
      link: "https://www.truevalueil.com",
      linkLabel: "To the website"
    },
    {
      id: 4,
      title: "משכנתאות AI",
      description: "An AI-driven tool that analyzes your mortgage and provides personalized refinancing suggestions in Hebrew, with automated rate updates.",
      longDescription: "Combines React, Node.js, OpenAI, GitHub Actions and Render to deliver smart mortgage optimization with real-time recommendations.",
      tags: ["React", "Node.js", "OpenAI API", "Express", "GitHub Actions", "Render", "Netlify"],
      icon: "fas fa-chart-line",
      image: "/images/MortgAI.png",
      link: "https://mortgage-ai.netlify.app",
      linkLabel: "To the website"
    }
  ]
};

export default projects;
