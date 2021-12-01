import * as React from 'react';
import styles from './GetListItemsSpFx.module.scss';
import { IGetListItemsSpFxProps } from './IGetListItemsSpFxProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class GetListItemsSpFx extends React.Component<IGetListItemsSpFxProps, {}> {
  public render(): React.ReactElement<IGetListItemsSpFxProps> {

    let showColors = this.props.showColors === "Yes";
    return (
      <div className={styles.getListItemsSpFx}>
        <ul>
          {this.props.colors.map((color, index) => {

            let thisColor = showColors ? { "color": color.HexCode } : {};

            return <li>
              <span style={ thisColor }>{color.Title}</span>
              <span> sptechcon </span>
              <a href={color.InfoLink.Url}>{color.InfoLink.Description}</a>
            </li>;
          })}
        </ul>
      </div>
    );
  }
}
