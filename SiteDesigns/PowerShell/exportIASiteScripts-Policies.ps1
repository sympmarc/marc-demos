# Load PnP.PowerShell, if it isn't already
Import-Module PnP.PowerShell -Force
Import-Module ./PowerShell/UtilityFunctions.psm1 -Force

Add-SympVariables

# Using the HR site as the template
$templateSiteUrl = "https://$($tenant).sharepoint.com/sites/HR"

Connect-PnPOnline -Url $adminSiteUrl -Interactive

class List {
    [string]$ListName;
}

$Lists = @(
    [List]@{ListName="Policies"}
    [List]@{ListName="Contracts"}
)
#     [List]@{ListName="Contracts"}


foreach($l in $Lists)
{
    Export-SiteScriptFromList -TemplateSiteUrl $templateSiteUrl -ListName $l.ListName
}


