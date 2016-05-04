const SCROLLING_TIME_CONSTANT = 525;
export default class VerticalScroller {
  constructor(scrollContainer, scrollCallback) {
    this.scrollContainer = scrollContainer;
    this.scrollCallback = scrollCallback;

    // init variables
    this.timestamp = 0;
    this.minOffset = 0;
    this.maxOffset = Number.MAX_SAFE_INTEGER;
    this.frame = 0;
    this.velocity = 0;
    this.amplitude = 0;
    this.pressed = 0;
    this.reference = 0;
    this.offset = 0;
    this.target = 0;
    this.touchPositions = [];

    this._bindEvents();
  }
  _bindEvents (){
    // rebinding the event handler to this
    this.tap = this.tap.bind(this);
    this.drag = this.drag.bind(this);
    this.release = this.release.bind(this);

    if(this.scrollContainer){
      this.scrollContainer.addEventListener('touchstart', this.tap);
      this.scrollContainer.addEventListener('touchmove', this.drag);
      this.scrollContainer.addEventListener('touchend', this.release);
      this.scrollContainer.addEventListener('mousedown', this.tap);
      this.scrollContainer.addEventListener('mousemove', this.drag);
      this.scrollContainer.addEventListener('mouseup', this.release);
    }
  }
  destroy (){
    if(this.scrollContainer){
      this.scrollContainer.removeEventListener('touchstart', this.tap);
      this.scrollContainer.removeEventListener('touchmove', this.drag);
      this.scrollContainer.removeEventListener('touchend', this.release);
      this.scrollContainer.removeEventListener('mousedown', this.tap);
      this.scrollContainer.removeEventListener('mousemove', this.drag);
      this.scrollContainer.removeEventListener('mouseup', this.release);
    }
  }
  // check what type of event we received and get the right position out of it
  getYPosition (e){
    // touch event
    if (e.targetTouches && (e.targetTouches.length >= 1)) {
        return e.targetTouches[0].clientY;
    }
    // mouse event
    return e.clientY;
  }
  scroll (position){
    this.offset = position;
    this.scrollCallback(position);
  }
  autoScroll (){
    let elapsed, delta, newOffset;
    if(this.amplitude){
      elapsed = Date.now() - this.timestamp;
      delta = this.amplitude * Math.exp(-elapsed/SCROLLING_TIME_CONSTANT);
      newOffset = this.target - delta;
      if (newOffset < this.minOffset) {
        if (this.target - delta >= this.minOffset-2){
            this.scroll(this.minOffset);
            return;
        }
        this.bounce(true);
      } else if (newOffset > this.maxOffset) {
          if (this.target - delta <= this.maxOffset + 2){
              this.scroll(this.maxOffset);
              return;
          }
        this.bounce(false);
      } else if (delta > 2 || delta < -2) {
          this.scroll(this.target - delta);
          requestAnimationFrame(this.autoScroll.bind(this));
      } else {
          this.scroll(this.target);
          console.log('scroll ends');
      }
    }
  }
  bounce (top){
    const finalDestination = top ? this.minOffset : this.maxOffset,
        isBouncingBack = top && this.amplitude > 0 || !top && this.amplitude < 0;

    if(this.amplitude == 0){
      return;
    }
    const elapsed = Date.now() - this.timestamp;
    const delta = this.amplitude * Math.exp(-elapsed / (this.target == finalDestination ? 125 : SCROLLING_TIME_CONSTANT) );
    if ( isBouncingBack && Math.abs(delta) < 2 ) {
        this.scroll(top ? this.minOffset : this.maxOffset);
        console.log('scroll ends');
        return;
    }
    this.scroll(this.target - delta);

    if (isBouncingBack) {
      if (this.target != finalDestination) {
          this.target = finalDestination;
          this.amplitude = this.target - this.offset;
          this.timestamp = new Date();
      }

    } else {
        this.target = finalDestination - (finalDestination - this.target) * 0.1;
        this.amplitude = this.target - this.offset;
    }

    requestAnimationFrame(function(){
        this.bounce(top);
    }.bind(this));
  }
  tap (e){
    this.pressed = true;
    this.reference = this.getYPosition(e);

    this.velocity = this.amplitude = 0;
    this.frame = this.offset;
    this.timestamp = Date.now();
    this.recordTouches(e);
    e.preventDefault && e.preventDefault();
    e.preventDefault && e.stopPropagation();
  }
  drag (e){
    let y, delta, scaleFactor = this.offset < this.minOffset || this.offset > this.maxOffset ? 0.5 : 1;
    if (this.pressed) {
      this.recordTouches(e);
      y = this.getYPosition(e);
      delta = this.reference - y;
      if (delta > 2 || delta < -2) {
          this.reference = y;
          this.scroll(this.offset + delta * scaleFactor);
      }
    }
    e.preventDefault && e.preventDefault();
    e.preventDefault && e.stopPropagation();
  }
  recordTouches (e){
    let touches = e.touches || [{pageX: e.pageX, pageY: e.pageY}],
        timestamp = e.timeStamp,
        currentTouchTop = touches[0].pageY;

    if (touches.length === 2) {
        currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    }

    this.touchPositions.push({offset: currentTouchTop, timestamp: timestamp});
    if (this.touchPositions.length > 60) {
        this.touchPositions.splice(0, 30);
    }
  }
  release (e){
    this.pressed = false;
    const endPos = this.touchPositions.length - 1;
    let startPos = endPos - 1;
    // Move pointer to position measured 100ms ago
    for (var i = endPos - 1; i > 0 && this.touchPositions[i].timestamp > (this.touchPositions[endPos].timestamp - 100); i -= 1) {
      startPos = i;
    }
    const elapsed = this.touchPositions[endPos].timestamp - this.touchPositions[startPos].timestamp;
    const delta = this.touchPositions[endPos].offset - this.touchPositions[startPos].offset;
    const v = -1000 * delta / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;

    this.amplitude = 1.0 * this.velocity;
    this.target = Math.round(this.offset + this.amplitude);
    this.timestamp = Date.now();
    requestAnimationFrame(this.autoScroll.bind(this));

    e.preventDefault && e.preventDefault();
    e.preventDefault && e.stopPropagation();
  }
  scrollTo(y, animate){
    var maxAnimateDelta = 4000;
    if (animate) {
        if (y - this.offset > maxAnimateDelta) {
            this.offset = y - maxAnimateDelta;
        } else if (this.offset - y > maxAnimateDelta) {
            this.offset = y + maxAnimateDelta;
        }

        this.amplitude = y - this.offset;
        this.target = y;
        this.timestamp = Date.now();
        requestAnimationFrame(this.autoScroll);
    } else {
        this.amplitude = 0;
        this.scroll(y);
    }
  }
  changeScrollPosition (y) {
    this.scroll(y);
  }
  setDimensions(min, max){
    this.minOffset = min;
    this.maxOffset = max;
  }

}
