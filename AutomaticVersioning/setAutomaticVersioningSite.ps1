# Load PnP.PowerShell, if it isn't already
Import-Module PnP.PowerShell -Force
Import-Module ./PowerShell/UtilityFunctions.psm1 -Force

Add-SympVariables

# Get all the tenant sites
$siteList = Get-PnPTenantSite -Connection $adminConnection

Write-Host "Total sites to process: $($siteList.Count)"

$filteredSites = $siteList | Where-Object { $_.Template -eq "GROUP#0" } #| Select-Object -First 25
Write-Host -BackgroundColor Green "Processing: $($filteredSites.count) sites"

foreach ($site in $filteredSites) {

    $siteUrl = $site.Url

    # Connect to the site and change settings
    $siteConnection = Connect-PnPOnline -ClientId $clientId -Url $siteUrl -ReturnConnection -Interactive 

    # Get the current SITE version policy
    $policy = Get-PnPSiteVersionPolicy -Connection $siteConnection 
    
    Write-Host -BackgroundColor White "Current versioning policy for: $($siteUrl) is $($policy.DefaultTrimMode)"

    if ($policy.DefaultTrimMode -ne "AutoExpiration") {
        Write-Host -BackgroundColor Yellow "Updating versioning policy for: $($siteUrl) to AutoExpiration"
        
        # Set the current SITE version policy
        $setStatus = Set-PnPSiteVersionPolicy -Connection $siteConnection -EnableAutoExpirationVersionTrim $true -ApplyToExistingDocumentLibraries -ApplyToNewDocumentLibraries
        $newPolicy = Get-PnPSiteVersionPolicy -Connection $siteConnection 
        Write-Host -BackgroundColor Green "Updated versioning policy for: $($siteUrl) to $($newPolicy.DefaultTrimMode)"
    }
    else {
        Write-Host -BackgroundColor Green "No update needed for: $($siteUrl)"
    }
}
