<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $fillable = ['user_id', 'produit_id'];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}
