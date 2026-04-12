<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Credenciales</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #540D6E; padding-bottom: 20px; }
        .header h1 { color: #540D6E; margin: 0; font-size: 24px; }
        .header p { color: #666; margin: 5px 0 0; font-size: 12px; }
        .course-info { margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; }
        .course-info p { margin: 5px 0; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #540D6E; color: white; padding: 12px; text-align: left; font-size: 12px; }
        td { padding: 10px 12px; border-bottom: 1px solid #ddd; font-size: 11px; }
        tr:nth-child(even) td { background-color: #faf5ff; }
        .credentials { font-family: DejaVu Sans Mono, monospace; font-weight: bold; color: #540D6E; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Credenciales de Acceso</h1>
        <p>Sistema de Gestión Académica</p>
    </div>

    <div class="course-info">
        <p><strong>Curso:</strong> {{ $course->grade ?? '' }} - Sección {{ $course->section }}</p>
        <p><strong>Año Escolar:</strong> {{ $course->school_year }}</p>
        <p><strong>Fecha de generación:</strong> {{ $date }}</p>
        <p><strong>Total de estudiantes:</strong> {{ count($students) }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre Completo</th>
                <th>Usuario</th>
                <th>PIN de Acceso</th>
            </tr>
        </thead>
        <tbody>
            @foreach($students as $index => $student)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $student['name'] }}</td>
                <td class="credentials">{{ $student['username'] }}</td>
                <td class="credentials">{{ $student['pin'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Estas credenciales son únicas e intransferibles.</p>
        <p>Por favor, compártalas de forma segura con cada estudiante.</p>
    </div>
</body>
</html>