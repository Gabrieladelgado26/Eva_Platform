<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class UserActivatedMail extends Mailable implements ShouldQueue
{
    use SerializesModels;

    public function __construct(public $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu cuenta ha sido activada',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.user_activated',
        );
    }
}