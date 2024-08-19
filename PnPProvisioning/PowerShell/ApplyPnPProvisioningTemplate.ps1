# Load PnP.PowerShell, if it isn't already
Import-Module PnP.PowerShell -Force
Import-Module ./PowerShell/UtilityFunctions.psm1 -Force

Add-SympVariables

# Globals
$hubSite = "Doggone Data"

# Set up Project site parameters
$siteTitle = "foo"
$siteUrl = "/sites/$($siteTitle)"

$newSite = Connect-PnPOnline -Url "https://$($tenant).sharepoint.com$($siteUrl)" -Interactive -ReturnConnection
$newWeb = Get-PnPSite -Connection @admin

# Apply PnP Template
Invoke-PnPSiteTemplate `
    -Connection $newSite `
    -Path "./PowerShell/IA/PnP XML/PnP-Provisioning-Department - RAW.xml" `
    -Parameters @{
    "HubSite"   = "$($hubSite)";
    "SiteTitle" = "$($siteTitle)";
}