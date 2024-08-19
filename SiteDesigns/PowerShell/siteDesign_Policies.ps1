# Load PnP.PowerShell, if it isn't already
Import-Module PnP.PowerShell -Force
Import-Module ./PowerShell/UtilityFunctions.psm1 -Force

Add-SympVariables

Connect-PnPOnline -Url $adminSiteUrl -Interactive

class SiteScript {
    [string]$SiteScriptName;
}

$siteScripts = @(
    [SiteScript]@{SiteScriptName="Policies"}
)

$siteScriptIds = @()

foreach($ss in $siteScripts)
{
    $ssNewId = Add-SiteScript -SiteScriptFile "./PowerShell/IA/site-scripts/$($ss.SiteScriptName).json" -SiteScriptTitle "Set up $($ss.SiteScriptName) library"
    $siteScriptIds += $ssNewId.Guid
}

Add-SiteDesign -WebTemplate 64 -SiteDesignTitle "Create Policies Library" -SiteScriptIds $siteScriptIds
