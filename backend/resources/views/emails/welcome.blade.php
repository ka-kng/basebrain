<!-- resources/views/emails/welcome.blade.php -->
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ようこそ！メール認証を完了してください</title>
</head>
<body>
    <h1>ようこそ、{{ $user->name }}さん！</h1>
    <p>以下のリンクをクリックして、メール認証を完了してください。</p>
    <p><a href="{{ $verificationUrl }}">メール認証を完了する</a></p>
</body>
</html>
