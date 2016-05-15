import {expect} from 'chai';
import VirtualScroll from '../src/VirtualScroll.js';
/*
  Mama always says three things:
  - Finish your plate
  - Drink your milk
  - Test your code.
*/
describe('VirtualScroll', () => {
  let listSource = [];
  for (let i = 0; i < 3000; i++) listSource.push({ itemId: i });
  let root = document.createElement('div');
  root.style.width  = "400px";
  root.style.height = "700px";
  root.offsetHeight = 700;
  root.offsewidth = 400;

  const vScroll = new VirtualScroll({
    itemHeight: 50,
    root: root,
    // ARRAY containg all the objects to be displayed inside the list
    source: listSource
  });
  describe('initial state', ()=>{
    it('vScroll is instannce of VirtualScroll', ()=>{
      expect(vScroll).to.be.an.instanceof(VirtualScroll);
    });
    it('should have a property config', ()=>{
      expect(vScroll).to.have.property('config');
    });
  });
  describe('VirtualScroll::config', ()=>{
    it('should have root, source, createItemFn and updateItemFn', ()=>{
      expect(vScroll.config).to.have.property('root');
      expect(vScroll.config).to.have.property('source');
      expect(vScroll.config).to.have.property('createItemFn');
      expect(vScroll.config).to.have.property('updateItemFn');
    });
  });
  describe('VirtualScroll required API methods',()=>{
    it('should have refresh function', ()=>{
      expect(vScroll).to.have.property('refresh').that.is.a('function');
    });
    it('should have setSource function', ()=>{
      expect(vScroll).to.have.property('setSource').that.is.a('function');
    });
    it('should have destroy function', ()=>{
      expect(vScroll).to.have.property('destroy').that.is.a('function');
    });
    it('should have remove function', ()=>{
      expect(vScroll).to.have.property('remove').that.is.a('function');
    });
    /*Optional API*/
    it('should have addEventListener function', ()=>{
      expect(vScroll).to.have.property('addEventListener').that.is.a('function');
    });
    it('should have removeEventListener function', ()=>{
      expect(vScroll).to.have.property('removeEventListener').that.is.a('function');
    });
    it('should have scrollTop function', ()=>{
      expect(vScroll).to.have.property('scrollTop').that.is.a('function');
    });
    it('should have scrollBottom function', ()=>{
      expect(vScroll).to.have.property('scrollBottom').that.is.a('function');
    });
    it('should have scrollTo function', ()=>{
      expect(vScroll).to.have.property('scrollTo').that.is.a('function');
    });
  });

  describe('VirtualScroll required API properties',()=>{
    it('should have info property', ()=>{
      expect(vScroll).to.have.property('info').that.is.a('object');
    });
    describe('VirtualScroll::info property', ()=>{
      it('should have a numeric property called scrollTop',()=>{
        expect(vScroll.info).to.have.property('scrollTop').that.is.a('number');
      });
      it('should have a numeric property called direction',()=>{
        expect(vScroll.info).to.have.property('direction').that.is.a('number');
      });
      it('should have a numeric property called height',()=>{
        expect(vScroll.info).to.have.property('height').that.is.a('number');
      });
      it('should have a boolean property called isScrolling',()=>{
        expect(vScroll.info).to.have.property('isScrolling').that.is.a('boolean');
      });
    });
  });
  describe('VirtualScroll Scrolling',()=>{
    it('should scroll to the top correctly', ()=>{
      vScroll.scrollTop();
      expect(vScroll.info.scrollTop).to.equal(0);
    });
    it('should have direction set to -1 when scrolling up', ()=>{
      expect(vScroll.info.direction).to.equal(-1);
    });


    it('should scroll to specific position correctly', ()=>{
      vScroll.scrollTo(200);
      expect(vScroll.info.scrollTop).to.equal(-200);
    });

    it('should scroll to the bottom correctly', ()=>{
      vScroll.scrollBottom();
      expect(vScroll.info.scrollTop).to.equal(-149350);
    });

    it('should have direction set to 1 when scrolling down', ()=>{
      vScroll.scrollBottom();
      expect(vScroll.info.direction).to.equal(1);
    });

  });
});
