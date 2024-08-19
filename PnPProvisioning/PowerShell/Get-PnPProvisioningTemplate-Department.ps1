# Load PnP.PowerShell, if it isn't already
Import-Module PnP.PowerShell -Force
Import-Module ./PowerShell/UtilityFunctions.psm1 -Force

Add-SympVariables

$templateSiteUrl = "https://$($tenant).sharepoint.com/sites/HR"

$templateSiteConnection = Connect-PnPOnline -Url $templateSiteUrl -Interactive -ReturnConnection

Get-PnPSiteTemplate `
    -Connection $templateSiteConnection `
    -Configuration "./PowerShell/IA/PnP JSON/PnPApplicationSite.json" `
    -Out "./PowerShell/IA/PnP XML/PnP-Provisioning-Department - RAW.xml"`
    -Force