import Relationship from "./relationship";

const Rightbar = () => {
  // Static list of suggested user IDs for demo (can be dynamic later)
  const suggestedUsers = [
    { id: 2, username: "john_doe" },
    { id: 3, username: "jane_smith" },
    { id: 4, username: "alex99" },
    { id: 5, username: "maria_dev" },
  ];

  return (
    <div id="responsive" className="sticky top-0 z-30">
      {/* Suggestions Header */}
      <div className="p-4">
        <h3 className="text-md font-semibold mb-4 text-center">Suggested for You</h3>

        {/* List of Suggested Users */}
        <div className="flex flex-col gap-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex justify-between items-center bg-base-200 p-2 rounded-lg shadow-sm">
              <div className="text-sm font-medium">@{user.username}</div>
              <Relationship userId={user.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
