/**
 * @license
 * Copyright (C) 2016 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../../../test/common-test-setup-karma.js';
import './gr-dropdown.js';
import {dom} from '@polymer/polymer/lib/legacy/polymer.dom.js';

const basicFixture = fixtureFromElement('gr-dropdown');

suite('gr-dropdown tests', () => {
  let element;

  setup(() => {
    stub('gr-rest-api-interface', {
      getConfig() { return Promise.resolve({}); },
    });
    element = basicFixture.instantiate();
  });

  test('_computeIsDownload', () => {
    assert.isTrue(element._computeIsDownload({download: true}));
    assert.isFalse(element._computeIsDownload({download: false}));
  });

  test('tap on trigger opens menu, then closes', () => {
    sinon.stub(element, '_open')
        .callsFake(() => { element.$.dropdown.open(); });
    sinon.stub(element, '_close')
        .callsFake(() => { element.$.dropdown.close(); });
    assert.isFalse(element.$.dropdown.opened);
    MockInteractions.tap(element.$.trigger);
    assert.isTrue(element.$.dropdown.opened);
    MockInteractions.tap(element.$.trigger);
    assert.isFalse(element.$.dropdown.opened);
  });

  test('_computeURLHelper', () => {
    const path = '/test';
    const host = 'http://www.testsite.com';
    const computedPath = element._computeURLHelper(host, path);
    assert.equal(computedPath, '//http://www.testsite.com/test');
  });

  test('link URLs', () => {
    assert.equal(
        element._computeLinkURL({url: 'http://example.com/test'}),
        'http://example.com/test');
    assert.equal(
        element._computeLinkURL({url: 'https://example.com/test'}),
        'https://example.com/test');
    assert.equal(
        element._computeLinkURL({url: '/test'}),
        '//' + window.location.host + '/test');
    assert.equal(
        element._computeLinkURL({url: '/test', target: '_blank'}),
        '/test');
  });

  test('link rel', () => {
    let link = {url: '/test'};
    assert.isNull(element._computeLinkRel(link));

    link = {url: '/test', target: '_blank'};
    assert.equal(element._computeLinkRel(link), 'noopener');

    link = {url: '/test', external: true};
    assert.equal(element._computeLinkRel(link), 'external');

    link = {url: '/test', target: '_blank', external: true};
    assert.equal(element._computeLinkRel(link), 'noopener');
  });

  test('_getClassIfBold', () => {
    let bold = true;
    assert.equal(element._getClassIfBold(bold), 'bold-text');

    bold = false;
    assert.equal(element._getClassIfBold(bold), '');
  });

  test('Top text exists and is bolded correctly', () => {
    element.topContent = [{text: 'User', bold: true}, {text: 'email'}];
    flush();
    const topItems = element.root.querySelectorAll('.top-item');
    assert.equal(topItems.length, 2);
    assert.isTrue(topItems[0].classList.contains('bold-text'));
    assert.isFalse(topItems[1].classList.contains('bold-text'));
  });

  test('non link items', () => {
    const item0 = {name: 'item one', id: 'foo'};
    element.items = [item0, {name: 'item two', id: 'bar'}];
    const fooTapped = sinon.stub();
    const tapped = sinon.stub();
    element.addEventListener('tap-item-foo', fooTapped);
    element.addEventListener('tap-item', tapped);
    flush();
    MockInteractions.tap(element.shadowRoot
        .querySelector('.itemAction'));
    assert.isTrue(fooTapped.called);
    assert.isTrue(tapped.called);
    assert.deepEqual(tapped.lastCall.args[0].detail, item0);
  });

  test('disabled non link item', () => {
    element.items = [{name: 'item one', id: 'foo'}];
    element.disabledIds = ['foo'];

    const stub = sinon.stub();
    const tapped = sinon.stub();
    element.addEventListener('tap-item-foo', stub);
    element.addEventListener('tap-item', tapped);
    flush();
    MockInteractions.tap(element.shadowRoot
        .querySelector('.itemAction'));
    assert.isFalse(stub.called);
    assert.isFalse(tapped.called);
  });

  test('properly sets tooltips', () => {
    element.items = [
      {name: 'item one', id: 'foo', tooltip: 'hello'},
      {name: 'item two', id: 'bar'},
    ];
    element.disabledIds = [];
    flush();
    const tooltipContents = dom(element.root)
        .querySelectorAll('iron-dropdown li gr-tooltip-content');
    assert.equal(tooltipContents.length, 2);
    assert.isTrue(tooltipContents[0].hasTooltip);
    assert.equal(tooltipContents[0].getAttribute('title'), 'hello');
    assert.isFalse(tooltipContents[1].hasTooltip);
  });

  suite('keyboard navigation', () => {
    setup(() => {
      element.items = [
        {name: 'item one', id: 'foo'},
        {name: 'item two', id: 'bar'},
      ];
      flush();
    });

    test('down', () => {
      const stub = sinon.stub(element.$.cursor, 'next');
      assert.isFalse(element.$.dropdown.opened);
      MockInteractions.pressAndReleaseKeyOn(element, 40);
      assert.isTrue(element.$.dropdown.opened);
      MockInteractions.pressAndReleaseKeyOn(element, 40);
      assert.isTrue(stub.called);
    });

    test('up', () => {
      const stub = sinon.stub(element.$.cursor, 'previous');
      assert.isFalse(element.$.dropdown.opened);
      MockInteractions.pressAndReleaseKeyOn(element, 38);
      assert.isTrue(element.$.dropdown.opened);
      MockInteractions.pressAndReleaseKeyOn(element, 38);
      assert.isTrue(stub.called);
    });

    test('enter/space', () => {
      // Because enter and space are handled by the same fn, we need only to
      // test one.
      assert.isFalse(element.$.dropdown.opened);
      MockInteractions.pressAndReleaseKeyOn(element, 32); // Space
      assert.isTrue(element.$.dropdown.opened);

      const el = element.$.cursor.target.querySelector(':not([hidden]) a');
      const stub = sinon.stub(el, 'click');
      MockInteractions.pressAndReleaseKeyOn(element, 32); // Space
      assert.isTrue(stub.called);
    });
  });
});

