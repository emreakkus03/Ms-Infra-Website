<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Nieuw contactbericht</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#1B2227;">
    <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
        <div style="background:#1B2227;padding:28px 32px;border-radius:16px 16px 0 0;">
            <div style="font-size:13px;font-weight:bold;letter-spacing:2px;color:#B81C31;text-transform:uppercase;">
                MS Infra
            </div>

            <h1 style="margin:10px 0 0;color:#ffffff;font-size:26px;">
                Nieuw contactbericht
            </h1>
        </div>

        <div style="background:#ffffff;padding:32px;border-radius:0 0 16px 16px;">
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <td style="padding:8px 0;font-weight:bold;width:120px;">Naam</td>
                    <td style="padding:8px 0;">{{ $name }}</td>
                </tr>

                <tr>
                    <td style="padding:8px 0;font-weight:bold;">E-mail</td>
                    <td style="padding:8px 0;">{{ $email }}</td>
                </tr>

                <tr>
                    <td style="padding:8px 0;font-weight:bold;">Telefoon</td>
                    <td style="padding:8px 0;">{{ $phone }}</td>
                </tr>

                <tr>
                    <td style="padding:8px 0;font-weight:bold;">Onderwerp</td>
                    <td style="padding:8px 0;">{{ $subject }}</td>
                </tr>
            </table>

            <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e2e8f0;">
                <div style="font-weight:bold;margin-bottom:10px;">
                    Bericht
                </div>

                <div style="line-height:1.7;white-space:pre-wrap;">{{ $contactMessage }}</div>
            </div>
        </div>
    </div>
</body>
</html>