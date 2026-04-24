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
        <link href="https://fonts.googleapis.com/css2?family=Chewy&display=swap" rel="stylesheet" />
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
        <script src="/Ovas/Matematicas/Adicion-Sustraccion/js/jquery-1.10.2.min.js"></script>
        <script src="/Ovas/Matematicas/Adicion-Sustraccion/js/bootstrap.js"></script>
        <script src="/Ovas/Matematicas/Adicion-Sustraccion/js/audios.js"></script>
        <script src="/Ovas/Matematicas/Adicion-Sustraccion/js/hover.js"></script>
        <script src="/Ovas/Matematicas/Adicion-Sustraccion/js/modals.js"></script>
        <script src="/Ovas/Matematicas/Adicion-Sustraccion/js/resize.js"></script>
    </body>
</html>