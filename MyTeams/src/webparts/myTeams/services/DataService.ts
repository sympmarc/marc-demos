import * as lodash from '@microsoft/sp-lodash-subset';

import {QueryPropertyValueType, SearchQuery, SearchResults, sp} from "@pnp/sp";

import {
  ISPSite,
  SPSite,
  ISharePointSearchResultsTable,
  ISharePointSearchResultsTableCells,
  ISharePointSearchResultsTableCell
} from '../models/Models';


const defaultLogo: string = "/sites/Demos2013/SiteAssets/TheX.jpg";

export interface IDataService {
  getSiteData(): Promise<ISPSite[]>;
  getTenantWebData(): Promise<ISPSite[]>;
}

export class DataService implements IDataService {

  public async getSiteData(): Promise<ISPSite[]> {

    let sites: ISPSite[] = [];

    var thisDomain: string = location.host.split(".")[0];
    var exclusions: string[] = ["https://" + thisDomain + "-my.sharepoint.com", "https://" + thisDomain + ".sharepoint.com/portals/personal"];
    var exclusionString: string = " -Path:" + exclusions.join(" -Path:");
    exclusionString += " -Path=https://" + thisDomain + ".sharepoint.com";

    try {

      let result = await sp.search(<SearchQuery>{
        Querytext: "contentclass:sts_site " + exclusionString,
        RowLimit: 500,
        TrimDuplicates: false,
        Properties: [{
          Name: "EnableDynamicGroups",
          Value: {
            BoolVal: true,
            QueryPropertyValueTypeIndex: QueryPropertyValueType.BooleanType
          }
        }],
        SelectProperties: ["Title", "Path", "SiteLogo"]
      });

      sites = this.processSearchResultsSites(result);

      return sites;

    } catch (e) {

      console.error(e);
      return sites;

    }

  }


  public async getTenantWebData(): Promise<ISPSite[]> {

    let sites: ISPSite[] = [];

    var thisDomain: string = location.host.split(".")[0];

    let result = await sp.search(<SearchQuery>{
      Querytext: "contentclass:sts_web Path:https://" + thisDomain + ".sharepoint.com",
      RowLimit: 500,
      TrimDuplicates: false,
      SelectProperties: ["Title", "Path"]
    });

    let searchResults = lodash.get(result, "RawSearchResults.PrimaryQueryResult.RelevantResults.Table", sites);

    return this.processSearchResultsWebs(searchResults);

  }

  private processSearchResultsSites(relevantResults: SearchResults): ISPSite[] {

    var sites: ISPSite[] = [];

    relevantResults.PrimarySearchResults.forEach((result: any) => {

      var site = new SPSite();
      site.Title = result.Title;
      site.Path = result.Path;
      site.SiteLogo = result.SiteLogo ? result.SiteLogo : defaultLogo;

      if (site.Title) {
        sites.push(site);
      }

    });

    return sites;

  }


  private processSearchResultsWebs(relevantResults: ISharePointSearchResultsTable): ISPSite[] {

    var sites: ISPSite[] = [];

    relevantResults.Rows.forEach((cells: ISharePointSearchResultsTableCells) => {

      var site = new SPSite();

      cells.Cells.forEach((cell: ISharePointSearchResultsTableCell) => {

        if (cell.Key === "Title") {
          site.Title = cell.Value;
        }
        if (cell.Key === "Path") {
          site.Path = cell.Value;
        }
        if (cell.Key === "SiteLogo") {
          site.SiteLogo = cell.Value ? cell.Value : defaultLogo;
//          site.SiteLogo = cell.Value;
        }

      });

      site.SiteLogo = (site.SiteLogo && site.SiteLogo !== "0") ? site.SiteLogo : defaultLogo;

      if (site.Title) {
        sites.push(site);
      }
    });

    return sites;

  }

}
