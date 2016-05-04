Virtual Scroll
=========================
```
_    ___      __              __   _____                 ____
| |  / (_)____/ /___  ______ _/ /  / ___/______________  / / /
| | / / / ___/ __/ / / / __ `/ /   \__ \/ ___/ ___/ __ \/ / /
| |/ / / /  / /_/ /_/ / /_/ / /   ___/ / /__/ /  / /_/ / / /  
|___/_/_/   \__/\__,_/\__,_/_/   /____/\___/_/   \____/_/_/

```

## Example Usage
```javascript
// BASIC INITIALIZATION

import VirtualScroll from 'VirtualScroll';


let listSource = [];
for (let i = 0; i < 3000; i++) listSource.push({ itemId: i });

let virtualScroll1 = new VirtualScroll({
  // DOMnode the list will be renderd inside
  root: document.getElementsByClassName('NAME_THE_CONTAINER_WHATEVER_YOU_LIKE')[0],

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
