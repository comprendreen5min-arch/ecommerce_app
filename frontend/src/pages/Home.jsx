import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {

  useEffect(() => {
    // Simple intersection observer for image reveal effect
    const images = document.querySelectorAll('.reveal-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));

    return () => {
      images.forEach(img => imageObserver.unobserve(img));
    };
  }, []);

  return (
    <>
      <Header />
      
      <main>
        {/* HERO SECTION */}
        <section className="home-hero">
          <div 
            className="home-hero-bg reveal-image" 
            style={{ backgroundImage: "url('/images/hero.jpg')" }}
          ></div>
          <div className="home-hero-overlay"></div>
          <div className="home-hero-gradient"></div>
          
          <div className="home-hero-content">
            <span className="home-hero-subtitle">New Collection</span>
            <h1>Beauty at your fingertips</h1>
            <p>Everything a girl needs, all in one place. Discover our exclusive selection of jewelry, bags, and accessories to elevate your style.</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Start shopping
            </Link>
          </div>
        </section>

        {/* THE BELLELLE ESSENTIALS */}
        <section className="bento-section">
          <div className="bento-header">
            <h2>The Bellelle Essentials</h2>
            <div className="divider"></div>
          </div>
          
          <div className="bento-grid">
            {/* Card 1 : Jewelry */}
            <Link to="/dashboard" className="bento-card">
              <img src="/images/bijoux.jpg" alt="Elegant jewelry" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-text">
                  <span>Timeless glow</span>
                  <h3>Jewelry</h3>
                </div>
                <div className="bento-icon">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Card 2 : Bags & Leather Goods */}
            <Link to="/dashboard" className="bento-card">
              <img src="/images/sacs.jpg" alt="Bags and leather goods" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-text">
                  <span>Allure on your arm</span>
                  <h3>Bags & Leather Goods</h3>
                </div>
                <div className="bento-icon">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Card 3 : Hair Accessories */}
            <Link to="/dashboard" className="bento-card">
              <img src="/images/cheveux.jpg" alt="Hair accessories" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-text">
                  <span>Sublime hairstyle</span>
                  <h3>Hair Accessories</h3>
                </div>
                <div className="bento-icon">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Card 4 : Accessories */}
            <Link to="/dashboard" className="bento-card">
              <img src="/images/accessoires.jpg" alt="Various accessories" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-text">
                  <span>The perfect detail</span>
                  <h3>Accessories</h3>
                </div>
                <div className="bento-icon">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* OUR PHILOSOPHY */}
        <section id="philosophie" className="philosophy-section">
          <div className="philosophy-container">
            <div className="philosophy-image">
              <img className="reveal-image" src="/images/philosophy.jpg" alt="A confident and elegant woman" />
            </div>
            <div className="philosophy-content">
              <span>Our Philosophy</span>
              <h2>Everyday Elegance</h2>
              <p>At Bellelle, we believe that true style stems from self-confidence. Our selection is designed to accompany every woman in her daily life, from a discreet piece of jewelry to the accessory that makes all the difference.</p>
              <p style={{ opacity: 0.8, fontSize: '1rem', marginBottom: '2rem' }}>Every piece is a promise of quality, prioritizing noble materials and timeless designs for an uncompromising luxury experience.</p>
              <div>
                <a href="#" className="philosophy-link">
                  Discover our story
                  <span className="material-symbols-outlined">arrow_right_alt</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Bellelle</h3>
            <p>The embodiment of serene luxury. Elevate your style with our carefully curated selection of jewelry, bags, and accessories.</p>
          </div>
          
          <div className="footer-links">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Legal Notice</a></li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Join the Circle</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Sign up to receive our news and exclusive offers.</p>
            <form style={{ display: 'flex', alignItems: 'flex-end' }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Bellelle. All rights reserved. Style, Beauty, Elegance.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
