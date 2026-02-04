# Load PnP.PowerShell, if it isn't already
Import-Module PnP.PowerShell -Force
Import-Module ./PowerShell/UtilityFunctions.psm1 -Force

Add-SympVariables

# $adminConnection = Connect-PnPOnline -ClientId $clientId -Url "https://$($tenant)-admin.sharepoint.com" -Interactive -ReturnConnection

$siteUrl = "https://$($tenant).sharepoint.com/sites/SITENAME"
$reportUrl = "$($siteUrl)/Shared%20Documents/TrimVersionsReport.csv"
$destinationPath = "./PowerShell/Versions/"
$fileName = "TrimVersionsReport.csv"

$csvFilePath = "$($destinationPath)$($fileName)"

Write-host -BackgroundColor Yellow "Checking site"

$siteConnection = Connect-PnPOnline -ClientId $clientId -url $siteUrl -Interactive -ReturnConnection

New-PnPSiteFileVersionExpirationReportJob -Connection $siteConnection -ReportUrl $reportUrl

$a = Get-PnPSiteFileVersionExpirationReportJobStatus -Connection $siteConnection -ReportUrl $reportUrl

write-host "  Report status is $($a.Status)"

if ($a.status -eq "completed") {
    Write-Host -BackgroundColor Green "Report is ready for CLOSED-$($letter), downloading..."
    Get-PnPFile -Connection $siteConnection -Url $reportUrl -Path $destinationPath -FileName $fileName -AsFile -Force
}
