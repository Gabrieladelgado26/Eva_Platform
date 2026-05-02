<?php

namespace App\Services;

/**
 * Self-contained PDF generator for student credentials.
 * Professional corporate design with clean typography and minimal decoration.
 * Zero external dependencies — uses raw PDF format + built-in Type1 fonts.
 */
class CredentialsPdfGenerator
{
    // ── Page geometry (A4 portrait) ──────────────────────────────────────────
    private float $W  = 595.28;
    private float $H  = 841.89;
    private float $mx = 45.0;
    private float $my = 40.0;

    // ── Corporate palette ────────────────────────────────────────────────────
    private array $primary    = [84,  13,  110]; // #540D6E
    private array $primaryBg  = [248, 243, 252]; // fondo púrpura muy claro
    private array $success    = [16,  185, 129]; // verde
    private array $warning    = [245, 158, 11];  // ámbar
    private array $white      = [255, 255, 255];
    private array $gray50     = [249, 250, 251];
    private array $gray100    = [243, 244, 246];
    private array $gray200    = [229, 231, 235];
    private array $gray400    = [156, 163, 175];
    private array $gray600    = [75,  85,  99];
    private array $gray800    = [31,  41,  55];
    private array $gray900    = [17,  24,  39];

    // ── Internal state ───────────────────────────────────────────────────────
    private string $cs     = '';
    private array  $images = [];

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────────────────────────────────────

    public function generate(
        array  $students,
        string $courseName,
        string $date,
        string $logoPath = ''
    ): string {
        $this->cs     = '';
        $this->images = [];
        $this->buildPage($students, $courseName, $date, $logoPath);
        return $this->buildPdf();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PAGE LAYOUT
    // ─────────────────────────────────────────────────────────────────────────

    private function buildPage(
        array  $students,
        string $courseName,
        string $date,
        string $logoPath
    ): void {
        $mx = $this->mx;
        $cw = $this->W - 2 * $mx;
        $y  = $this->my;

        // Column layout: #(30) | Nombre(235) | Usuario(155) | PIN(95)
        $colW = [30, 235, 155, 95];
        $colX = [
            $mx,
            $mx + 30,
            $mx + 30 + 235,
            $mx + 30 + 235 + 155,
        ];

        // ── Header ───────────────────────────────────────────────────────────
        $headerH = 72;

        // Subtle header background
        $this->rect($mx, $y, $cw, $headerH, $this->white);
        
        // Thin accent line at top
        $this->rect($mx, $y, $cw, 3, $this->primary);

        // Logo or brand mark
        $logoW = 0.0;
        $hasLogo = false;
        if ($logoPath !== '' && file_exists($logoPath)) {
            $hasLogo = $this->embedPng($logoPath, $mx + 16, $y + 8, 160.0);
            if ($hasLogo) {
                $logoW = 160.0;
            }
        }

        if (!$hasLogo) {
            // Minimal brand mark: small square with letter
            $markX = $mx + 16;
            $markY = $y + 14;
            $this->rect($markX, $markY, 40, 40, $this->primary);
            $this->text($markX + 11, $markY + 28, 'EVA', 'F2', 13, $this->white);
            $logoW = 40.0;
        }

        // Title block - alineado verticalmente con el logo
        $titleX = $mx + 16 + $logoW + 20;
        $this->text($titleX, $y + 24, '', 'F2', 15, $this->gray900);
        $this->text($titleX, $y + 24, 'Credenciales de Acceso', 'F2', 15, $this->gray900);
        $this->text($titleX, $y + 42, 'Plataforma de Gestión Académica', 'F1', 8, $this->gray600);
        
        // Divider line under title
        $this->hline($titleX, $titleX + 200, $y + 48, $this->gray200, 0.8);
        
        $this->text($titleX, $y + 58, 'Documento confidencial de uso interno', 'F1', 7, $this->gray400);

        // Right side: generation date - alineado con los textos del título
        $dateLabel = date('d/m/Y H:i');
        $this->text($mx + $cw - 95, $y + 30, $dateLabel, 'F1', 7, $this->gray400);
        $this->text($mx + $cw - 78, $y + 42, 'Fecha de emisión', 'F1', 6.5, $this->gray400);

        $y += $headerH + 14;

        // ── Meta information bar ─────────────────────────────────────────────
        $metaH = 42;
        $this->rect($mx, $y, $cw, $metaH, $this->gray50);
        
        // Top and bottom border
        $this->hline($mx, $mx + $cw, $y, $this->gray200, 0.5);
        $this->hline($mx, $mx + $cw, $y + $metaH, $this->gray200, 0.5);

        $cnt = count($students);
        $metaItems = [];
        if ($courseName !== '') {
            $metaItems[] = ['Curso', $this->trunc($courseName, 200, 9)];
        }
        $metaItems[] = ['Total de estudiantes', (string) $cnt];
        
        $metaWidth = $cw / count($metaItems);
        foreach ($metaItems as $i => [$label, $value]) {
            $cellX = $mx + $i * $metaWidth + 14;
            $this->text($cellX, $y + 16, $label, 'F1', 6.5, $this->gray400);
            $this->text($cellX, $y + 32, $value, 'F2', 9, $this->gray800);
            
            // Separator
            if ($i > 0) {
                $this->vline($mx + $i * $metaWidth, $y + 8, $metaH - 16, $this->gray200, 0.5);
            }
        }

        $y += $metaH + 20;

        // ── Table header ─────────────────────────────────────────────────────
        $rowH = 26; // más alto para dar espacio
        
        // Header background - morado del sistema
        $this->rect($mx, $y, $cw, $rowH, $this->primary);
        
        $headers = ['Nº', 'Nombre del estudiante', 'Nombre de usuario', 'PIN de acceso'];
        $headerXs = [$colX[0] + 10, $colX[1] + 10, $colX[2] + 10, $colX[3] + 10];
        
        foreach ($headers as $i => $h) {
            $this->text($headerXs[$i], $y + 17, $h, 'F2', 7.5, $this->white);
        }
        
        $y += $rowH;

        // ── Table rows ───────────────────────────────────────────────────────
        foreach ($students as $idx => $st) {
            $isEven = $idx % 2 === 0;
            $fill = $isEven ? $this->white : $this->gray50;
            
            $this->rect($mx, $y, $cw, $rowH, $fill);
            $this->hline($mx, $mx + $cw, $y + $rowH, $this->gray100, 0.4);

            $textY = $y + 17;

            // Row number
            $numStr = str_pad((string) ($idx + 1), 2, '0', STR_PAD_LEFT);
            $this->text($colX[0] + 10, $textY, $numStr, 'F3', 7, $this->gray400);

            // Student name - sin círculo con inicial
            $this->text($colX[1] + 10, $textY, $this->trunc($st['name'] ?? '', $colW[1] - 20, 9), 'F1', 9, $this->gray800);

            // Username
            $username = ($st['username'] ?? '') !== '' ? '@' . $st['username'] : '—';
            $this->text($colX[2] + 10, $textY, $this->trunc($username, $colW[2] - 20, 8.5), 'F3', 8.5, $this->gray600);

            // PIN — clean pill design sin indicador
            $pinStr = (string) ($st['pin'] ?? '');
            $pillW  = 52;
            $pillH  = 15;
            $pillX  = $colX[3] + 10;
            $pillY  = $y + ($rowH - $pillH) / 2;
            
            // Pill colors
            $pillBg = strlen($pinStr) >= 4 ? $this->primaryBg : $this->gray100;
            $pillTextColor = strlen($pinStr) >= 4 ? $this->primary : $this->gray400;
            
            $this->rect($pillX, $pillY, $pillW, $pillH, $pillBg);
            $this->rect($pillX + 1, $pillY + 1, $pillW - 2, $pillH - 2, $this->white);
            $this->rect($pillX + 1, $pillY + 1, $pillW - 2, $pillH - 2, $pillBg);
            
            // PIN text centered in pill
            $pinTextW = strlen($pinStr) * 5.5;
            $pinTextX = $pillX + ($pillW - $pinTextW) / 2;
            $this->text($pinTextX, $pillY + 11.5, $pinStr, 'F3', 9, $pillTextColor);

            $y += $rowH;
        }

        // Table bottom border
        $this->hline($mx, $mx + $cw, $y, $this->gray400, 0.8);

        // ── Footer ───────────────────────────────────────────────────────────
        $y += 20;
        $this->text($mx, $y, 'Las credenciales son personales e intransferibles.', 'F1', 7, $this->gray600);
        $y += 12;
        $this->text($mx, $y, 'Entregue cada credencial únicamente al estudiante correspondiente.', 'F1', 6.5, $this->gray400);
        $y += 18;
        
        // Footer line
        $this->hline($mx, $mx + $cw, $y, $this->gray200, 0.3);
        $y += 10;
        
        $this->text($mx, $y, 'Plataforma EVA — Sistema de Gestión Académica', 'F1', 6.5, $this->gray400);
        $this->text($mx + $cw - 40, $y, 'v1.0', 'F1', 6, $this->gray400);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DRAWING PRIMITIVES
    // ─────────────────────────────────────────────────────────────────────────

    private function rgb(array $c, bool $fill = true): string
    {
        return sprintf('%.3f %.3f %.3f %s', $c[0] / 255, $c[1] / 255, $c[2] / 255, $fill ? 'rg' : 'RG');
    }

    private function rect(float $x, float $y, float $w, float $h, array $fill): void
    {
        $py = $this->H - $y - $h;
        $this->cs .= $this->rgb($fill) . "\n";
        $this->cs .= sprintf("%.2f %.2f %.2f %.2f re f\n", $x, $py, $w, $h);
    }

    private function hline(float $x1, float $x2, float $y, array $color, float $lw = 0.5): void
    {
        $py = $this->H - $y;
        $this->cs .= $this->rgb($color, false) . "\n";
        $this->cs .= sprintf("%.2f w %.2f %.2f m %.2f %.2f l S\n", $lw, $x1, $py, $x2, $py);
    }

    private function vline(float $x, float $y, float $h, array $color, float $lw = 0.5): void
    {
        $py1 = $this->H - $y;
        $py2 = $this->H - $y - $h;
        $this->cs .= $this->rgb($color, false) . "\n";
        $this->cs .= sprintf("%.2f w %.2f %.2f m %.2f %.2f l S\n", $lw, $x, $py1, $x, $py2);
    }

    private function drawCircle(float $cx, float $cy, float $r, array $fill): void
    {
        $pcy = $this->H - $cy;
        $k   = 0.5523 * $r;
        $this->cs .= $this->rgb($fill) . "\n";
        $this->cs .= sprintf(
            "%.2f %.2f m %.2f %.2f %.2f %.2f %.2f %.2f c %.2f %.2f %.2f %.2f %.2f %.2f c %.2f %.2f %.2f %.2f %.2f %.2f c %.2f %.2f %.2f %.2f %.2f %.2f c f\n",
            $cx, $pcy + $r,
            $cx + $k, $pcy + $r, $cx + $r, $pcy + $k, $cx + $r, $pcy,
            $cx + $r, $pcy - $k, $cx + $k, $pcy - $r, $cx, $pcy - $r,
            $cx - $k, $pcy - $r, $cx - $r, $pcy - $k, $cx - $r, $pcy,
            $cx - $r, $pcy + $k, $cx - $k, $pcy + $r, $cx, $pcy + $r
        );
    }

    private function text(float $x, float $y, string $t, string $font, float $size, array $color): void
    {
        if ($t === '') return;
        $py = $this->H - $y;
        $this->cs .= "BT\n";
        $this->cs .= $this->rgb($color) . "\n";
        $this->cs .= sprintf("/%s %.2f Tf\n", $font, $size);
        $this->cs .= sprintf("%.2f %.2f Td\n", $x, $py);
        $this->cs .= $this->enc($t) . " Tj\n";
        $this->cs .= "ET\n";
    }

    private function enc(string $s): string
    {
        $s = (string) @iconv('UTF-8', 'Windows-1252//TRANSLIT//IGNORE', $s);
        $s = str_replace(['\\', '(', ')', "\r", "\n"], ['\\\\', '\\(', '\\)', '', ' '], $s);
        return '(' . $s . ')';
    }

    private function trunc(string $s, float $maxPts, float $fontSize): string
    {
        $maxLen = (int) floor($maxPts / ($fontSize * 0.52));
        if (mb_strlen($s, 'UTF-8') <= $maxLen) return $s;
        return mb_substr($s, 0, max(1, $maxLen - 1), 'UTF-8') . '...';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PNG IMAGE EMBEDDING
    // ─────────────────────────────────────────────────────────────────────────

    private function embedPng(string $path, float $x, float $y, float $displayW): bool
    {
        $raw = @file_get_contents($path);
        if ($raw === false || strlen($raw) < 33) return false;
        if (substr($raw, 0, 8) !== "\x89PNG\r\n\x1a\n") return false;

        $width = 0; $height = 0; $bitDepth = 0; $colorType = 0;
        $idatRaw = '';
        $pos = 8;
        $len = strlen($raw);

        while ($pos + 12 <= $len) {
            $chunkLen  = unpack('N', substr($raw, $pos, 4))[1];
            $chunkType = substr($raw, $pos + 4, 4);
            $chunkData = substr($raw, $pos + 8, $chunkLen);
            if ($chunkType === 'IHDR') {
                $width     = unpack('N', substr($chunkData, 0, 4))[1];
                $height    = unpack('N', substr($chunkData, 4, 4))[1];
                $bitDepth  = ord($chunkData[8]);
                $colorType = ord($chunkData[9]);
            } elseif ($chunkType === 'IDAT') {
                $idatRaw .= $chunkData;
            } elseif ($chunkType === 'IEND') {
                break;
            }
            $pos += 4 + 4 + $chunkLen + 4;
        }

        if ($width === 0 || $height === 0 || $idatRaw === '') return false;
        if ($bitDepth !== 8 || ($colorType !== 2 && $colorType !== 6)) return false;

        $channels = ($colorType === 6) ? 4 : 3;
        $uncompressed = @zlib_decode($idatRaw);
        if ($uncompressed === false) return false;

        $stride   = $width * $channels + 1;
        $expected = $stride * $height;
        if (strlen($uncompressed) < $expected) return false;

        $bytes    = array_values(unpack('C*', $uncompressed));
        $recon    = array_fill(0, $width * $height * $channels, 0);
        $prevLine = array_fill(0, $width * $channels, 0);

        for ($row = 0; $row < $height; $row++) {
            $base       = $row * $stride;
            $filterType = $bytes[$base];
            $lineStart  = $base + 1;
            $curLine    = array_fill(0, $width * $channels, 0);

            for ($i = 0; $i < $width * $channels; $i++) {
                $x_val = $bytes[$lineStart + $i];
                $a = ($i >= $channels) ? $curLine[$i - $channels] : 0;
                $b = $prevLine[$i];
                $c = ($i >= $channels) ? $prevLine[$i - $channels] : 0;

                switch ($filterType) {
                    case 0: $curLine[$i] = $x_val; break;
                    case 1: $curLine[$i] = ($x_val + $a) & 0xFF; break;
                    case 2: $curLine[$i] = ($x_val + $b) & 0xFF; break;
                    case 3: $curLine[$i] = ($x_val + (($a + $b) >> 1)) & 0xFF; break;
                    case 4:
                        $p  = $a + $b - $c;
                        $pa = abs($p - $a); $pb = abs($p - $b); $pc = abs($p - $c);
                        $pr = ($pa <= $pb && $pa <= $pc) ? $a : ($pb <= $pc ? $b : $c);
                        $curLine[$i] = ($x_val + $pr) & 0xFF;
                        break;
                    default: $curLine[$i] = $x_val;
                }
            }

            $rowBase = $row * $width * $channels;
            for ($i = 0; $i < $width * $channels; $i++) {
                $recon[$rowBase + $i] = $curLine[$i];
            }
            $prevLine = $curLine;
        }

        $rgbRaw = ''; $alphaRaw = '';
        if ($colorType === 6) {
            for ($i = 0; $i < $width * $height; $i++) {
                $base = $i * 4;
                $rgbRaw   .= chr($recon[$base]) . chr($recon[$base + 1]) . chr($recon[$base + 2]);
                $alphaRaw .= chr($recon[$base + 3]);
            }
        } else {
            for ($i = 0; $i < $width * $height * 3; $i++) {
                $rgbRaw .= chr($recon[$i]);
            }
        }

        $compRgb   = zlib_encode($rgbRaw, ZLIB_ENCODING_DEFLATE, 6);
        $compAlpha = ($colorType === 6) ? zlib_encode($alphaRaw, ZLIB_ENCODING_DEFLATE, 6) : null;

        $aspect   = $height / $width;
        $displayH = $displayW * $aspect;

        $imgIdx = count($this->images);
        $this->images[] = [
            'compRgb' => $compRgb, 'compAlpha' => $compAlpha,
            'width' => $width, 'height' => $height, 'hasAlpha' => $colorType === 6,
        ];

        $pdfY = $this->H - $y - $displayH;
        $this->cs .= "q\n";
        $this->cs .= sprintf("%.4f 0 0 %.4f %.4f %.4f cm\n", $displayW, $displayH, $x, $pdfY);
        $this->cs .= "/Im{$imgIdx} Do\n";
        $this->cs .= "Q\n";

        return true;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PDF ASSEMBLY
    // ─────────────────────────────────────────────────────────────────────────

    private function buildPdf(): string
    {
        $streamData = $this->cs;
        $streamLen  = strlen($streamData);
        $imageObjs = []; $extraObjs = [];
        $nextObj = 8;

        foreach ($this->images as $idx => $img) {
            $rgbObjNum = $nextObj++;
            $alphaObjNum = null;
            if ($img['hasAlpha'] && $img['compAlpha'] !== null) {
                $alphaObjNum = $nextObj++;
                $alphaLen = strlen($img['compAlpha']);
                $extraObjs[$alphaObjNum] = [
                    'dict'   => "<< /Type /XObject /Subtype /Image /Width {$img['width']} /Height {$img['height']} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /Length {$alphaLen} >>",
                    'stream' => $img['compAlpha'],
                ];
            }
            $rgbLen = strlen($img['compRgb']);
            $smask  = $alphaObjNum !== null ? " /SMask {$alphaObjNum} 0 R" : '';
            $extraObjs[$rgbObjNum] = [
                'dict'   => "<< /Type /XObject /Subtype /Image /Width {$img['width']} /Height {$img['height']} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length {$rgbLen}{$smask} >>",
                'stream' => $img['compRgb'],
            ];
            $imageObjs[$idx] = $rgbObjNum;
        }

        $xObjResource = '';
        if (!empty($imageObjs)) {
            $parts = [];
            foreach ($imageObjs as $idx => $objNum) $parts[] = "/Im{$idx} {$objNum} 0 R";
            $xObjResource = ' /XObject << ' . implode(' ', $parts) . ' >>';
        }

        $pageDict = sprintf(
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %.2f %.2f] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >>%s >> >>',
            $this->W, $this->H, $xObjResource
        );

        $pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $offsets = [];
        $offsets[1] = strlen($pdf); $pdf .= "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
        $offsets[2] = strlen($pdf); $pdf .= "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
        $offsets[3] = strlen($pdf); $pdf .= "3 0 obj\n{$pageDict}\nendobj\n";
        $offsets[4] = strlen($pdf); $pdf .= "4 0 obj\n<< /Length {$streamLen} >>\nstream\n{$streamData}\nendstream\nendobj\n";

        $fonts = [5 => '/Helvetica', 6 => '/Helvetica-Bold', 7 => '/Courier'];
        foreach ($fonts as $n => $base) {
            $offsets[$n] = strlen($pdf);
            $pdf .= "{$n} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont {$base} /Encoding /WinAnsiEncoding >>\nendobj\n";
        }

        ksort($extraObjs);
        foreach ($extraObjs as $n => $obj) {
            $offsets[$n] = strlen($pdf);
            $pdf .= "{$n} 0 obj\n{$obj['dict']}\nstream\n{$obj['stream']}\nendstream\nendobj\n";
        }

        $totalObjs = max(array_keys($offsets)) + 1;
        $xrefStart = strlen($pdf);
        $pdf .= "xref\n0 {$totalObjs}\n0000000000 65535 f \n";
        for ($i = 1; $i < $totalObjs; $i++) {
            $pdf .= sprintf('%010d 00000 n ' . "\n", $offsets[$i] ?? 0);
        }
        $pdf .= "trailer\n<< /Size {$totalObjs} /Root 1 0 R >>\nstartxref\n{$xrefStart}\n%%EOF\n";

        return $pdf;
    }
}