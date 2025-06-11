import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FederationDetail() {
  const { federationId } = useParams();
  const [federation, setFederation] = useState(null);

  useEffect(() => {
    axios.get(`/api/federations/${federationId}`)
      .then(res => setFederation(res.data))
      .catch(err => console.error(err));
  }, [federationId]);

  if (!federation) return <div>Loading federation...</div>;

  return (
    <div>
      <h2>{federation.name}</h2>
      <p>{federation.description}</p>
    </div>
  );
}