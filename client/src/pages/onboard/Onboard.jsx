import { useUser } from "../../context/UserContext";
import AthleteForm from "./AthleteForm";
import CoachForm from "./CoachForm";
import ParentForm from "./ParentForm";
import FederationForm from "./FederationForm";
import TeamForm from "./TeamForm";
import SponsorForm from "./SponsorForm";
import OrganizerForm from "./OrganizerForm";
import ScoutForm from "./ScoutForm";
// ...import other forms

export default function Onboard() {
  const { userRole } = useUser();

  if (!userRole) return <p>Loading role...</p>;

  const forms = {
    athlete: <AthleteForm />,
    coach: <CoachForm />,
    parent: <ParentForm />,
    federation: <FederationForm />,
    team: <TeamForm />,
    sponsor: <SponsorForm />,
    organizer: <OrganizerForm />,
    scout: <ScoutForm />,
  };

  return (
    <div className="onboard-container">
      {forms[userRole] || <p>Unknown role</p>}
      {forms["coach"] || <p>Unknown role</p>}
      {forms["parent"] || <p>Unknown role</p>}
      {forms["federation"] || <p>Unknown role</p>}
      {forms["team"] || <p>Unknown role</p>}
      {forms["sponsor"] || <p>Unknown role</p>}
      {forms["organizer"] || <p>Unknown role</p>}
      {forms["scout"] || <p>Unknown role</p>}
    </div>
  );
}
