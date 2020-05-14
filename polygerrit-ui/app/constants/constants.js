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

/**
 * @enum
 * @desc Tab names for primary tabs on change view page.
 */
export const PrimaryTab = {
  FILES: '_files',
  COMMENT_THREADS: '_commentThreads',
  FINDINGS: '_findings',
};

/**
 * @enum
 * @desc Tab names for secondary tabs on change view page.
 */
export const SecondaryTab = {
  CHANGE_LOG: '_changeLog',
};

/**
 * @enum
 * @desc Tag names of change log messages.
 */
export const MessageTag = {
  TAG_DELETE_REVIEWER: 'autogenerated:gerrit:deleteReviewer',
  TAG_NEW_PATCHSET: 'autogenerated:gerrit:newPatchSet',
  TAG_NEW_WIP_PATCHSET: 'autogenerated:gerrit:newWipPatchSet',
  TAG_REVIEWER_UPDATE: 'autogenerated:gerrit:reviewerUpdate',
};

/**
 * @enum
 * @desc Modes for gr-diff-cursor
 * The scroll behavior for the cursor. Values are 'never' and
 * 'keep-visible'. 'keep-visible' will only scroll if the cursor is beyond
 * the viewport.
 */
export const ScrollMode = {
  KEEP_VISIBLE: 'keep-visible',
  NEVER: 'never',
};

/**
 * @enum
 * @desc Specifies status for a change
 */
export const ChangeStatus = {
  ABANDONED: 'ABANDONED',
  MERGED: 'MERGED',
  NEW: 'NEW',
};
