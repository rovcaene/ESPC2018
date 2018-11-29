import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'TeamsTabWebPartStrings';
import TeamsTab, { ITeamsTabProps } from './components/TeamsTab';
import { IDataService } from './interfaces';
import DataService from './services/DataService';
import MockService from './services/MockService';

export interface ITeamsTabWebPartProps {
  pictureLibrary?: string;
  showNav: boolean;
  showThumbnails: boolean;
  autoPlay: boolean;
}

export default class TeamsTabWebPart extends BaseClientSideWebPart<ITeamsTabWebPartProps> {
  private _dataService: IDataService;
  private _listDropDownOptions: IPropertyPaneDropdownOption[] = [];

  private _teamsContext: microsoftTeams.Context;

  protected onInit(): Promise<void> {
    // Set the DataService
    switch (Environment.type) {
      case EnvironmentType.SharePoint:
      case EnvironmentType.ClassicSharePoint:
        this._dataService = new DataService(this.context.pageContext.web.absoluteUrl, this.context.spHttpClient);
        break;
      default:
        this._dataService = new MockService();
        break;
    }

    // Load the dropdown options
    this._dataService.getPictureLibraries()
      .then(lists => {
        // Set the dropdown options
        this._listDropDownOptions = lists.map(list => ({ key: list.id, text: list.title }));

        // Refresh the property pane
        this.context.propertyPane.refresh();
      });

    // Check if you are running in Microsoft Teams
    if (this.context.microsoftTeams) {
      return new Promise((resolve, reject) => {
        this.context.microsoftTeams.getContext(context => {
          this._teamsContext = context;
          resolve();
        });
      });
    }
    else {
      return Promise.resolve();
    }
  }

  public render(): void {
    // Get the folder relative url based on whether you're in SharePoint or Teams
    const folderRelativeUrl =
      (this._teamsContext) ?
      (this._teamsContext as any).channelRelativeUrl :
      this._listDropDownOptions.filter(opt => opt.key == this.properties.pictureLibrary);

    const element: React.ReactElement<ITeamsTabProps> = React.createElement(
      TeamsTab,
      {
        dataService: this._dataService,
        teamsContext: this._teamsContext,
        folderRelativeUrl: folderRelativeUrl,
        version: this.context.manifest.version,
        showNav: this.properties.showNav,
        showThumbnails: this.properties.showThumbnails,
        autoPlay: this.properties.autoPlay
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const propertyPane: IPropertyPaneConfiguration = {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: false,
          groups: []
        }
      ]
    };

    // Only ask for a picture library if we're not in Teams
    if (!this.context.microsoftTeams) {
      propertyPane.pages[0].groups.push(
        {
          groupName: strings.BasicGroupName,
          groupFields: [
            PropertyPaneDropdown('pictureLibrary', {
              label: "Library",
              options: this._listDropDownOptions
            })
          ]
        }
      );
    }

    // Add the remaining properties
    propertyPane.pages[0].groups.push(
      {
        groupName: "Image Gallery",
        groupFields: [
          PropertyPaneToggle('showNav', {
            label: 'Show navigation',
            checked: this.properties.showNav
          }),
          PropertyPaneToggle('showThumbnails', {
            label: 'Show thumbnails',
            checked: this.properties.showThumbnails
          }),
          PropertyPaneToggle('autoPlay', {
            label: 'Autoplay',
            checked: this.properties.autoPlay
          })
        ]
      }
    );

    return propertyPane;
  }
}
