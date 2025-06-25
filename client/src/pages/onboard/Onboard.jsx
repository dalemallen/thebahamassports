import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import AthleteForm from "./AthleteForm";
import CoachForm from "./CoachForm";
import ParentForm from "./ParentForm";
import FederationForm from "./FederationForm";
import TeamForm from "./TeamForm";
import SponsorForm from "./SponsorForm";
import OrganizerForm from "./OrganizerForm";
import ScoutForm from "./ScoutForm";

export default function Onboard() {
  const { userRole, dbUser, user } = useUser();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

const handleSubmit = async (formData) => {
  console.log("formData:", formData);

  try {
    const identifier = dbUser?.id || user?.sub;
    const idField = dbUser?.id ? "user_id" : "auth0_id";

    let endpoint = "";
    let payload = { ...formData };

    // Modify payload and endpoint based on userRole
    switch (userRole) {
      case "athlete":
        endpoint = "/api/athletes/save-draft";
        payload = {
          ...payload,
          sport_id: payload.sport?.id || payload.sport_id,
          [idField]: identifier,
        };
        delete payload.sport;
        break;

      case "coach":
        endpoint = "/api/coaches/save-draft";
        payload = {
          ...payload,
          [idField]: identifier,
        };
        break;

      case "parent":
        endpoint = "/api/parents/save-draft";
        payload = {
          ...payload,
          [idField]: identifier,
        };
        break;

      case "team":
        endpoint = "/api/teams/save-draft";
        payload = {
          ...payload,
          [idField]: identifier,
        };
        break;

      case "sponsor":
        endpoint = "/api/sponsors/save-draft";
        payload = {
          ...payload,
          [idField]: identifier,
        };
        break;

      case "organizer":
        endpoint = "/api/organizers/save-draft";
        payload = {
          ...payload,
          [idField]: identifier,
        };
        break;

      case "scout":
        endpoint = "/api/scouts/save-draft";
        payload = {
          ...payload,
          [idField]: identifier,
        };
        break;

      case "federation":
        console.log('here');
        // Use FormData for file uploads
        endpoint = "/api/federations/me";
        const formDataToSend = new FormData();
        formDataToSend.append("description", payload.description);
        if (payload.logo) formDataToSend.append("logo", payload.logo);
        if (payload.coverImage) formDataToSend.append("coverImage", payload.coverImage);

        const token = await getAccessTokenSilently();
        console.log('token: ', token);
        const form = await axios.patch(endpoint, formDataToSend, {
          headers: {
             Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
            
          },
        });
onsole.log('form: ', form);
        break;

      default:
        throw new Error("Unknown user role");
    }

  console.log('userRole: ', userRole);
    // Submit payload if not federation (already submitted above)
    if (userRole !== "federation") {
    
      await axios.post(endpoint, payload);
    }
    console.log('identifier: ', identifier);
    await axios.patch(`/api/users/${identifier}/complete-onboarding`);
    return;
    navigate(`/dashboard/${userRole}`);
  } catch (err) {
    console.error("Onboarding submission failed", err);
    alert("Error submitting onboarding form. Please try again.");
  }
};


  const forms = {
    athlete: <AthleteForm onSubmit={handleSubmit} />,
    coach: <CoachForm onSubmit={handleSubmit} />,
    parent: <ParentForm onSubmit={handleSubmit} />,
    federation: <FederationForm onSubmit={handleSubmit} />,
    team: <TeamForm onSubmit={handleSubmit} />,
    sponsor: <SponsorForm onSubmit={handleSubmit} />,
    organizer: <OrganizerForm onSubmit={handleSubmit} />,
    scout: <ScoutForm onSubmit={handleSubmit} />,
  };

  if (!userRole) return <p>Loading role...</p>;

  return <div className="onboard-container">{forms[userRole] || <p>Unknown role</p>}</div>;
}
