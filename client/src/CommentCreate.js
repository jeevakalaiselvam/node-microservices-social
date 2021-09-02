import React, { useState } from "react";

export default function CommentCreate({ postId }) {
  const [content, setContent] = useState("");

  return (
    <div>
      <form>
        <div className='form-group'>
          <label htmlFor=''>New Comment</label>
          <input
            type='text'
            className='form-control'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
}
