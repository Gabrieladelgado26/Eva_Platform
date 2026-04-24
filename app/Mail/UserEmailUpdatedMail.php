<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserEmailUpdatedMail extends Mailable implements ShouldQueue
{
    use SerializesModels;

    public function __construct(
        public $user,
        public string $oldEmail
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu dirección de correo ha sido actualizada',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.user_updated',
        );
    }
}