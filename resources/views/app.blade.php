<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <script src="https://use.edgefonts.net/chewy:n4:all.js"></script>
        <link href="https://fonts.googleapis.com/css2?family=Chewy&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- Scripts globales -->
        <script src="/js/jquery-1.10.2.min.js"></script>
        <script src="/js/bootstrap.js"></script>
        <script src="/js/ovas/matematicas/adicion-sustraccion/audios.js"></script>
        <script src="/js/ovas/matematicas/adicion-sustraccion/hover.js"></script>
        <script src="/js/ovas/modals.js"></script>
        <script src="/js/ovas/resize.js"></script>
    </body>
</html>