import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { Link } from "react-router-dom";

const Friend = () => {
  const { currentUser } = useContext(AuthContext);

  const { data: friends, isLoading: friendsLoading, error: friendsError } = useQuery({
    queryKey: ["friends"],
    queryFn: () =>
      makeRequest
        .get(`/users/friends/${currentUser.id}`)
        .then((res) => res.data),
  });

  const { data: suggestions, isLoading: suggestionsLoading, error: suggestionsError } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () =>
      makeRequest
        .get(`/users/suggestions/${currentUser.id}`)
        .then((res) => res.data),
  });

  if (friendsLoading || suggestionsLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (friendsError || suggestionsError) {
    return <div className="text-red-500 text-center">Error loading data</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Friends List</h1>
      {friends && friends.length > 0 ? (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{friend.username}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/profile/${friend.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  View Profile
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No friends found.</p>
      )}

      <h1 className="text-2xl font-bold mt-8 mb-4">Suggested Friends</h1>
      {suggestions && suggestions.length > 0 ? (
        <ul className="space-y-2">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{suggestion.username}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/profile/${suggestion.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  View Profile
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No suggestions available.</p>
      )}
    </div>
  );
};

export default Friend;
