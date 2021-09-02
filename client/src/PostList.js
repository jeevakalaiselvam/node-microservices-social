import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PostList() {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        key={post.id}
        className='card'
        style={{ width: "30%", marginBottom: "20px" }}
      >
        <div className='card-body'>
          <h3>{post.title}</h3>
        </div>
      </div>
    );
  });

  return <div>{renderedPosts}</div>;
}
