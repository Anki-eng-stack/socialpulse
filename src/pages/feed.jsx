import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useLocation } from "react-router-dom";
import Post from "../components/Post";

const Feed = () => {
  const currentUser = useContext(AuthContext);
  const location = useLocation();
  const userId = parseInt(location.pathname.split("/")[2]) || undefined;

  const { isLoading, error, data: posts } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () =>
      makeRequest
        .get(userId ? `/posts?userId=${userId}` : "/posts")
        .then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading posts. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {userId ? "Profile Posts" : "Latest Posts"}
      </h2>
      
      {posts && posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>No posts available. Follow some friends or create a new post!</span>
        </div>
      )}
    </div>
  );
};

export default Feed;