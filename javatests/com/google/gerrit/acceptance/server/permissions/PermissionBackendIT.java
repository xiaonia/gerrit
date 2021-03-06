// Copyright (C) 2020 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.gerrit.acceptance.server.permissions;

import static com.google.common.truth.Truth.assertThat;

import com.google.common.collect.Iterables;
import com.google.gerrit.acceptance.AbstractDaemonTest;
import com.google.gerrit.entities.Change;
import com.google.gerrit.server.notedb.ChangeNotes;
import com.google.gerrit.server.permissions.ChangePermission;
import com.google.gerrit.server.permissions.PermissionBackend;
import com.google.gerrit.server.query.change.ChangeData;
import com.google.inject.Inject;
import org.junit.Test;

/** Asserts behavior on {@link PermissionBackend} using a fully-started Gerrit. */
public class PermissionBackendIT extends AbstractDaemonTest {
  @Inject PermissionBackend pb;
  @Inject ChangeNotes.Factory changeNotesFactory;

  @Test
  public void changeDataFromIndex_canCheckReviewerState() throws Exception {
    Change.Id changeId = createChange().getChange().getId();
    gApi.changes().id(changeId.get()).setPrivate(true);
    gApi.changes().id(changeId.get()).addReviewer(user.email());

    ChangeData changeData =
        Iterables.getOnlyElement(queryProvider.get().byLegacyChangeId(changeId));
    boolean reviewerCanSee =
        pb.absentUser(user.id()).change(changeData).test(ChangePermission.READ);
    assertThat(reviewerCanSee).isTrue();
  }

  @Test
  public void changeDataFromNoteDb_canCheckReviewerState() throws Exception {
    Change.Id changeId = createChange().getChange().getId();
    gApi.changes().id(changeId.get()).setPrivate(true);
    gApi.changes().id(changeId.get()).addReviewer(user.email());

    ChangeNotes notes = changeNotesFactory.create(project, changeId);
    ChangeData changeData = changeDataFactory.create(notes);
    boolean reviewerCanSee =
        pb.absentUser(user.id()).change(changeData).test(ChangePermission.READ);
    assertThat(reviewerCanSee).isTrue();
  }

  @Test
  public void changeNotes_canCheckReviewerState() throws Exception {
    Change.Id changeId = createChange().getChange().getId();
    gApi.changes().id(changeId.get()).setPrivate(true);
    gApi.changes().id(changeId.get()).addReviewer(user.email());

    ChangeNotes notes = changeNotesFactory.create(project, changeId);
    boolean reviewerCanSee = pb.absentUser(user.id()).change(notes).test(ChangePermission.READ);
    assertThat(reviewerCanSee).isTrue();
  }
}
