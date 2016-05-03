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

    this.totalRows = this.config.source.length;
    // TODO try to get dynamic itemHeight
    this.itemHeight = 50;
    this.visibleItemsCount = Math.ceil(config.root.offsetHeight / this.itemHeight);
    this.cachedItemsLen = this.visibleItemsCount * 3;
    // setup the container
    this._setupContainer();
    this._renderChunk(this.config.root, 0)
    const scroller = this._createScroller(this.totalRows*this.itemHeight);
    this.config.root.appendChild(scroller);
    this.lastRepaintY = 0;
    this.maxBuffer = this.visibleItemsCount * this.itemHeight;
    this.lastScrolled = 0;

    this.rmNodeInterval = setInterval(this.remoDirtyNodes.bind(this), 300);

    this._bindEvents();
    this.onScroll = this.onScroll.bind(this);
  }
  remoDirtyNodes(){
    console.log(this.lastScrolled);
    if (Date.now() - this.lastScrolled > 100) {
      let badNodes = document.querySelectorAll('[data-rm="1"]');
      for (let i = 0, l = badNodes.length; i < l; i++) {
        this.config.root.removeChild(badNodes[i]);
      }
    }
  }
  _bindEvents (){
    this.config.root.addEventListener('scroll', this.onScroll.bind(this));
  }
  onScroll (e){
    let scrollTop = e.target.scrollTop; // Triggers reflow
    if (!this.lastRepaintY || Math.abs(scrollTop - this.lastRepaintY) > this.maxBuffer) {
      let first = parseInt(scrollTop / this.itemHeight) - this.visibleItemsCount;
      console.log(first);
      this._renderChunk(this.config.root, first < 0 ? 0 : first);
      this.lastRepaintY = scrollTop;
    }
    this.lastScrolled = Date.now();
    e.preventDefault && e.preventDefault();
  }
  _setupContainer (){
    this.config.root.style.overflow = 'auto';
    this.config.root.style.position = 'relative';
    this.config.root.style.padding = 0;
    this.config.root.style.border = '1px solid black';
  }
  _createScroller (h){
    const scroller = document.createElement('div');
    scroller.style.opacity = 0;
    scroller.style.position = 'absolute';
    scroller.style.top = 0;
    scroller.style.left = 0;
    scroller.style.width = '1px';
    scroller.style.height = h + 'px';
    return scroller;
  }
  _renderChunk (node, from) {
    var finalItem = from + this.cachedItemsLen;
    if (finalItem > this.totalRows)
      finalItem = this.totalRows;

    // Append all the new rows in a document fragment that we will later append to
    // the parent node
    let fragment = document.createDocumentFragment();
    for (var i = from; i < finalItem; i++) {
      this.createRow(i, fragment);
    }

    // Hide and mark obsolete nodes for deletion.
    for (var j = 1, l = node.childNodes.length; j < l; j++) {
      node.childNodes[j].style.display = 'none';
      node.childNodes[j].setAttribute('data-rm', '1');
    }
    node.appendChild(fragment);
  }
  createRow (index, container) {
    let item = this.config.source[index];
    if (this.config.createItemFn){
      this.config.createItemFn(item, container);
      let nodeItem = container.lastChild;
      nodeItem.classList.add('vrow');
      nodeItem.style.position = 'absolute';
      nodeItem.style.top = (index * this.itemHeight) + 'px';
    }
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
