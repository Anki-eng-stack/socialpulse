// src/components/FriendProf.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import Relationship from "../components/relationship";  // ← pull in your Relationship component

const FriendProf = () => {
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  // Refetch friends in the background whenever a follow/unfollow happens
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.query?.queryKey?.[0] === "friends" &&
        event.type === "queryUpdated"
      ) {
        // refetch search results if needed
        setResults((r) => [...r]);
      }
    });
    return () => unsubscribe();
  }, [queryClient]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await makeRequest.get(
        `/search?term=${encodeURIComponent(searchTerm)}`
      );
      if (Array.isArray(data) && data.length) {
        setResults(data);
      } else {
        setResults([]);
        setError("No users found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Search failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Friends</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error   && <p className="text-red-500">{error}</p>}

      {results.length > 0 ? (
        <ul className="space-y-2">
          {results.map((user) => (
            <li
              key={user.id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  View Profile
                </button>
                {/* ← Use your Relationship button here */}
                <Relationship userId={user.id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No users found.</p>
      )}
    </div>
  );
};

export default FriendProf;
