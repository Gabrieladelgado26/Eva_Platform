<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fuente Chewy (OVA) -->
    <link href="https://fonts.googleapis.com/css2?family=Chewy&display=swap" rel="stylesheet">

    <!-- Estilos OVA Ciencias Sociales – Patrimonio Cultural -->
    <link rel="stylesheet" type="text/css" href="/OVAs/Ciencias-Sociales/Patrimonio-Cultural/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="/OVAs/Ciencias-Sociales/Patrimonio-Cultural/css/stylegeneral.css">

    @routes
    @viteReactRefresh
    @vite(['resources/js/ova.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
    <script src="/js/eva-session.js"></script>
</body>
</html>
