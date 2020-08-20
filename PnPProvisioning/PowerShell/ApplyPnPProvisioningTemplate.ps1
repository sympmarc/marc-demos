#Requires -Module "SharePointPnPPowerShellOnline"

$adminSiteUrl = "https://sympmarc-admin.sharepoint.com"

# Custom functions
Import-Module "./Powershell/UtilityFunctions.psm1" -Force

$adminConnection = Connect-PnPOnline -Url $adminSiteUrl -Credentials sympmarc -ReturnConnection

# Properties Hub
$hubSite = "Properties"
$propertiesHub = Get-PnPHubSite -Identity "https://sympmarc.sharepoint.com/sites/$($hubSite)"

# Set up new Project Site parameters
$siteTitle = "Demo PnP"
$propertyCode = "PnP5"

# Create the new site
Write-Host "Creating $($siteTitle) ($($propertyCode)) Property Site"
New-PnPSite -Connection $adminConnection -Type TeamSite -Title $siteTitle -Alias $propertyCode -HubSiteId $propertiesHub.SiteId -IsPublic -Wait

$newSite = Connect-PnPOnline -Url "https://sympmarc.sharepoint.com/sites/$($propertyCode)" -Credentials sympmarc -ReturnConnection

$params = @{
    "HubSite"      = "$($hubSite)";
    "SiteTitle"    = "$($siteTitle)";
    "PropertyCode" = "$($propertyCode)";
}

# Apply PnP Template
Apply-PnPProvisioningTemplate `
    -Connection $newSite `
    -Path "./PowerShell/IA/PnP XML/PnP-Provisioning-DemoSite.xml" `
    -Parameters $params

# Remove-PnPTenantSite -Url $newSite -Force -SkipRecycleBin