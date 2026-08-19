<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        // Vérifier si l'utilisateur est admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $users = User::withCount('commandes')
            ->withSum(['commandes as total_depense' => function($query) {
                $query->whereIn('statut', ['payee', 'en_preparation', 'expediee', 'livree']);
            }], 'total')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }
}
