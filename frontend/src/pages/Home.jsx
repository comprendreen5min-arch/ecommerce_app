import { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="navbar-brand">Bellelle</Link>
          
          <div className="nav-links" style={{ display: 'none', '@media (min-width: 768px)': { display: 'flex' } }}>
            <Link to="/dashboard">Collections</Link>
            <Link to="/dashboard">Nouveautés</Link>
            <Link to="/dashboard">Best-Sellers</Link>
            <a href="#philosophie">À propos</a>
          </div>

          <div className="nav-icons">
            <Link to="/dashboard">
              <span className="material-symbols-outlined">search</span>
            </Link>
            <Link to="/favoris">
              <span className="material-symbols-outlined">favorite</span>
            </Link>
            <Link to="/panier">
              <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
            <Link to="/login" className="btn btn-primary" style={{ marginLeft: '1rem' }}>Se connecter</Link>
          </div>
        </div>
      </nav>
      
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
            <span className="home-hero-subtitle">Nouvelle Collection</span>
            <h1>La beauté à portée de main</h1>
            <p>Tout ce dont une fille a besoin, réuni au même endroit. Découvrez notre sélection exclusive de bijoux, sacs et accessoires pour sublimer votre style.</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Commencer vos achats
            </Link>
          </div>
        </section>

        {/* L'ESSENTIEL BELLELLE */}
        <section className="bento-section">
          <div className="bento-header">
            <h2>L'Essentiel Bellelle</h2>
            <div className="divider"></div>
          </div>
          
          <div className="bento-grid">
            {/* Carte 1 : Bijoux */}
            <Link to="/dashboard" className="bento-card">
              <img src="/images/bijoux.jpg" alt="Bijoux élégants" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-text">
                  <span>Éclat intemporel</span>
                  <h3>Bijoux</h3>
                </div>
                <div className="bento-icon">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Carte 2 : Sacs & Maroquinerie */}
            <Link to="/dashboard" className="bento-card">
              <img src="/images/sacs.jpg" alt="Sacs et maroquinerie" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-text">
                  <span>L'allure au bras</span>
                  <h3>Sacs & Maroquinerie</h3>
                </div>
                <div className="bento-icon">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Carte 3 : Accessoires Cheveux */}
            <Link to="/dashboard" className="bento-card">
              <img src="/images/cheveux.jpg" alt="Accessoires pour cheveux" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-text">
                  <span>Coiffure sublimée</span>
                  <h3>Accessoires Cheveux</h3>
                </div>
                <div className="bento-icon">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Carte 4 : Accessoires */}
            <Link to="/dashboard" className="bento-card">
              <img src="/images/accessoires.jpg" alt="Accessoires divers" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-text">
                  <span>Le détail parfait</span>
                  <h3>Accessoires</h3>
                </div>
                <div className="bento-icon">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* NOTRE PHILOSOPHIE */}
        <section id="philosophie" className="philosophy-section">
          <div className="philosophy-container">
            <div className="philosophy-image">
              <img className="reveal-image" src="/images/philosophy.jpg" alt="Une femme confiante et élégante" />
            </div>
            <div className="philosophy-content">
              <span>Notre Philosophie</span>
              <h2>L'Élégance au Quotidien</h2>
              <p>Chez Bellelle, nous croyons que le style véritable naît de la confiance en soi. Notre sélection est pensée pour accompagner chaque femme dans son quotidien, du bijou discret à l'accessoire qui fait toute la différence.</p>
              <p style={{ opacity: 0.8, fontSize: '1rem', marginBottom: '2rem' }}>Chaque pièce est une promesse de qualité, privilégiant des matériaux nobles et des designs intemporels pour une expérience luxueuse sans compromis.</p>
              <div>
                <a href="#" className="philosophy-link">
                  Découvrir notre histoire
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
            <p>L'incarnation du luxe serein. Élevez votre style avec notre sélection soigneusement élaborée de bijoux, sacs et accessoires.</p>
          </div>
          
          <div className="footer-links">
            <h4>Service Client</h4>
            <ul>
              <li><a href="#">Livraison & Retours</a></li>
              <li><a href="#">Contactez-nous</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Légal</h4>
            <ul>
              <li><a href="#">Politique de confidentialité</a></li>
              <li><a href="#">Conditions Générales</a></li>
              <li><a href="#">Mentions Légales</a></li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Rejoignez le Cercle</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Inscrivez-vous pour recevoir nos actualités et offres exclusives.</p>
            <form style={{ display: 'flex', alignItems: 'flex-end' }}>
              <input type="email" placeholder="Votre adresse email" required />
              <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Bellelle. Tous droits réservés. Style, Beauté, Élégance.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
