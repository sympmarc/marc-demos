$tenant = "sympmarc"
$adminSiteUrl = "https://$($tenant)-admin.sharepoint.com"

# Custom functions
Import-Module "./Powershell/UtilityFunctions.psm1" -Force

Connect-PnPOnline -Url $adminSiteUrl -Interactive

class SiteScript {
    [string]$SiteScriptName;
}

$siteScripts = @(
    [SiteScript]@{SiteScriptName="Property"}
    [SiteScript]@{SiteScriptName="_DemoBase"}
)

$siteScriptIds = @()

foreach($ss in $siteScripts)
{
    $ssNewId = Add-SiteScript -AdminSiteUrl $adminSiteUrl -SiteScriptFile "./PowerShell/IA/site-scripts/$($ss.SiteScriptName).json" -SiteScriptTitle "$($ss.SiteScriptName)"
    $siteScriptIds += $ssNewId.Guid
}

Add-SiteDesign -WebTemplate 64 -SiteDesignTitle "Demo Base" -SiteScriptIds $siteScriptIds
