const fs = require('fs');
const files = [
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/Wishlist.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/ProduitDetail.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/Panier.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/MesCommandes.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/Home.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/CommandeConfirmee.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/AdminStats.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/ClientDashboard.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/AdminCommandes.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/src/pages/AdminDashboard.jsx',
  'c:/MAMP/htdocs/ecommerce/frontend/index.html'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<div className="navbar-brand">Mes Favoris<\/div>/g, '<div className="navbar-brand">Bellelle - Mes Favoris</div>');
    content = content.replace(/<div className="navbar-brand">Détail du Produit<\/div>/g, '<div className="navbar-brand">Bellelle - Détail du Produit</div>');
    content = content.replace(/<div className="navbar-brand">Votre Panier<\/div>/g, '<div className="navbar-brand">Bellelle - Votre Panier</div>');
    content = content.replace(/<div className="navbar-brand">Mes Commandes<\/div>/g, '<div className="navbar-brand">Bellelle - Mes Commandes</div>');
    content = content.replace(/<div className="navbar-brand">Commande Confirmée<\/div>/g, '<div className="navbar-brand">Bellelle - Commande Confirmée</div>');
    content = content.replace(/<div className="navbar-brand">Admin Statistiques<\/div>/g, '<div className="navbar-brand">Bellelle - Admin Stats</div>');
    content = content.replace(/<div className="navbar-brand">Espace Client<\/div>/g, '<div className="navbar-brand">Bellelle - Espace Client</div>');
    content = content.replace(/<div className="navbar-brand">Admin Commandes<\/div>/g, '<div className="navbar-brand">Bellelle - Admin Commandes</div>');
    content = content.replace(/<div className="navbar-brand">Admin Dashboard<\/div>/g, '<div className="navbar-brand">Bellelle - Admin Dashboard</div>');
    content = content.replace(/<Link to="\/" className="navbar-brand">ElectroShop<\/Link>/g, '<Link to="/" className="navbar-brand">Bellelle</Link>');
    content = content.replace(/<title>frontend<\/title>/g, '<title>Bellelle</title>');
    
    // Home texts
    content = content.replace(/<h1>La technologie à portée de main<\/h1>/g, '<h1>La beauté à portée de main</h1>');
    content = content.replace(/<p>Découvrez notre sélection exclusive de produits high-tech\. Design, performance et fiabilité pour votre quotidien\.<\/p>/g, '<p>Tout ce dont une fille a besoin, réuni au même endroit.</p>');
    
    fs.writeFileSync(file, content);
  }
});

let css = fs.readFileSync('c:/MAMP/htdocs/ecommerce/frontend/src/index.css', 'utf8');
css = css.replace(/--primary: #4F46E5;/g, '--primary: #D38C9D;');
css = css.replace(/--primary-hover: #4338CA;/g, '--primary-hover: #A55166;');
if (!css.includes('--secondary: #E2B4C1;')) {
  css = css.replace(/:root {/g, ':root {\n  --secondary: #E2B4C1;\n  --bg-soft: #F7DAE7;');
}
css = css.replace(/background: linear-gradient\(135deg, #f3e8ff 0%, #e0e7ff 100%\);/g, 'background: linear-gradient(135deg, var(--bg-soft) 0%, var(--secondary) 100%);');
css = css.replace(/color: #1e1b4b;/g, 'color: var(--primary-hover);');
css = css.replace(/color: #4338ca;/g, 'color: var(--primary-hover);');
fs.writeFileSync('c:/MAMP/htdocs/ecommerce/frontend/src/index.css', css);
console.log("Done");
