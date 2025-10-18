<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\AuthService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_coach_can_register_and_create_team()
    {
        Notification::fake();

        $service = new AuthService();

        $data = [
            'name' => 'Coach A',
            'email' => 'coach@example.com',
            'password' => 'password',
            'role' => 'coach',
            'team_name' => 'Team A',
        ];

        $user = $service->register($data);

        $this->assertDatabaseHas('teams', ['name' => 'Team A']);
        $this->assertDatabaseHas('users', ['email' => 'coach@example.com']);
        $this->assertTrue(Hash::check('password', $user->password));
    }

    public function test_player_registration_with_invalid_invite_code_throws_exception()
    {
        $this->expectException(ValidationException::class);

        $service = new AuthService();

        $data = [
            'name' => 'Player A',
            'email' => 'player@example.com',
            'password' => 'password',
            'role' => 'player',
            'invite_code' => 'INVALIDCODE',
        ];

        $service->register($data);
    }
}
