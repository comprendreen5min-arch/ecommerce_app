<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\CommandeItem;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        $commandes = Commande::where('user_id', $request->user()->id)
            ->with(['items.produit'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($commandes);
    }

    public function show(Request $request, $id)
    {
        $commande = Commande::with(['items.produit'])->findOrFail($id);
        
        if ($commande->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        return response()->json($commande);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        $cartItems = CartItem::where('user_id', $user->id)->with('produit')->get();
        
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Le panier est vide'], 400);
        }

        try {
            DB::beginTransaction();

            // Calculate total & Check stock
            $total = 0;
            foreach ($cartItems as $item) {
                if ($item->produit->stock < $item->quantite) {
                    DB::rollBack();
                    return response()->json(['message' => 'Stock insuffisant pour ' . $item->produit->nom], 400);
                }
                $total += $item->produit->prix * $item->quantite;
            }

            // Create commande
            $commande = Commande::create([
                'user_id' => $user->id,
                'total' => $total,
                'statut' => 'payee', // Simulate payment for now
            ]);

            // Create items & Decrement stock
            foreach ($cartItems as $item) {
                CommandeItem::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $item->produit_id,
                    'quantite' => $item->quantite,
                    'prix_unitaire' => $item->produit->prix,
                ]);
                $item->produit->decrement('stock', $item->quantite);
            }

            // Empty cart
            CartItem::where('user_id', $user->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Commande validée avec succès',
                'commande' => $commande
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la validation de la commande', 'error' => $e->getMessage()], 500);
        }
    }
}
