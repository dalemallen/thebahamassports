
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const roles = ["athlete", "coach", "organizer", "federation", "parent", "sponsor", "scout", "admin"];

export default function Home() {
  const { loginWithRedirect } = useAuth0();
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div>
      <h1>Select Your Role</h1>
      {roles.map((role) => (
        <button key={role} onClick={() => setSelectedRole(role)}>
          {role}
        </button>
      ))}
      {selectedRole && (
        <button
          onClick={() =>
            loginWithRedirect({
              appState: { returnTo: `/dashboard/${selectedRole}` },
            })
          }
        >
          Login as {selectedRole}
        </button>
      )}
    </div>
  );
}
