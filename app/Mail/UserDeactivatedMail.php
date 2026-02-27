<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserDeactivatedMail extends Mailable implements ShouldQueue
{
    use SerializesModels;

    public function __construct(public $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu cuenta ha sido desactivada',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.user_deactivated',
        );
    }
}
