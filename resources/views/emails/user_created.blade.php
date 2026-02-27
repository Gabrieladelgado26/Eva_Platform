<div
    style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;">

    <div style="padding: 40px 40px 20px 40px; border-bottom: 2px solid #540D6E;">
        <h1 style="margin: 0; color: #333; font-size: 24px; font-weight: 500;">Plataforma Educativa EVA</h1>
    </div>

    <div style="padding: 30px 40px;">
        <p style="margin: 0 0 20px; color: #333; font-size: 16px;">Estimado/a <strong>' . $this->user->name . '</strong>:
        </p>

        <p style="margin: 0 0 20px; color: #555; font-size: 15px;">
            Su cuenta de acceso ha sido creada exitosamente. Sus credenciales son:
        </p>

        <div style="background: #f9f9f9; border-radius: 6px; padding: 20px; margin: 25px 0;">
            <p style="margin: 8px 0; color: #333; font-size: 15px;">
                <span style="color: #333; width: 100px; display: inline-block;">Usuario:</span>
                <strong>' . $this->user->email . '</strong>
            </p>
            <p style="margin: 8px 0; color: #333; font-size: 15px;">
                <span style="color: #333; width: 100px; display: inline-block;">Contraseña:</span>
                <strong style="color: #333; font-family: monospace;">' . $this->plainPassword . '</strong>
            </p>
        </div>

        <p style="margin: 20px 0; color: #555; font-size: 14px;">
            Por seguridad, cambie su contraseña en el primer inicio de sesión.
        </p>

        <div style="margin: 30px 0; text-align: center;">
            <a href="' . route('login') . '"
                style="display: inline-block; padding: 12px 30px; background: #540D6E; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">Acceder
                a la plataforma</a>
        </div>

        <p
            style="margin: 30px 0 0; color: #888; font-size: 13px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            © ' . date('Y') . ' EVA Platform<br>
            <span style="font-size: 12px;">Este es un mensaje automático, por favor no responder.</span>
        </p>
    </div>
</div>'
