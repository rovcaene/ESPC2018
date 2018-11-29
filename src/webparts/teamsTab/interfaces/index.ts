export interface IList {
  id: string;
  title: string;
  serverRelativeUrl?: string;
}

export interface IPicture {
  url?: string;
  thumbnailUrl?: string;
}

export interface IDataService{
  getPictureLibraries(): Promise<IList[]>;
  getPicturesFromFolder(folderServerRelativeUrl: string) : Promise<IPicture[]>;
}