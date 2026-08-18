<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProduitController;

use App\Http\Controllers\CartController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\AvisController;
use App\Http\Controllers\AdminCommandeController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);
Route::get('/produits/{id}/avis', [AvisController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::post('/produits', [ProduitController::class, 'store']);
    Route::put('/produits/{id}', [ProduitController::class, 'update']);
    Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);
    
    // Routes du panier
    Route::get('/panier', [CartController::class, 'index']);
    Route::post('/panier', [CartController::class, 'store']);
    Route::put('/panier/{id}', [CartController::class, 'update']);
    Route::delete('/panier/{id}', [CartController::class, 'destroy']);
    
    // Routes des commandes
    Route::get('/commandes', [CommandeController::class, 'index']);
    Route::post('/commandes', [CommandeController::class, 'store']);
    Route::get('/commandes/{id}', [CommandeController::class, 'show']);
    
    // Stats admin
    Route::get('/admin/stats', [StatsController::class, 'index']);
    
    // Commandes admin
    Route::get('/admin/commandes', [AdminCommandeController::class, 'index']);
    Route::put('/admin/commandes/{id}/statut', [AdminCommandeController::class, 'updateStatut']);
    
    // Routes Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{produit_id}', [WishlistController::class, 'destroy']);
    
    // Route Avis protégée
    Route::post('/produits/{id}/avis', [AvisController::class, 'store']);
});
