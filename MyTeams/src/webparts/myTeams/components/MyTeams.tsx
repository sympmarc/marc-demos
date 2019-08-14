import * as React from 'react';
import * as lodash from 'lodash';

import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';

import styles from './MyTeams.module.scss';
import {IExclusion, ISPSite} from "../models/Models";
import {DataService, IDataService} from "../services/DataService";
import MyTeamsListing from "./MyTeamsListing";

export interface IMyTeamsProps {
  tenantSiteExclusionsContains: string;
  tenantSiteExclusionsEquals: string;
}

export interface IMyTeamsState {
  sites: ISPSite[];
}

export class MyTeamsState implements IMyTeamsState {
  constructor(
    public sites: ISPSite[] = [],
  ) {
  }
}

export default class MyTeams extends React.Component<IMyTeamsProps, IMyTeamsState> {
  private dataService: IDataService = new DataService();

  public constructor(props: IMyTeamsProps) {
    super(props);
    var state = new MyTeamsState();

    this.state = state;

    this._loadSites();

  }

  private async _loadSites(): Promise<void>  {

    // Site results
    var siteList: ISPSite[] = await this.dataService.getSiteData();
    // Tenant subsite results
    var sites: ISPSite[] = await this.dataService.getTenantWebData();

    var allSites: ISPSite[] = siteList.concat(sites);

    var filteredSites: ISPSite[] = this.filterTenantSubsites(allSites);

    // Sort the sites for display
    filteredSites = filteredSites.sort((a, b) => {
      if (a.Title.toLowerCase() < b.Title.toLowerCase())
        return -1;
      if (a.Title.toLowerCase() > b.Title.toLowerCase())
        return 1;
      return 0;
    });

    this.setState({
      sites: filteredSites
    });

  }


  public render(): React.ReactElement<IMyTeamsProps> {
    return (
      <div className={styles.myTeams}>
        {this.state.sites.length === 0 &&
          <div>
            <Shimmer className={styles.siteShimmer} customElementsGroup={this._getCustomElements()} width={300}>
            </Shimmer>
            <Shimmer className={styles.siteShimmer} customElementsGroup={this._getCustomElements()} width={300}>
            </Shimmer>
            <Shimmer className={styles.siteShimmer} customElementsGroup={this._getCustomElements()} width={300}>
            </Shimmer>
            <Shimmer className={styles.siteShimmer} customElementsGroup={this._getCustomElements()} width={300}>
            </Shimmer>
            <Shimmer className={styles.siteShimmer} customElementsGroup={this._getCustomElements()} width={300}>
            </Shimmer>
            <Shimmer className={styles.siteShimmer} customElementsGroup={this._getCustomElements()} width={300}>
            </Shimmer>
          </div>
        }
        {this.state.sites.length > 0 &&
          <MyTeamsListing
            sites={this.state.sites}>
          </MyTeamsListing>
        }
      </div>
    );
  }

  private _getCustomElements = (): JSX.Element => {
    return (
      <div style={{ display: 'flex' }}>
        <ShimmerElementsGroup
          shimmerElements={[{ type: ShimmerElementType.circle, height: 40 }, { type: ShimmerElementType.gap, width: 16, height: 40 }]}
        />
        <ShimmerElementsGroup
          flexWrap={true}
          width="100%"
          shimmerElements={[
            { type: ShimmerElementType.line, width: '100%', height: 10, verticalAlign: 'center' },
          ]}
        />
      </div>
    );
  }

  private filterTenantSubsites(sites: ISPSite[]): ISPSite[] {

    var exclusions: IExclusion[] = [];
    var workingSites: ISPSite[] = lodash.cloneDeep(sites);
    var filteredSites: ISPSite[] = [];

    // Filter CONTAINS
    exclusions = this.expandExclusions(this.props.tenantSiteExclusionsContains);

    workingSites.forEach((site: ISPSite) => {
      exclusions.forEach((exclusion: IExclusion) => {
        if (exclusion.SiteText.length > 0 &&
          (site.Path.toLowerCase().indexOf(exclusion.SiteText.toLowerCase()) !== -1 ||
            site.Title.toLowerCase().indexOf(exclusion.SiteText.toLowerCase()) !== -1)) {
          site.removeContains = true;
        }
      });
    });

    // Filter EQUALS
    exclusions = this.expandExclusions(this.props.tenantSiteExclusionsEquals);

    workingSites.forEach((site: ISPSite) => {
      if (!site.removeContains) {
        exclusions.forEach((exclusion: IExclusion) => {
          if (exclusion.SiteText.length > 0 && (site.Path.toLowerCase() === "https://" + exclusion.SiteText.toLowerCase())) {
            site.removeEquals = true;
          }
        });
      }
    });

    workingSites.forEach((site: ISPSite) => {
      if (!site.removeContains && !site.removeEquals) {
        filteredSites.push(site);
      }
    });

    return filteredSites;

  }

  private expandExclusions(excludeList: any): IExclusion[] {

    var exclusions: IExclusion[] = [];

    var removeSites = excludeList ? excludeList.split("\n") : [];
    removeSites.forEach((site: string) => {
      exclusions.push({
        SiteText: site
      });
    });

    return exclusions;

  }

}
