import {EventEmitter} from 'events';
class ScrollStore extends EventEmitter {
  constructor() {
    super();// this is not allowed before super
    this.data = {type: 'SCROLL_BEGIN', direction: 0};
    this.setMaxListeners(10);
  }
  get (key) {
    return this.data[key];
  }

  set (key, value) {
    return (this.data[key] = value);
  }

  emitChange(type){
    this.emit(type, this.data);
  }

}
export default new ScrollStore();
