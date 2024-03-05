import { Injectable } from '@angular/core';
import FontFaceObserver from 'fontfaceobserver';

@Injectable({
  providedIn: 'root',
})
export class FontService {
  loadSceneFont(
    fonts: { url: string; fontFamily: string } | undefined
  ): Promise<any> {
    if (!fonts) return Promise.resolve();
    return new Promise((resolve, reject) => {
      let link = document.createElement('link');
      link.href = fonts.url;
      link.rel = 'stylesheet';
      link.onload = resolve;
      link.onerror = () =>
        reject(new Error(`Failed to load font at ${fonts.url}`)); // Reject the promise on error
      document.head.appendChild(link);

      const font = new FontFaceObserver(fonts.fontFamily);
      return font.load().then(resolve, reject);
    });
  }
}
