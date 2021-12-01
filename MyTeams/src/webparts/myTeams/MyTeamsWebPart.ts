import * as React from 'react';
import * as ReactDom from 'react-dom';

import {sp} from "@pnp/sp";

import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration, PropertyPaneTextField } from "@microsoft/sp-property-pane";

import * as strings from 'MyTeamsWebPartStrings';
import MyTeams, {IMyTeamsProps} from './components/MyTeams';

export interface IMyTeamsWebPartProps {
  title: string;
  defaultLogo: string;
  tenantSiteExclusionsContains: string;
  tenantSiteExclusionsEquals: string;
}

export default class MyTeamsWebPart extends BaseClientSideWebPart<IMyTeamsWebPartProps> {

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private async init(): Promise<React.ReactElement<any>> {

    sp.setup({
      spfxContext: this.context
    });

    return new Promise<React.ReactElement<any>>((resolve) => {

      //Render
      const element: React.ReactElement<IMyTeamsProps> = React.createElement(
        MyTeams,
        {
          title: this.properties.title,
          defaultLogo: this.properties.defaultLogo,
          tenantSiteExclusionsContains: this.properties.tenantSiteExclusionsContains,
          tenantSiteExclusionsEquals: this.properties.tenantSiteExclusionsEquals
        }
      );
      resolve(element);

    });

  }

  public render(): void {
    this.init().then((element: React.ReactElement<any>) => {
      ReactDom.render(element, this.domElement);
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                  value: ""
                }),
                PropertyPaneTextField('tenantSiteExclusionsContains', {
                  label: strings.tenantSiteExclusionsContainsFieldLabel,
                  multiline: true,
                  resizable: true,
                  value: ""
                }),
                PropertyPaneTextField('tenantSiteExclusionsEquals', {
                  label: strings.tenantSiteExclusionsEqualsFieldLabel,
                  multiline: true,
                  resizable: true,
                  value: ""
                })
              ]
            }
          ]
        }
      ]
    };
  }

}
