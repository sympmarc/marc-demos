$adminSiteUrl = "https://sympraxis-admin.sharepoint.com"

Connect-SPOService $adminSiteUrl -Credential (Get-StoredCredential -Target Sympraxis)

Invoke-SPOSiteSwap -SourceUrl https://sympraxis.sharepoint.com/sites/Intranet -TargetUrl https://sympraxis.sharepoint.com -ArchiveUrl https://sympraxis.sharepoint.com/sites/Archive