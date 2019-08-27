import {WebPartContext} from '@microsoft/sp-webpart-base';
import {PrincipalInfo} from "@pnp/sp";

export interface IServiceProperties {
  context: WebPartContext;
  currentUser: PrincipalInfo;
}

export interface ISPSite {
  Title: string;
  Path: string;
  SiteLogo: string;
  removeContains?: boolean;
  removeEquals?: boolean;
}

export class SPSite implements ISPSite {
  constructor(
    public Title: string = "",
    public Path: string = "",
    public SiteLogo: string = "0",
    public removeContains: boolean = false,
    public removeEquals: boolean = false
  ) {
  }
}

export interface IExclusion {
  SiteText: string;
}

export interface ISharePointSearchResults {
  PrimaryQueryResult: ISharePointPrimaryQueryResult;
}

export interface ISharePointPrimaryQueryResult {
  RelevantResults: ISharePointRelevantResultsTable;
}

export interface ISharePointRelevantResultsTable {
  Table: ISharePointSearchResultsTable;
}

export interface ISharePointSearchResultsTable {
  Rows: Array<any>;
}

export interface ISharePointSearchResultsTableCells {
  Cells: Array<ISharePointSearchResultsTableCell>;
}

export interface ISharePointSearchResultsTableCell {
    Key: string;
    Value: string;
    ValueType: string;
}
