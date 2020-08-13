$adminSiteUrl = "https://sympmarc-admin.sharepoint.com"
$templateSiteUrl = "https://sympmarc.sharepoint.com/sites/InformationArchitecture"

# Custom functions
Import-Module "./Powershell/UtilityFunctions.psm1" -Force

Connect-SPOService -Url $adminSiteUrl -Credential (Get-StoredCredential -Target sympmarc)

class List {
    [string]$ListName;
}

$Lists = @(
    [List]@{ListName="Property"}

)

foreach($l in $Lists)
{
    Export-SiteScriptFromList -TemplateSiteUrl $templateSiteUrl -ListName $l.ListName
}
