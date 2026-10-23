param([string]$Subfolder = '', [string]$OutputFile = 'ocr.json')
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1)
function Await-Operation($Operation, $Type) {
  $task = $asTask.MakeGenericMethod($Type).Invoke($null, @($Operation))
  $task.Wait()
  return $task.Result
}
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
$root = Join-Path (Get-Location) '.local/suit-replacement'
if ($Subfolder) { $root = Join-Path $root $Subfolder }
$results = @()
foreach ($folder in Get-ChildItem -LiteralPath $root -Directory) {
  foreach ($image in Get-ChildItem -LiteralPath $folder.FullName -Filter '*.jpg' | Sort-Object Name) {
    $file = Await-Operation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($image.FullName)) ([Windows.Storage.StorageFile])
    $stream = Await-Operation ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
    $decoder = Await-Operation ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Await-Operation ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $result = Await-Operation ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    $lines = @($result.Lines | ForEach-Object { $_.Text })
    $boxes = @($result.Lines | ForEach-Object {
      $words = @($_.Words)
      $left = ($words | ForEach-Object { $_.BoundingRect.X } | Measure-Object -Minimum).Minimum
      $top = ($words | ForEach-Object { $_.BoundingRect.Y } | Measure-Object -Minimum).Minimum
      $right = ($words | ForEach-Object { $_.BoundingRect.X + $_.BoundingRect.Width } | Measure-Object -Maximum).Maximum
      $bottom = ($words | ForEach-Object { $_.BoundingRect.Y + $_.BoundingRect.Height } | Measure-Object -Maximum).Maximum
      [PSCustomObject]@{ text=$_.Text; x=$left; y=$top; right=$right; bottom=$bottom }
    })
    $results += [PSCustomObject]@{ slug=$folder.Name; page=[int]$image.BaseName; width=$bitmap.PixelWidth; height=$bitmap.PixelHeight; lines=$lines; boxes=$boxes }
    $bitmap.Dispose()
    $stream.Dispose()
  }
  Write-Output ($folder.Name + ': OCR concluido')
}
$results | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $root $OutputFile) -Encoding UTF8
