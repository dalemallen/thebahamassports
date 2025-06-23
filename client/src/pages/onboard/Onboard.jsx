import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    console.log('about to submit');
    console.log('formData: ', formData);
    try {
      // Choose identifier (prefer internal DB id)
      const identifier = dbUser?.id || user?.sub;
      const idField = dbUser?.id ? "user_id" : "auth0_id";

const payload = {
  ...formData,
  sport_id: formData.sport?.id || formData.sport_id,
};
console.log("payload", payload)
delete payload.sport;

await axios.post('/api/athletes/save-draft', {
  ...payload,
  [dbUser?.id ? "user_id" : "auth0_id"]: dbUser?.id || user?.sub,
});


      await axios.patch(`/api/users/${identifier}/complete-onboarding`);

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
