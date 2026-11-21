$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$baseDir = "C:\Users\hp\.gemini\antigravity\brain\113c6a96-d94f-47cb-95b8-9cb4b6523d4d"
$profile = "$baseDir\chrome_reg"

$views = @(
  @{ url = "http://localhost:5173/#admin/teams"; file = "step08_teams_regression.png" },
  @{ url = "http://localhost:5173/#admin/students"; file = "step08_students_regression.png" },
  @{ url = "http://localhost:5173/#admin/competitions"; file = "step08_competitions_regression.png" },
  @{ url = "http://localhost:5173/#admin/results"; file = "step08_results_regression.png" },
  @{ url = "http://localhost:5173/#admin/programme"; file = "step08_programmes_regression.png" },
  @{ url = "http://localhost:5173/#admin/programme_guests"; file = "step08_guests_regression.png" },
  @{ url = "http://localhost:5173/#admin/judges"; file = "step08_judges_regression.png" },
  @{ url = "http://localhost:5173/#judge"; file = "step08_judge_portal_regression.png" },
  @{ url = "http://localhost:5173/#schedule"; file = "step08_public_schedule_regression.png" }
)

foreach ($v in $views) {
  $outFile = "$baseDir\" + $v.file
  Write-Host "Capturing $($v.url) to $($v.file)..."
  Start-Process -FilePath $chrome -ArgumentList @(
    "--headless=new",
    "--user-data-dir=$profile",
    "--screenshot=$outFile",
    "--window-size=1672,960",
    "--virtual-time-budget=6000",
    $v.url
  ) -Wait
  $item = Get-Item $outFile
  Write-Host "Saved $($item.Name) : $($item.Length) bytes"
}

Write-Host "All regression screenshots completed!"
