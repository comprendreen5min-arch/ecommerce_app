<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = $request->user()->cartItems()->with('produit')->get();
        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'integer|min:1'
        ]);

        $cartItem = $request->user()->cartItems()->where('produit_id', $request->produit_id)->first();

        if ($cartItem) {
            $cartItem->quantite += $request->input('quantite', 1);
            $cartItem->save();
        } else {
            $cartItem = $request->user()->cartItems()->create([
                'produit_id' => $request->produit_id,
                'quantite' => $request->input('quantite', 1)
            ]);
        }

        return response()->json($cartItem->load('produit'), 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantite' => 'required|integer|min:1'
        ]);

        $cartItem = $request->user()->cartItems()->findOrFail($id);
        $cartItem->quantite = $request->quantite;
        $cartItem->save();

        return response()->json($cartItem->load('produit'));
    }

    public function destroy(Request $request, $id)
    {
        $cartItem = $request->user()->cartItems()->findOrFail($id);
        $cartItem->delete();

        return response()->json(['message' => 'Article retiré du panier avec succès']);
    }
}
