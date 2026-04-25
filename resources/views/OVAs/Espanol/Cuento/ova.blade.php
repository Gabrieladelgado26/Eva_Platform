<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fuente Chewy (OVA) -->
        <link href="https://fonts.googleapis.com/css2?family=Chewy&display=swap" rel="stylesheet">

        <!-- Estilos OVA Español – El Cuento -->
        <link rel="stylesheet" href="/OVAs/Espanol/Cuento/css/bootstrap.css">
        <link rel="stylesheet" href="/OVAs/Espanol/Cuento/css/stylegeneral.css">
        <link rel="stylesheet" href="/OVAs/Espanol/Cuento/css/slider.css">

        <!-- Scripts Inertia -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/ova.jsx'])
        @inertiaHead
    </head>
    <body>
        @inertia
        {{-- Captura ova_id y course_id de la URL y los guarda en sessionStorage
             para que los iframes de evaluación (misma origen) puedan leerlos --}}
        <script src="/js/eva-session.js"></script>
    </body>
</html>
