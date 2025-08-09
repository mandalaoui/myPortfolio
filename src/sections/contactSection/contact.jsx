import './contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <h2 className="section-title reveal-line" style={{ '--delay': '0.6s' }}>Get In Touch</h2>

      <div className="contact-container reveal-line glass-card" style={{ '--delay': '0.4s' }}>
        <div className="contact-info">
          <p><strong>Email:</strong> mandalaoui.omer@gmail.com</p>
          <p><strong>Phone:</strong> +972-53-8228882</p>
          <p><strong>Location:</strong> Petah Tikva, Israel</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/omer-mandalaoui/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/mandalaoui" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>

        <form className="contact-form reveal-line" style={{ '--delay': '0.6s' }}>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="text" placeholder="Subject" />
          <textarea placeholder="Message" rows="5" required />
          <button type="submit" className="btn btn-animate">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
