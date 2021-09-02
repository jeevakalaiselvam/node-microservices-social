import React from "react";

export default function CommentList({ comments }) {
  const renderedComments = comments.map((comment) => {
    const { id, content, status } = comment;
    let contentAfterModeration;
    if (status === "approved") {
      contentAfterModeration = content;
    }
    if (status === "pending") {
      contentAfterModeration = "This comment is awaiting moderation";
    }
    if (status === "rejected") {
      contentAfterModeration = "This comment has been rejected";
    }

    return <li key={id}>{contentAfterModeration}</li>;
  });

  return <ul>{renderedComments}</ul>;
}
