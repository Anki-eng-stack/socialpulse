// src/components/Relationship.jsx
import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../context/AuthContext";

const Relationship = ({ userId }) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  if (!userId) return null;

  // 🔍 Fetch followers of this user
  const {
    data: followers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["relationship", userId],
    enabled: !!userId,
    queryFn: async () => {
      try {
        const res = await makeRequest.get("/relationships", {
          params: { followedUserId: userId }, // ✅ query param matches backend
        });
        console.log(`✅ Fetched followers of user ${userId}:`, res.data);
        return res.data;
      } catch (err) {
        console.error(`❌ Failed to fetch relationship for user ${userId}:`, err.response || err.message);
        throw err;
      }
    },
  });

  const isFollowing = followers.includes(currentUser.id);

  // ➕➖ Mutation to follow/unfollow
  const mutation = useMutation({
    mutationFn: (shouldUnfollow) => {
      if (shouldUnfollow) {
        return makeRequest.delete("/relationships", {
          params: { userId }, // backend expects userId in query for DELETE
        });
      } else {
        return makeRequest.post("/relationships", { userId }); // backend gets it from body
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship", userId]);
      queryClient.invalidateQueries(["friends"]);
    },
    onError: (err) => {
      console.error("❌ Follow/Unfollow failed:", err.response || err.message);
    },
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p className="text-red-500">Couldn’t load follow status.</p>;

  return (
    <button
      onClick={() => mutation.mutate(isFollowing)}
      className={`btn ${isFollowing ? "btn-error" : "btn-primary"} gap-2`}
      disabled={mutation.isLoading}
    >
      <FontAwesomeIcon icon={isFollowing ? faUserMinus : faUserPlus} />
      {mutation.isLoading
        ? "…"
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </button>
  );
};

export default Relationship;
