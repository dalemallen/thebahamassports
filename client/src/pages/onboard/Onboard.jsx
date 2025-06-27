import { useUser } from "../../context/AuthContext";
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
import ProfileForm from './ProfileForm';

export default function Onboard() {
  const { role, dbUser, user } = useUser();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

const handleSubmit = async (formData) => {
  console.log("formData:", formData);

  try {
    const identifier = dbUser?.id || user?.sub;
    const idField = dbUser?.id ? "user_id" : "auth0_id";

    let endpoint = "";
    let payload = { ...formData };

    switch (role) {
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
      case "parent":
      case "sponsor":
      case "organizer":
      case "scout":
        endpoint = `/api/${role}s/save-draft`;
        payload = { ...payload, [idField]: identifier };
        break;
case "team":
  endpoint = "/api/teams/save-draft";
  payload = {
    name: formData.name,
    federation_id: formData.federation_Id,
    location: formData.location,
    age_group: formData.ageGroup,
    gender: formData.gender,
    coach_names: formData.coachNames,
    [idField]: identifier,
  };
  break;


      case "federation":
        endpoint = "/api/federations/me";
        const formDataToSend = new FormData();
        formDataToSend.append("description", payload.description);
        if (payload.logo) formDataToSend.append("logo", payload.logo);
        if (payload.coverImage) formDataToSend.append("coverImage", payload.coverImage);

        const token = await getAccessTokenSilently();
        await axios.patch(endpoint, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;

      default:
        throw new Error("Unknown user role");
    }

    // Submit onboarding complete only for non-federation and non-team roles
    if (role !== "federation" && role !== "team") {
      await axios.post(endpoint, payload);
    }

    await axios.patch(`/api/users/${identifier}/complete-onboarding`);
    navigate(`/dashboard/${role}`);
  } catch (err) {
    console.error("Onboarding submission failed", err);
    alert("Error submitting onboarding form. Please try again.");
  }
};



  const forms = {
    athlete: <AthleteForm onSubmit={handleSubmit} />,
    coach: <CoachForm onSubmit={handleSubmit} />,
    parent: <ParentForm onSubmit={handleSubmit} />,
  federation: (
    <ProfileForm
      endpoint="/api/users/me"
      onComplete={() => navigate(`/dashboard/${role}`)}
    />
  ),    team: <TeamForm onSubmit={handleSubmit} />,
    sponsor: <SponsorForm onSubmit={handleSubmit} />,
    organizer: <OrganizerForm onSubmit={handleSubmit} />,
    scout: <ScoutForm onSubmit={handleSubmit} />,
  };

  if (!role) return <p>Loading role...</p>;

  return <div className="onboard-container">{forms[role] || <p>Unknown role</p>}</div>;
}
