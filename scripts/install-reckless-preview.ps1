param([Parameter(Mandatory=$true)][string]$Archive)
# Instalação local para revisão. O ZIP enviado contém fontes TRIAL/Personal Use Only.
Add-Type -AssemblyName System.IO.Compression.FileSystem
$destination = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../public/fonts/reckless'))
$expected = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../public/fonts')) + [IO.Path]::DirectorySeparatorChar
if (-not $destination.StartsWith($expected,[StringComparison]::OrdinalIgnoreCase)) { throw 'Destino inválido.' }
$names = @('RecklessStandardM-TRIAL-Light.otf','RecklessStandardM-TRIAL-LightItalic.otf','RecklessStandardM-TRIAL-Regular.otf','RecklessStandardM-TRIAL-RegularItalic.otf','Befonts-License.txt')
$zip = [IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $Archive))
try {
 New-Item -ItemType Directory -Path $destination -Force | Out-Null
 foreach ($name in $names) {
  $entry = @($zip.Entries | Where-Object { $_.Name -eq $name })
  if ($entry.Count -ne 1) { throw "Arquivo não encontrado ou ambíguo: $name" }
  [IO.Compression.ZipFileExtensions]::ExtractToFile($entry[0],(Join-Path $destination $name),$true)
 }
} finally { $zip.Dispose() }
Write-Output 'Reckless instalada localmente para revisão; não publicar os arquivos TRIAL.'
