<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserCreatedMail extends Mailable implements ShouldQueue
{
    use SerializesModels;

    public $user;
    public $plainPassword;

    public function __construct($user, $plainPassword)
    {
        $this->user = $user;
        $this->plainPassword = $plainPassword;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu cuenta ha sido creada',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.user_created',
        );
    }
}