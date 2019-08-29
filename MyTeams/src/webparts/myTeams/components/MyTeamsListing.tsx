import * as React from 'react';

import styles from './MyTeams.module.scss';
import {ISPSite} from "../models/Models";

export interface IMyTeamsListingProps {
  title: string;
  defaultLogo: string;
  sites: ISPSite[];
}

export default class MyTeamsListing extends React.Component<IMyTeamsListingProps, {}> {
  public render(): React.ReactElement<IMyTeamsListingProps> {
    return (
      <div>
        <ul className={styles.sites}>
          {this.props.sites.map((site, index) => {
            return <li className={styles.site}>
              <div>
                <div>
                  <img className={styles.siteLogo} src={site.SiteLogo}></img>
                </div>
                <div>
                  <a className="ms-font-l" title={site.Title} target="_blank" href={site.Path}>{site.Title}</a>
                </div>
                <div className={styles.clear}></div>
              </div>
            </li>;
          })}
        </ul>

      </div>
    );
  }
}
