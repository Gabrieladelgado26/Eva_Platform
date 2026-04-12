<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Estudiantes - {{ $course->section }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            margin: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #540D6E;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #540D6E;
            margin: 0;
        }
        .header p {
            color: #666;
            margin: 5px 0 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #540D6E;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Lista de Estudiantes</h1>
        <p>{{ $course->grade ?? '' }} - Sección {{ $course->section }}</p>
        <p>Generado: {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Usuario</th>
            </tr>
        </thead>
        <tbody>
            @foreach($students as $index => $student)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $student->name }}</td>
                <td>@ {{ $student->username }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Total de estudiantes: {{ $students->count() }}</p>
        <p>Plataforma Educativa - Sistema de Gestión Académica</p>
    </div>
</body>
</html>