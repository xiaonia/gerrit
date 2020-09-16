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

package com.google.gerrit.server.change;

import com.google.auto.value.AutoValue;
import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Iterables;
import com.google.gerrit.entities.Comment;
import java.util.List;

/**
 * Representation of a comment thread.
 *
 * <p>A comment thread consists of at least one comment.
 *
 * @param <T> type of comments in the thread. Can also be {@link Comment} if the thread mixes
 *     comments of different types.
 */
@AutoValue
public abstract class CommentThread<T extends Comment> {

  /** Comments in the thread in exactly the order they appear in the thread. */
  public abstract ImmutableList<T> comments();

  /** Whether the whole thread is considered as unresolved. */
  public boolean unresolved() {
    return Iterables.getLast(comments()).unresolved;
  }

  public static <T extends Comment> Builder<T> builder() {
    return new AutoValue_CommentThread.Builder<>();
  }

  @AutoValue.Builder
  public abstract static class Builder<T extends Comment> {

    public abstract Builder<T> comments(List<T> value);

    public Builder<T> addComment(T comment) {
      commentsBuilder().add(comment);
      return this;
    }

    abstract ImmutableList.Builder<T> commentsBuilder();

    abstract ImmutableList<T> comments();

    abstract CommentThread<T> autoBuild();

    public CommentThread<T> build() {
      Preconditions.checkState(
          !comments().isEmpty(), "A comment thread must contain at least one comment.");
      return autoBuild();
    }
  }
}
