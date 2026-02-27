<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cuenta activada - EVA Platform</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f9; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <!-- Contenedor principal -->
                <table width="560" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                    
                    <!-- Header institucional -->
                    <tr>
                        <td style="padding: 36px 48px 20px 48px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="36" style="vertical-align: middle;">
                                        <div style="width: 36px; height: 36px; background-color: #540D6E; border-radius: 6px;"></div>
                                    </td>
                                    <td style="vertical-align: middle; padding-left: 16px;">
                                        <h1 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 500; letter-spacing: -0.2px;">EVA Platform</h1>
                                        <p style="margin: 2px 0 0; color: #7f8c8d; font-size: 12px;">Sistema de Gestión Educativa</p>
                                    </td>
                                    <td align="right" style="vertical-align: middle;">
                                        <span style="color: #27ae60; font-size: 13px; font-weight: 500; padding: 4px 10px; background-color: #e8f5e9; border-radius: 20px;">ACTIVA</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Línea divisoria -->
                    <tr>
                        <td style="padding: 0 48px;">
                            <div style="height: 1px; background-color: #ecf0f1;"></div>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 32px 48px;">
                            
                            <p style="margin: 0 0 20px; color: #34495e; font-size: 15px; line-height: 1.6;">
                                Estimado(a) <strong>{{ $user->name }}</strong>:
                            </p>
                            
                            <p style="margin: 0 0 16px; color: #34495e; font-size: 15px; line-height: 1.6;">
                                Le informamos que su cuenta ha sido <strong style="color: #27ae60;">activada</strong> en la plataforma EVA. A partir de este momento, puede acceder al sistema con normalidad.
                            </p>
                            
                            <!-- Detalles de la cuenta -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin: 24px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px; color: #2c3e50; font-size: 14px; font-weight: 500;">Detalles de la cuenta:</p>
                                        <p style="margin: 6px 0; color: #34495e; font-size: 14px;">
                                            <span style="color: #7f8c8d; width: 90px; display: inline-block;">Usuario:</span>
                                            <span style="color: #2c3e50;">{{ $user->email }}</span>
                                        </p>
                                        <p style="margin: 6px 0; color: #34495e; font-size: 14px;">
                                            <span style="color: #7f8c8d; width: 90px; display: inline-block;">Estado:</span>
                                            <span style="color: #27ae60;">Activa</span>
                                        </p>
                                        <p style="margin: 6px 0 0; color: #34495e; font-size: 14px;">
                                            <span style="color: #7f8c8d; width: 90px; display: inline-block;">Fecha:</span>
                                            <span style="color: #2c3e50;">{{ now()->format('d/m/Y H:i') }}</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 8px; color: #7f8c8d; font-size: 13px; line-height: 1.5;">
                                Si tiene alguna duda o requiere asistencia, puede contactar al administrador del sistema.
                            </p>
                            
                            <!-- Botón de acceso -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0 8px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ route('login') }}" 
                                        style="display: inline-block; padding: 12px 36px; background-color: #540D6E; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 400;">
                                            Acceder a la plataforma
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 48px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px; color: #7f8c8d; font-size: 12px; text-align: center;">
                                EVA Platform · Sistema de Gestión Educativa
                            </p>
                            <p style="margin: 0; color: #95a5a6; font-size: 11px; text-align: center;">
                                Este mensaje es automático, por favor no responder.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
