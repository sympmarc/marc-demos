$tenant = "sympmarc"
$adminSiteUrl = "https://$($tenant)-admin.sharepoint.com"

Connect-PnPOnline $adminSiteUrl -Interactive

Get-PnPHomeSite

Set-PnPHomeSite -HomeSiteUrl "https://$($tenant).sharepoint.com/sites/IntranetNEW"
