<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\Produit;

class AdminSidebarController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $pendingOrders = Commande::where('statut', 'en_attente')->count();
        $lowStock = Produit::where('stock', '<=', 5)->count();

        return response()->json([
            'pending_orders' => $pendingOrders,
            'low_stock' => $lowStock,
            'user' => [
                'name' => $request->user()->name,
                'email' => $request->user()->email,
            ]
        ]);
    }
}
