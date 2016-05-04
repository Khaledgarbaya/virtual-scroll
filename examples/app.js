import VirtualScroll from '../src/VirtualScroll';

let listSource = [];
for (let i = 0; i < 3000; i++) listSource.push({ itemId: i });


let virtualScroll1 = new VirtualScroll({
  // DOMnode the list will be renderd inside
  root: document.getElementsByClassName('list')[0],

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
    itemNodes.text1 = document.createElement('span');
    itemNodes.text1.innerHTML = "ITEM Number "+itemNodes.itemId
    itemNodes.text1.style.height = '50px';
    itemNodes.text1.style.borderTop = '1px solid black';
    itemNodes.text1.style.borderBottom = '1px solid black';
    itemNodes.text1.style.width = '100%';
    itemContainer.appendChild(itemNodes.text1);
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
window.list = virtualScroll1;
