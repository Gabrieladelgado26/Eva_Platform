<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvatarController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'avatar' => 'required|string|in:avatar1,avatar2,avatar3,avatar4,avatar5,avatar6',
        ]);

        $user = Auth::user();
        $user->update(['avatar' => $request->avatar]);

        session()->forget('needs_avatar');

        return back()->with('avatar_saved', true);
    }
}