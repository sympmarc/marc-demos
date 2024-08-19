<#
.Synopsis
.DESCRIPTION
.EXAMPLE
   Add-SympVariables
#>
function Add-SympVariables {
   [CmdletBinding()]
   [Alias()]
   [OutputType([int])]
   Param
   (

   )

   Begin {

      $root = ".\PowerShell"
      $settings = Get-Content -Path "$($root)\.settings.json" | ConvertFrom-Json

   }
   Process {

      Write-Host "Setting global variables..."

      Set-Variable -Scope global -Name tenant -Value $settings.tenant
      Set-Variable -Scope global -Name adminSiteUrl -Value "https://$($tenant)-admin.sharepoint.com"      

   }
   End {

   }
}

<#
.Synopsis
   Export a Site Script from an existing list (library)
.DESCRIPTION
   Export a Site Script from an existing list (library)
.EXAMPLE
   Export-SiteScriptFromList -SiteUrl $siteUrl -ListName $listName -Credentials $Credentials
#>
function Export-SiteScriptFromList {
   [CmdletBinding()]
   [Alias()]
   [OutputType([int])]
   Param
   (
      # TemplateSiteUrl
      [string]
      $TemplateSiteUrl,

      # ListName
      [string]
      $ListName

   )

   Begin {

      # Build the full path from the piece parts
      $fullPath = $($TemplateSiteUrl) + "/" + $($ListName)

   }
   Process {

      Write-Host "Exporting list: $($ListName) in $($TemplateSiteUrl)"

      # Export to a specified location
      Get-PnPSiteScriptFromList -Url $fullPath | Out-File "./Powershell/IA/Exports/$($ListName).json"

   }
   End {
   }
}


<#
.Synopsis
   Registers a Site Script with a SharePoint tenant
.DESCRIPTION
   Registers a Site Script with a SharePoint tenant or updates if a Site Script with the same SiteSciptTitle already exists. Must already be connected to a site in the tenant. User that connected must be a SharePoint Admin. 
.EXAMPLE
   $SiteScriptPath = "D:\Code\Matan\Deployment\PowerShell\IA\site-scripts\_MatanPropertyBase.json"
   Add-SiteScript -SiteScriptFile $SiteScriptPath -SiteScriptTitle "Set up Library"
#>
function Add-SiteScript {
   [CmdletBinding()]
   [Alias()]
   [OutputType([int])]
   Param
   (
      # Path to JSON file containing Site Script definition
      [string]
      $SiteScriptFile,

      # Title of Site Script
      [Parameter(Mandatory=$true)]
      [string]
      $SiteScriptTitle
   )

   Begin {
       
   }
   Process {

      Write-Host "Registering Site Script: $($SiteScriptTitle)"

      $siteScript = Get-PnPSiteScript | Where-Object { $_.Title -eq $SiteScriptTitle }

      if (!$siteScript) {
         Write-Host "Adding Site Script: $($SiteScriptTitle)"
         $script = Get-Content $SiteScriptFile -Raw
         $siteScript = (Add-PnPSiteScript -Title $SiteScriptTitle -Content $script) | Select-Object -First 1 Id   
      }
      else {
         Write-Host "Updating Site Script: $($SiteScriptTitle)"
         Set-PnPSiteScript -Identity $siteScript.Id -Content (Get-Content $siteScriptFile -Raw)
      }

   }
   End {

      return $siteScript.Id

   }
}


<#
.Synopsis
   Registers a Site Design with the SharePoint tenant
.DESCRIPTION
   Registers a Site Design with the SharePoint tenant or updates if a Site Design with the same SiteDesignTitle already exists
.EXAMPLE
   Add-SiteDesign -AdminSiteUrl $adminSiteUrl -WebTemplate 64 -SiteDesignTitle "Client Site" -SiteScriptIds $siteScriptIds -Credentials $Credentials
#>
function Add-SiteDesign {
   [CmdletBinding()]
   [Alias()]
   [OutputType([int])]
   Param
   (
      # AdminSiteUrl - for connection
      [string]
      $AdminSiteUrl,

      # SiteScriptIds
      [array]
      $SiteScriptIds,

      # SiteDesignTitle
      [string]
      $SiteDesignTitle,

      # WebTemplate
      [string]
      $WebTemplate,

      # Credentials
      [SecureString]
      $Credentials
   )

   Begin {
       
   }
   Process {

      Write-Host "Registering Site Design: $($SiteDesignTitle)"

      $siteDesign = Get-PnPSiteDesign | Where-Object { $_.Title -eq $SiteDesignTitle }

      if (!$siteDesign) {
         $siteDesign = Add-PnPSiteDesign -WebTemplate $WebTemplate -Title $SiteDesignTitle -SiteScriptIds $SiteScriptIds    
      }
      else {
         $siteDesign = Set-PnPSiteDesign -Identity $siteDesign.Id -SiteScriptIds $SiteScriptIds
      }

   }
   End {

      return $siteDesign

   }
}