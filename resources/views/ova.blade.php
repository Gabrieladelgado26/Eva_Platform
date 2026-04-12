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

        <!-- Estilos OVA -->
        <link rel="stylesheet" href="/OVAs/Matematicas/Adicion-Sustraccion/css/bootstrap.css">
        <link rel="stylesheet" href="/OVAs/Matematicas/Adicion-Sustraccion/css/stylemedicion.css">

        <!-- Scripts Inertia -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/ova.jsx'])
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
