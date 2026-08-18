<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::withAvg('avis as moyenne_notes', 'note')
            ->withCount('avis')
            ->get();
        return response()->json($produits);
    }

    public function show($id)
    {
        $produit = Produit::withAvg('avis as moyenne_notes', 'note')
            ->withCount('avis')
            ->find($id);
        
        if (!$produit) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }
        
        return response()->json($produit);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'stock' => 'integer|min:0',
            'categorie' => 'required|string|max:255',
            'prix' => 'required|numeric|min:0',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('produits', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $produit = Produit::create($validated);

        return response()->json($produit, 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $produit = Produit::find($id);
        
        if (!$produit) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'stock' => 'integer|min:0',
            'categorie' => 'sometimes|required|string|max:255',
            'prix' => 'sometimes|required|numeric|min:0',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('produits', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $produit->update($validated);

        return response()->json($produit);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $produit = Produit::find($id);
        
        if (!$produit) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        $produit->delete();

        return response()->json(['message' => 'Produit supprimé avec succès']);
    }
}
