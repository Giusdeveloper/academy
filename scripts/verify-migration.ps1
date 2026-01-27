# Script PowerShell per verificare la migration admin_logs
# Assicurati di avere le variabili d'ambiente configurate

Write-Host "🔍 Verifica migration admin_logs..." -ForegroundColor Cyan
Write-Host ""

# Carica le variabili d'ambiente da .env.local se esiste
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseServiceKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $supabaseUrl -or -not $supabaseServiceKey) {
    Write-Host "❌ Errore: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devono essere configurate" -ForegroundColor Red
    Write-Host "💡 Aggiungi le variabili in .env.local o esportale nel terminale" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Variabili d'ambiente caricate" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Istruzioni per verificare manualmente:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Vai su Supabase Dashboard → SQL Editor" -ForegroundColor White
Write-Host "2. Esegui questa query per verificare la tabella:" -ForegroundColor White
Write-Host ""
Write-Host "   SELECT * FROM information_schema.tables WHERE table_name = 'admin_logs';" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verifica gli enum:" -ForegroundColor White
Write-Host ""
Write-Host "   SELECT typname FROM pg_type WHERE typname IN ('admin_action_type', 'admin_entity_type');" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Verifica le colonne:" -ForegroundColor White
Write-Host ""
Write-Host "   SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'admin_logs';" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Testa inserendo un log di prova:" -ForegroundColor White
Write-Host ""
Write-Host "   INSERT INTO admin_logs (admin_id, admin_email, action_type, entity_type, description)" -ForegroundColor Gray
Write-Host "   VALUES ('00000000-0000-0000-0000-000000000000', 'test@test.com', 'CREATE', 'EVENT', 'Test');" -ForegroundColor Gray
Write-Host ""
Write-Host "   SELECT * FROM admin_logs WHERE admin_email = 'test@test.com';" -ForegroundColor Gray
Write-Host ""
Write-Host "   DELETE FROM admin_logs WHERE admin_email = 'test@test.com';" -ForegroundColor Gray
Write-Host ""

# Esegui verifica con Node.js se disponibile
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "🚀 Esecuzione verifica automatica con Node.js..." -ForegroundColor Cyan
    Write-Host ""
    node scripts/verify-admin-logs-migration.js
} else {
    Write-Host "⚠️  Node.js non trovato. Usa le query SQL sopra per verificare manualmente." -ForegroundColor Yellow
}

