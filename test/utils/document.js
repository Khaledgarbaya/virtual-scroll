import {mocks} from 'mock-browser';
let {MockBrowser} = mocks;
let mock = new MockBrowser();

if (typeof document === 'undefined') {
  global.document = mock.getDocument();
}
