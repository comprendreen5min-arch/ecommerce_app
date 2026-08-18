<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProduitController;

use App\Http\Controllers\CartController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\StatsController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);

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
});
