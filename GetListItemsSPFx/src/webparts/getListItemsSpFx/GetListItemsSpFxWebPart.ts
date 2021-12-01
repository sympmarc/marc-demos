import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import { sp } from '@pnp/pnpjs';

import * as strings from 'GetListItemsSpFxWebPartStrings';
import GetListItemsSpFx from './components/GetListItemsSpFx';
import { IGetListItemsSpFxProps } from './components/IGetListItemsSpFxProps';

export interface IGetListItemsSpFxWebPartProps {
  showColors: string;
}

export interface IColor {
  Title: string;
  HexCode: string;
  InfoLink: {
    Description: string;
    Url: string;
  };
}

export default class GetListItemsSpFxWebPart extends BaseClientSideWebPart<IGetListItemsSpFxWebPartProps> {

  public render(): void {
    this.init().then((element: React.ReactElement<any>) => {
      ReactDom.render(element, this.domElement);
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private async init(): Promise<React.ReactElement<any>> {

    sp.setup({
      spfxContext: this.context
    });

    let colors: IColor[] = await this.getColorData();

    return new Promise<React.ReactElement<any>>((resolve) => {

      //Render
      const element: React.ReactElement<IGetListItemsSpFxProps> = React.createElement(
        GetListItemsSpFx,
        {
          colors: colors,
          showColors: this.properties.showColors
        }
      );
      resolve(element);

    });

  }

  public async getColorData(): Promise<IColor[]> {

    let colors: IColor[] = [];

    try {

      let result = await sp.web.lists.getByTitle("Colors").items.select("Title", "HexCode", "InfoLink").get();
      colors = result;
      return colors;

    } catch (e) {

      console.error(e);
      return colors;

    }

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
                PropertyPaneTextField('showColors', {
                  label: strings.ShowColorsFieldLabel,
                  value: "Yes"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
