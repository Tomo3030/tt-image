import { Injectable } from '@angular/core';
import { GameData } from 'src/app/types/game-data';

@Injectable({
  providedIn: 'root',
})
export class DragDropElementsService {
  constructor() {}

  // this could be way simpler.
  // just shuffle allElements.
  // then assign n elements to the nth user
  // then filter assigned elements from elementPlacement
  // then assign the rest to asset-container
  // then add additional elements to asset-container

  public getDragDropPlacements(
    elementPlacement: any,
    allElements: any[],
    data: GameData,
    userName: string
  ) {
    const members = data.members;
    const additionalElements = data.scene.additionalElements;

    const svgPlacement = this.getMySVGPlacement(
      elementPlacement,
      members,
      userName
    );

    if (additionalElements) {
      let elements = allElements.slice(-additionalElements).map((el) => {
        return el.path;
      });
      let assetContainer = svgPlacement['asset-container'] || [];
      assetContainer.push(...elements);
      svgPlacement['asset-container'] = assetContainer;
    }

    const textboxText = this.getMyTextboxText(
      elementPlacement,
      data.members,
      userName
    );

    return { svgPlacement, textboxText };
  }

  private getMySVGPlacement(
    assetPlacement: any,
    members: string[],
    userName: string
  ) {
    const svgPlacement: any = {};

    const dzRefs = Object.keys(assetPlacement).filter((ref) =>
      ref.includes('dz')
    );
    if (dzRefs.length === 0) return null;

    const myDzRefs = this.filterElements(dzRefs, members, userName);

    myDzRefs.forEach((dz) => {
      svgPlacement[dz] = assetPlacement[dz];
    });

    const assetContainerRefs = dzRefs.filter((dz) => !myDzRefs.includes(dz));

    svgPlacement['asset-container'] = assetPlacement['asset-container'] || [];

    assetContainerRefs.forEach((ref) => {
      svgPlacement['asset-container'].push(assetPlacement[ref]);
    });
    return svgPlacement;
  }

  private getMyTextboxText(
    elementPlacement: any,
    members: string[],
    userName: string
  ) {
    let textboxRefs = Object.keys(elementPlacement).filter((ref) =>
      ref.includes('textbox')
    );
    let userTextboxRefs = this.filterElements(textboxRefs, members, userName);

    let myTextboxes: any = {};
    userTextboxRefs.forEach((ref, i) => {
      myTextboxes[ref] = elementPlacement[ref];
    });

    return myTextboxes || {};
  }

  private filterElements(array: any[], members: string[], userName: string) {
    //this will be seed random
    let myIndex = members.indexOf(userName);
    if (myIndex === -1) throw new Error('User not found in members list');
    let myArray: any[] = [];
    array.forEach((item, i) => {
      if (myIndex % members.length === i % members.length) myArray.push(item);
    });
    return myArray;
  }
}
