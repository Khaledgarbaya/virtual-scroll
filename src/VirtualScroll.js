export default class VirtualScroll {
  /**
   * constructor - VirtualScroll
   *
   * @param  {object} config
   * {
   *  // DOMnode the list will be renderd inside
   *  root: document.getElementsByClassName('NAME_THE_CONTAINER_WHATEVER_YOU_LIKE')[0],
   *  // ARRAY containg all the objects to be displayed inside the list
   *  source: listSource,
   *  //FUNCTION to be called while creating a single item
   *    itemNodes empty object provided by the list logic
   *    itemContainer   item container provided by the list logic
   *  createItemFn: (itemNodes, itemContainer) =>{},
   *
   * //FUNCTION to be called while updating a single item
   *   //itemNodes       object previously filled by createItemFn()
   *  //itemContainer   item container provided by the list logic
   *  //itemData        object inside listSource array at the current index
   * updateItemFn: (itemNodes, itemContainer, itemData) => {},
   * }
   */
  constructor (config) {
    this.config = {};
    this.info= {scrollTop:0, direction:1, height:1, isScrolling:false};
    this.config.root = (config && config.root) ? config.root : null;
    this.config.source = (config && config.root) ? config.source : [];
    this.config.createItemFn = (config && config.root) ? config.createItemFn : null;
    this.config.updateItemFn = (config && config.root) ? config.updateItemFn : null;
  }
  /*Public API*/
  // TODO add documentation plz!
  refresh (){

  }
  setSource (listSource){

  }
  destroy (){

  }
  remove (){

  }
  addEventListener (event, callback){

  }
  removeEventListener (event, callback){

  }
  scrollTop (duration){

  }
  scrollBottom (duration){

  }
  scrollTo (position, duration){

  }
}
