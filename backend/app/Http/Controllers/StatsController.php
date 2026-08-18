<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $totalCommandes = Commande::count();
        $chiffreAffaires = Commande::where('statut', 'payee')->sum('total');
        $totalProduits = Produit::count();
        $rupturesStock = Produit::where('stock', '<=', 5)->count();

        $topProduits = DB::table('commande_items')
            ->join('produits', 'commande_items.produit_id', '=', 'produits.id')
            ->select('produits.id', 'produits.nom', DB::raw('SUM(commande_items.quantite) as total_vendu'))
            ->groupBy('produits.id', 'produits.nom')
            ->orderBy('total_vendu', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'total_commandes' => $totalCommandes,
            'chiffre_affaires' => $chiffreAffaires,
            'total_produits' => $totalProduits,
            'ruptures_stock' => $rupturesStock,
            'top_produits' => $topProduits
        ]);
    }
}
