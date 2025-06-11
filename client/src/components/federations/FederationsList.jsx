import { useEffect, useState } from "react";
import axios from "axios";

export default function FederationsList() {
  const [federations, setFederations] = useState([]);
  console.log('federations: ', federations);

  useEffect(() => {
    axios.get("/api/federations")
      .then(res => setFederations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Federations</h2>
      <ul>
        {federations.map(fed => (
          <li key={fed.id}>
            <a href={`/federations/${fed.id}`}>{fed.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}