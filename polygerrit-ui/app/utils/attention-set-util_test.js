/**
 * @license
 * Copyright (C) 2020 The Android Open Source Project
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

import '../test/common-test-setup-karma.js';
import {
  hasAttention, getReason,
} from './attention-set-util.js';

const KERMIT = {
  email: 'kermit@gmail.com',
  username: 'kermit',
  name: 'Kermit The Frog',
  _account_id: '31415926535',
};

suite('attention-set-util', () => {
  test('hasAttention', () => {
    const config = {
      change: {enable_attention_set: true},
    };
    const change = {
      attention_set: {
        31415926535: {
          reason: 'a good reason',
        },
      },
    };

    assert.isTrue(hasAttention(config, KERMIT, change));
  });

  test('getReason', () => {
    const change = {
      attention_set: {
        31415926535: {
          reason: 'a good reason',
        },
      },
    };

    assert.equal(getReason(KERMIT, change), 'a good reason');
  });
});
