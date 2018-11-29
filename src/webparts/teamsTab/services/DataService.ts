import { IDataService, IList, IPicture } from "../interfaces";
import { SPHttpClient } from "@microsoft/sp-http";

export default class DataService implements IDataService {
  public constructor(protected webFullUrl: string, protected spHttpClient: SPHttpClient) {

  }

  public getPictureLibraries(): Promise<IList[]> {
    return this.spHttpClient.get(
      `${this.webFullUrl}/_api/Web/Lists?$select=Id,Title,RootFolder/ServerRelativeUrl&$filter=BaseTemplate eq 109&$expand=RootFolder`,
      SPHttpClient.configurations.v1)
      .then(response => response.json())
      .then(json => json.value.map(list => ({ id: list.RootFolder.ServerRelativeUrl, title: list.Title })));
  }

  public getPicturesFromFolder(folderServerRelativeUrl: string): Promise<IPicture[]> {
    return this.spHttpClient.get(
      `${this.webFullUrl}/_api/Web/getfolderbyserverrelativeurl('${folderServerRelativeUrl}')/Files?$select=ServerRelativeUrl`,
      SPHttpClient.configurations.v1)
      .then(respponse => respponse.json())
      .then(json => json.value.map(pic => ({ url: pic.ServerRelativeUrl, thumbnailUrl: pic.ServerRelativeUrl })));
  }
}