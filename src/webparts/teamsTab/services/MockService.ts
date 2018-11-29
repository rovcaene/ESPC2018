import { IDataService, IList, IPicture } from "../interfaces";

export default class MockService implements IDataService {
  public getPictureLibraries(): Promise<IList[]> {
    return Promise.resolve([{ id: "1", title: "Sample" }]);
  }

  public getPictures(pictureLib: string): Promise<IPicture[]> {
    return Promise.resolve([
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/5M4EW814AO.jpg" },
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/U3W2SHOLWQ.jpg" },
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/FSPLFPQBCZ.jpg" },
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/S059QDGBOG.jpg" },
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/6U6EAPKKD7.jpg" }
    ]);
  }

  public getPicturesFromFolder(folderServerRelativeUrl: string): Promise<IPicture[]> {
    return Promise.resolve([
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/5M4EW814AO.jpg" },
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/U3W2SHOLWQ.jpg" },
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/FSPLFPQBCZ.jpg" },
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/S059QDGBOG.jpg" },
      { url: "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/6U6EAPKKD7.jpg" }
    ]);
  }
}