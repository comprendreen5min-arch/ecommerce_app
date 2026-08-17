<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = \App\Models\User::first();
    if (!$user) {
        echo "No user found.\n";
        exit;
    }

    echo "User ID: " . $user->id . "\n";

    $produit = \App\Models\Produit::first();
    if (!$produit) {
        echo "No produit found.\n";
        exit;
    }

    echo "Produit ID: " . $produit->id . "\n";

    $cartItem = $user->cartItems()->create([
        'produit_id' => $produit->id,
        'quantite' => 1
    ]);

    echo "Cart Item created with ID: " . $cartItem->id . "\n";
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
