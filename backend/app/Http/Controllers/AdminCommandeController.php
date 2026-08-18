<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;

class AdminCommandeController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $commandes = Commande::with(['user:id,name,email', 'items.produit'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($commandes);
    }

    public function updateStatut(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'statut' => 'required|string|in:en_attente,payee,en_preparation,expediee,livree,annulee'
        ]);

        $commande = Commande::with(['user', 'items.produit'])->find($id);

        if (!$commande) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }

        $commande->update(['statut' => $request->statut]);

        return response()->json($commande);
    }
}
