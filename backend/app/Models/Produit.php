<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'image',
        'stock',
        'categorie',
        'prix',
    ];

    public function avis()
    {
        return $this->hasMany(Avis::class);
    }
}
