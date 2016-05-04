import {expect} from 'chai';
import VirtualScroller from '../src/VerticalScroller.js';
describe('VirtualScroller', () => {
    const virtualScroller = new VirtualScroller({},()=>{});
    it('should have a property called scrollContainer', ()=>{
      expect(virtualScroller).to.have.property('scrollContainer');
    });
    it('should have a property called scrollCallback', ()=>{
      expect(virtualScroller).to.have.property('scrollCallback');
    });
});
