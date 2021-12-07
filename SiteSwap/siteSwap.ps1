$tenant = "sympmarc"
$adminSiteUrl = "https://$($tenant)-admin.sharepoint.com"

Connect-SPOService $adminSiteUrl -Credential (Get-StoredCredential -Target Sympraxis)

Invoke-SPOSiteSwap -SourceUrl "https://$($tenant).sharepoint.com/sites/IntranetNEW" `
    -TargetUrl "https://$($tenant).sharepoint.com" `
    -ArchiveUrl "https://$($tenant).sharepoint.com/sites/IntranetOLD"