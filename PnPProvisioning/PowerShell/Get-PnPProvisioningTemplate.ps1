$adminSiteUrl = "https://sympmarc-admin.sharepoint.com"

# Custom functions
Import-Module "./Powershell/UtilityFunctions.psm1" -Force

$templateSiteUrl = "https://sympmarc.sharepoint.com/sites/InformationArchitecture/"

Connect-PnPOnline -Url $templateSiteUrl -Credentials sympmarc

Get-PnPProvisioningTemplate `
    -Configuration "./PowerShell/IA/PnP JSON/PnPPropertySite.json" `
    -Out "./PowerShell/IA/PnP XML/PnP-Provisioning-DemoSite - RAW.xml"`
    -Force
