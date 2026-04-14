<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Mail\Mailable as MailableContract;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserEmailUpdatedMail extends Mailable implements MailableContract
{
    use Queueable, SerializesModels;

    public $user;
    public $newEmail;

    public function __construct($user, string $newEmail)
    {
        $this->user = $user;
        $this->newEmail = $newEmail;
    }

    public function build()
    {
        return $this->subject('Your email address has been updated')
                    ->view('emails.user_updated');
    }
}