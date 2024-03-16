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
      document.head.appendChild(link);

      link.onload = () => {
        const font = new FontFaceObserver(fonts.fontFamily);
        return font.load().then(resolve).catch(reject);
      };
      link.onerror = () =>
        reject(new Error(`Failed to load font at ${fonts.url}`));
    });
  }
}
