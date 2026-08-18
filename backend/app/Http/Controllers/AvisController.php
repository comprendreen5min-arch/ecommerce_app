<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    public function index($produit_id)
    {
        $avis = Avis::with('user:id,name')
            ->where('produit_id', $produit_id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($avis);
    }

    public function store(Request $request, $produit_id)
    {
        $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string',
        ]);

        // Check if user already left a review
        $existingAvis = Avis::where('user_id', $request->user()->id)
            ->where('produit_id', $produit_id)
            ->first();

        if ($existingAvis) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis sur ce produit'], 400);
        }

        $avis = Avis::create([
            'user_id' => $request->user()->id,
            'produit_id' => $produit_id,
            'note' => $request->note,
            'commentaire' => $request->commentaire,
        ]);

        // Load user name for the response
        $avis->load('user:id,name');

        return response()->json($avis, 201);
    }
}
