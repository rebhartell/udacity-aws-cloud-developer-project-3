import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../api/api.service';
import { FeedItem } from '../models/feed-item.model';


@Injectable({
  providedIn: 'root'
})
export class FeedProviderService {
  currentFeed$: BehaviorSubject<FeedItem[]> = new BehaviorSubject<FeedItem[]>([]);

  constructor(private api: ApiService) { }

  async getFeed(): Promise<BehaviorSubject<FeedItem[]>> {
    console.log("Attempt to get items from {API_HOST}/feed ...");
    const req = await this.api.get('/feed');
    console.log("... got items - so call to {API_HOST} works!");
    const items = <FeedItem[]> req.rows;
    console.log("Show no. items and first item (if any) ...");
    console.log("... items.length = " + items.length);
    if (items.length > 0) {
    console.log("... items[0].caption = " + items[0].caption);
    console.log("... items[0].id      = " + items[0].id);
    console.log("... items[0].url     = " + items[0].url);
  }
  this.currentFeed$.next(items);
    return Promise.resolve(this.currentFeed$);
  }

  async uploadFeedItem(caption: string, file: File): Promise<any> {
    const res = await this.api.upload('/feed', file, {caption: caption, url: file.name});
    const feed = [res, ...this.currentFeed$.value];
    this.currentFeed$.next(feed);
    return res;
  }

}

// async getFeed() {
//   const url = `${API_HOST}/feed`;

//   const req = this.http.get(url, this.httpOptions).pipe(
//     map(this.extractData));
//     // catchError(this.handleError));
//   const resp = <any> (await req.toPromise());
//   return resp.rows;
// }
