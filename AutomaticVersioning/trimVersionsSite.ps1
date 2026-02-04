# Load PnP.PowerShell, if it isn't already
Import-Module PnP.PowerShell -Force
Import-Module ./PowerShell/UtilityFunctions.psm1 -Force

Add-SympVariables

$startTime = Get-Date -Format "yyyyMMdd-HHmmss"
Start-Transcript -Path "./PowerShell/Versions/Logs/Versions/VersionCleanup-$($startTime).log"

# Set up
$versionReportFile = "./PowerShell/Versions/TrimVersionsReport.csv"
$versionReport = Import-Csv -Path $versionReportFile

$siteUrl = "https://$($tenant).sharepoint.com/sites/SITENAME"

$filteredVersionReport = $versionReport #| Select-Object -Skip 11342


# Connect to the site and change settings
$siteConnection = Connect-PnPOnline -ClientId $clientId -url $siteUrl -Interactive -ReturnConnection

# Get the current SITE version policy
Write-Host -BackgroundColor White "Current versioning policy for: $($siteUrl)"
Get-PnPSiteVersionPolicy -Connection $siteConnection 

# Set the current SITE version policy
Set-PnPSiteVersionPolicy -Connection $siteConnection -EnableAutoExpirationVersionTrim $true -ApplyToExistingDocumentLibraries -ApplyToNewDocumentLibraries
Get-PnPSiteVersionPolicyStatus -Connection $siteConnection

$fileName = $null
$rowCount = $filteredVersionReport.count
$i = 0
$now = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ" -AsUTC
foreach ($row in $filteredVersionReport) {
    $i++

    if ($row.'FileUrl.Compact') {
        $fileName = $row.'FileUrl.Compact'
        $now = Get-Date -Format "yyyyMMdd-HHmmss"
        $fileVersions = Get-PnPFileVersion -Connection $siteConnection -Url $fileName
        Write-Host -BackgroundColor White "($($i) / $($rowCount)) $($now) Versions: $($fileVersions.count) - Processing file: $($row.'FileUrl.Compact')"
    } 

    $thisVersion = "$($row.MajorVersion).$($row.MinorVersion)"
    if ($row.AutomaticPolicyExpirationDate -and ($row.AutomaticPolicyExpirationDate -lt $now)) {
        Write-Host -BackgroundColor Cyan "  ($($i) / $($rowCount)) Deleting: $($thisVersion) / $($fileVersions.count) Date: $($row.AutomaticPolicyExpirationDate)"

        $versionToDelete = $fileVersions | Where-Object { $_.VersionLabel -eq $thisVersion }
        Remove-PnPFileVersion -Connection $siteConnection -Url $fileName -Identity $versionToDelete.Id -Force 
    }
    else {
        Write-Host -BackgroundColor Magenta "  ($($i) / $($rowCount)) Skipping: $($thisVersion) / $($fileVersions.count) Date: $($row.AutomaticPolicyExpirationDate)"
    }
    
}

Stop-Transcript
Write-Host -BackgroundColor Green "Version cleanup completed."