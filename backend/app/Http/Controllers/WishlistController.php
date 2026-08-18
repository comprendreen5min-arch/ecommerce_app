<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlists = Wishlist::with('produit')
            ->where('user_id', $request->user()->id)
            ->get();
            
        return response()->json($wishlists);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
        ]);

        $wishlist = Wishlist::firstOrCreate([
            'user_id' => $request->user()->id,
            'produit_id' => $request->produit_id,
        ]);

        return response()->json($wishlist, 201);
    }

    public function destroy(Request $request, $produit_id)
    {
        Wishlist::where('user_id', $request->user()->id)
            ->where('produit_id', $produit_id)
            ->delete();

        return response()->json(['message' => 'Produit retiré des favoris']);
    }
}
