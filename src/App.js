import Hero3D from './sections/heroSection/Hero3D';
import Projects from './sections/projectSection/Projects';
import './styles/App.css'; // Assuming you have a global CSS file for styles

function App() {
  return (
    <>
      <Hero3D />
      <Projects />
      <div id="about" style={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', paddingTop: '5rem' }}>About Section</h2>
        <p style={{ textAlign: 'center' }}>This is the next section...</p>
      </div>
    </>
  );
}


export default App;
