import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <nav className="navbar container">
        <Link to="/" className="navbar-brand">ElectroShop</Link>
        <div>
          <Link to="/login" className="btn btn-primary">Se connecter</Link>
        </div>
      </nav>
      
      <main className="container">
        <section className="hero">
          <h1>La technologie à portée de main</h1>
          <p>Découvrez notre sélection exclusive de produits high-tech. Design, performance et fiabilité pour votre quotidien.</p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Commencer vos achats
          </Link>
        </section>
      </main>
    </>
  );
};

export default Home;
