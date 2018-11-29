import * as React from 'react';
import styles from './TeamsTab.module.scss';
import { IDataService, IPicture } from '../interfaces';

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

export interface ITeamsTabProps {
  dataService: IDataService;
  teamsContext?: microsoftTeams.Context;
  folderRelativeUrl?: string;
  version?: string;
  showNav: boolean;
  showThumbnails: boolean;
  autoPlay: boolean;
}

export interface ITeamsTabState {
  pictures: IPicture[];
}

export default class TeamsTab extends React.Component<ITeamsTabProps, ITeamsTabState> {
  constructor(props) {
    super(props);

    this.state = {
      pictures: []
    };
  }

  public componentDidMount(): void {
    this.loadPictures();
  }

  public componentDidUpdate(prevProps: Readonly<ITeamsTabProps>): void {
    if (prevProps.folderRelativeUrl != this.props.folderRelativeUrl) {
      this.loadPictures();
    }
  }

  protected loadPictures() {
    this.setState({ pictures: [] });

    if (this.props.folderRelativeUrl) {
      this.props.dataService.getPicturesFromFolder(this.props.folderRelativeUrl)
        .then(pictures => {
          this.setState({ pictures });
          console.log(pictures);
        });
    }
  }

  public render(): React.ReactElement<ITeamsTabProps> {
    let pictures = this.state.pictures.map(picture => ({ original: picture.url, thumbnail: picture.thumbnailUrl }));

    console.log(this.props.teamsContext);

    return (
      <div className={styles.teamsTab}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <p className={styles.title}>Welcome to {(this.props.teamsContext) ? "Teams" : "SharePoint"}!</p>
              <ImageGallery
                items={pictures}
                showNav={this.props.showNav}
                showThumbnails={this.props.showThumbnails}
                autoPlay={this.props.autoPlay} />
              <p className={styles.description}>WebPart version: {this.props.version}</p>
              {
                (this.props.teamsContext) ?
                  (
                    <div>
                      <p className={styles.description}>Team Name: {this.props.teamsContext.teamName}</p>
                      <p className={styles.description}>Channel Name: {this.props.teamsContext.channelName}</p>
                      <p className={styles.description}>SharePoint Url: {this.props.teamsContext.teamSiteUrl}</p>
                    </div>
                  ) :
                (<div />)
              }
            </div>
          </div>
        </div>
          </div>
          );
        }
      }
