$tenant = "sympmarc"
$adminSiteUrl = "https://$($tenant)c-admin.sharepoint.com"
$templateSiteUrl = "https://$($tenant).sharepoint.com/sites/InformationArchitecture"

# Custom functions
Import-Module "./Powershell/UtilityFunctions.psm1" -Force

Connect-SPOService -Url $adminSiteUrl -Credential (Get-StoredCredential -Target sympmarc)

class List {
    [string]$ListName;
}

$Lists = @(
    [List]@{ListName="Shared Documents"}
    [List]@{ListName="Property"}
)

foreach($l in $Lists)
{
    Export-SiteScriptFromList -TemplateSiteUrl $templateSiteUrl -ListName $l.ListName
}
