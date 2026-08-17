<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProduitControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_create_produit(): void
    {
        $user = \App\Models\User::factory()->create([
            'role' => 'client'
        ]);

        $response = $this->actingAs($user)->postJson('/api/produits', [
            'nom' => 'Test',
            'categorie' => 'Test',
            'prix' => 10,
        ]);

        $response->assertStatus(403)
                 ->assertJson(['message' => 'Non autorisé']);
    }
}
