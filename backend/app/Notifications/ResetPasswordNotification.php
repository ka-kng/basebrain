<?php

// app/Notifications/ResetPasswordNotification.php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
  public $token;

  public function __construct($token)
  {
    $this->token = $token;
  }

  public function via($notifiable)
  {
    return ['mail'];
  }

  public function toMail($notifiable)
  {
    // フロントのURLに置き換える
    $url = config('app.frontend_url') . '/password/reset?token='
      . $this->token
      . '&email=' . urlencode($notifiable->email);

    return (new MailMessage)
      ->subject('パスワードリセットのお知らせ')
      ->greeting('いつもご利用頂きありがとうございます')
      ->line('パスワードリセットのリクエストを受け付けました。')
      ->action('パスワードをリセット', $url)
      ->line('このリンクは60分で無効になります。')
      ->line('もしリクエストしていない場合は、このメールを破棄してください。');
  }
}
