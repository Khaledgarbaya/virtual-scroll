import VirtualScroller from './VerticalScroller.js'
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
    this.config.root = (config && config.root) ? config.root : document.createElement('div');
    this.config.source = (config && config.root) ? config.source : [];
    this.config.createItemFn = (config && config.root) ? config.createItemFn : null;
    this.config.updateItemFn = (config && config.root) ? config.updateItemFn : null;
    this.rootElement = null;
    // setup the container

    this.config.scroller = (config && config.scroller) ? config.scroller :
                            new VirtualScroller(this.config.root, this._scroll.bind(this));

    // TODO try to get dynamic itemHeight
    this.totalRows = this.config.source.length;
    this.itemHeight = 50;
    this.visibleItemsCount = Math.ceil(this.config.root.offsetHeight / this.itemHeight);
    this.cachedItemsLen = this.visibleItemsCount * 3;
    this._setupContainer();
    this._renderChunk(this.rootElement, 0)
    this.scrollerElement = this._createScroller(this.totalRows*this.itemHeight);
    this.info.height = this.totalRows*this.itemHeight;// estimated for now
    this.config.scroller.setDimensions(0,this.info.height);
    this.rootElement.appendChild(this.scrollerElement);
    this.lastRepaintY = 0;
    this.maxBuffer = this.visibleItemsCount * this.itemHeight;
    this.lastScrolled = 0;
    this.rmNodeInterval = setInterval(this.remoDirtyNodes.bind(this), 300);
    this._bindEvents();
  }
  remoDirtyNodes(){
    if (Date.now() - this.lastScrolled > 100) {
      let badNodes = this.rootElement.querySelectorAll('[data-rm="1"]');
      for (let i = 0, l = badNodes.length; i < l; i++) {
        this.rootElement.removeChild(badNodes[i]);
      }
    }
  }
  _bindEvents (){
    this.config.scroller.addEventListener('scroll-start', this.onScrollBegin.bind(this));
    this.config.scroller.addEventListener('scroll-end', this.onScrollEnd.bind(this));
  }
  onScrollBegin(data){
    this.info.isScrolling = true;
    this.info.direction = data.direction;
  }
  onScrollEnd(data){
    this.info.isScrolling = false;
  }
  _setupContainer (){
    this.rootElement = document.createElement('div');
    this.rootElement.style.width = this.config.root.clientWidth+'px';
    this.rootElement.style.height = this.config.root.clientHeight+'px';
    //this.rootElement.style.overflow = 'hidden';

    this.config.root.style.overflow = 'hidden';
    this.config.root.style.position = 'relative';
    this.config.root.style.padding = 0;
    this.config.root.style.border = '1px solid black';

    this.config.root.appendChild(this.rootElement);
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
    let finalItem = from + this.cachedItemsLen;
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
      if(this.scrollerElement != node.childNodes[j]){
        node.childNodes[j].style.display = 'none';
        node.childNodes[j].setAttribute('data-rm', '1');
      }
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
  _scroll(position){
    //Update top of the root element
    // translation is faster than chaning top
    // for more info: http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
    this.info.scrollTop = -position;
    let t = 'translateY(' + (-position) + 'px) translateZ(0)';
    let s = this.rootElement.style;
    s["transform"] = t;
    s["webkitTransform"] = t;
    s["mozTransform"] = t;
    s["msTransform"] = t;

    if (!this.lastRepaintY || Math.abs(position - this.lastRepaintY) > this.maxBuffer) {
      let first = parseInt(position / this.itemHeight) - this.visibleItemsCount;
      this._renderChunk(this.rootElement, first < 0 ? 0 : first);
      this.lastRepaintY = position;
    }
    this.lastScrolled = Date.now();
  }
  /*Public API*/

  refresh (){
    this._setupContainer();
    this._renderChunk(this.rootElement, 0);
  }
  setSource (listSource){
    this.config.source = listSource;
    this.refresh();
  }
  destroy (){
    this.config.scroller.destroy();
  }
  remove (){
    this.destroy();
    this.config.root.removeChild(this.rootElement);
  }
  addEventListener (event, callback){
    this.config.scroller.addEventListener(event, callback);
  }
  removeEventListener (event, callback){
    this.config.scroller.removeEventListener(event, callback);
  }
  scrollTop (duration){
    // TODO addAnimation
  }
  scrollBottom (duration){
    this._scroll(this.totalRows*this.itemHeight);
  }
  scrollTo (position, duration){
    // TODO add Animation with duration
    this._scroll(position);
  }
}
