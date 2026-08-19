<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Produit;

// Translate categories
Produit::where('categorie', 'Accessoires')->update(['categorie' => 'Accessories']);
Produit::where('categorie', 'Sacs & Maroquinerie')->update(['categorie' => 'Bags & Leather Goods']);
Produit::where('categorie', 'Chapeaux & Accessoires cheveux')->update(['categorie' => 'Hats & Hair Accessories']);

$produits = Produit::all();
foreach($produits as $produit) {
    $nom = $produit->nom;
    $desc = $produit->description;
    
    // Quick translations for names
    $nom = str_replace('Sac à main', 'Handbag', $nom);
    $nom = str_replace('Sac', 'Bag', $nom);
    $nom = str_replace('Chapeau', 'Hat', $nom);
    $nom = str_replace('Lunettes de soleil', 'Sunglasses', $nom);
    $nom = str_replace('Montre', 'Watch', $nom);
    $nom = str_replace('Ceinture', 'Belt', $nom);
    $nom = str_replace('Portefeuille', 'Wallet', $nom);
    $nom = str_replace('Foulard', 'Scarf', $nom);
    $nom = str_replace('Bandeau', 'Headband', $nom);
    $nom = str_replace('Barrette', 'Hair clip', $nom);
    $nom = str_replace('en cuir', 'in leather', $nom);
    $nom = str_replace('Cuir', 'Leather', $nom);
    $nom = str_replace('Noir', 'Black', $nom);
    $nom = str_replace('Marron', 'Brown', $nom);
    $nom = str_replace('Vintage', 'Vintage', $nom);
    
    // Quick translations for descriptions
    $desc = str_replace('Un magnifique', 'A beautiful', $desc);
    $desc = str_replace('pour toutes les occasions', 'for all occasions', $desc);
    $desc = str_replace('élégant', 'elegant', $desc);
    $desc = str_replace('cuir véritable', 'genuine leather', $desc);
    $desc = str_replace('Accessoire indispensable', 'Essential accessory', $desc);
    $desc = str_replace('Parfait pour', 'Perfect for', $desc);
    $desc = str_replace('l\'été', 'summer', $desc);
    $desc = str_replace('le quotidien', 'everyday use', $desc);
    $desc = str_replace('qualité premium', 'premium quality', $desc);
    $desc = str_replace('Design', 'Design', $desc);
    $desc = str_replace('minimaliste', 'minimalist', $desc);
    
    $produit->nom = $nom;
    $produit->description = $desc;
    $produit->save();
}

echo "Database translated successfully.\n";
