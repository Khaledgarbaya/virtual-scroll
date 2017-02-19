[![Build Status](https://travis-ci.org/Khaledgarbaya/virtual-scroll.svg?branch=master)](https://travis-ci.org/Khaledgarbaya/virtual-scroll)
[![npm version](https://badge.fury.io/js/virtual-scroll-list.svg)](https://badge.fury.io/js/virtual-scroll-list)
```
            _    ___      __              __   _____                 ____
            | |  / (_)____/ /___  ______ _/ /  / ___/______________  / / /
            | | / / / ___/ __/ / / / __ `/ /   \__ \/ ___/ ___/ __ \/ / /
            | |/ / / /  / /_/ /_/ / /_/ / /   ___/ / /__/ /  / /_/ / / /  
            |___/_/_/   \__/\__,_/\__,_/_/   /____/\___/_/   \____/_/_/

```
Virtual list that is able to render infinite ammount of DOm element using UITableView techniques and. This is already been done in a lot of ways but Here I am trying to use CSS translate to scroll the container which more performant than changing the top.
Paul Irish made a great benchmark here http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/

## Demo
You can check out a smaple page [here](https://khaledgarbaya.github.io/virtual-scroll/)

## Example Usage
### Getting the library
```
git clone https://github.com/Khaledgarbaya/virtual-scroll.git
```
```
cd virtual-scroll
```
```
npm install
```
### Code
```javascript
// BASIC INITIALIZATION

import VirtualScroll from 'VirtualScroll';


let listSource = [];
for (let i = 0; i < 3000; i++) listSource.push({ itemId: i });

let virtualScroll1 = new VirtualScroll({
  // DOMnode the list will be renderd inside
  root: document.getElementsByClassName('NAME_THE_CONTAINER_WHATEVER_YOU_LIKE')[0],
  itemHeight: 50,
  // ARRAY containg all the objects to be displayed inside the list
  source: listSource,

  /**
   * FUNCTION to be called while creating a single item
   *
   * @param  {object}  itemNodes       empty object provided by the list logic
   * @param  {DOMnode} itemContainer   item container provided by the list logic
   */
  createItemFn: (itemNodes, itemContainer) => {
    // EXAMPLE
    // itemNodes.text1 = document.createElement('span');
    // itemContainer.appendChild(itemNodes.text1);
  },

  /**
   * FUNCTION to be called while updating a single item
   *
   * @param  {object}  itemNodes       object previously filled by createItemFn()
   * @param  {DOMnode} itemContainer   item container provided by the list logic
   * @param  {object}  itemData        object inside listSource array at the current index
   */
  updateItemFn: (itemNodes, itemContainer, itemData) => {
    // EXAMPLE
    // update itemNodes.text1 with itemData.itemId
  }
});

```

