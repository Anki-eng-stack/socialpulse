import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`http://localhost:5173/api/users/${userId}`),
          axios.get(`http://localhost:5173/api/posts?userId=${userId}`),
        ]);
        setUser(userRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError("User not found or error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{user?.name}'s Profile</h2>

      <div className="border p-4 rounded-lg mb-8">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Username:</strong> @{user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
