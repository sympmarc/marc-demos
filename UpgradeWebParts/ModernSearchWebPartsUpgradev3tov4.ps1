# ModernSearchWebPartsUpgradev3tov4.ps1 - Inventory PnP Modern Search Web Parts usage to upgrade from v3 to v4

# Connect to your tenant here. This should be the only change you need to make to use this script.
Connect-PnPOnline -Url https://sympmarc-admin.sharepoint.com -UseWebLogin

# You can get the Ids for the v3 Web Parts by adding them to a page and running:
# Get-PnPClientSideComponent -Page "page-name" | Where-Object { Title -ne $null } | Select-Object Title, WebPartId

# Title            WebPartId
# -----            ---------
# Search Filters   e899ac12-9256-4c8d-a8ad-dbd20fc459c3
# Search Box       096b96cc-8a44-41fa-9b4d-c0ab2ab2a779
# Search Verticals 9d441773-f735-46a3-9ca0-9e2eb4bef203
# Search Results   42ad2740-3c60-49cf-971a-c44e33511b93

$webPartIds = @(
    "e899ac12-9256-4c8d-a8ad-dbd20fc459c3",
    "096b96cc-8a44-41fa-9b4d-c0ab2ab2a779",
    "9d441773-f735-46a3-9ca0-9e2eb4bef203",
    "42ad2740-3c60-49cf-971a-c44e33511b93"
    )

# Get all the sites in the tenant
$sites = Get-PnPTenantSite

# You may choose to exclude some subsets of sites
$filteredSites = $sites #| Where-Object { $_.Url -eq 'https://sympmarc.sharepoint.com/sites/DemoSite' } 

foreach ($site in $filteredSites) {

    # Build the query
    if($site.Url | Select-String "/sites/") {
        $query = "Path:$($site.Url) AND FileExtension:aspx AND ($($webPartIds -join " OR "))"
    } else {
        # Exclude /sites/* if looking in the root site
        $query = "Path:$($site.Url) -Path:$($site.Url)/sites/ AND FileExtension:aspx AND ($($webPartIds -join " OR "))"
    }
    #Write-Host -BackgroundColor White -ForegroundColor Black "Looking in $($site.Url)" # $($query)"

    # Submit the query
    $pages = Submit-PnPSearchQuery -Query $query -All -RelevantResults -ErrorAction SilentlyContinue | Select-Object OriginalPath 
    # If there are results, display them
    if ($pages) {
        Write-Host -BackgroundColor White -ForegroundColor Black "Found v3 Web Parts in this site: $($site.Url)" # $($query)"
        foreach ($page in $pages) {
            Write-Host -BackgroundColor Green -ForegroundColor Black ">>> Found Web Parts in this page: $($page.OriginalPath)"                
        }
    }

}
