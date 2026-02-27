<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>GKM TECHNOLOGY</title>

    <link rel="icon" type="image/webp" href="/assets/images/LOGO-GKM-1.webp" />

    <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/src/main.tsx'])
</head>

<body>
    <noscript>
        <strong>GKM TECHNOLOGY</strong>
    </noscript>

    <div id="root"></div>
</body>

</html>
