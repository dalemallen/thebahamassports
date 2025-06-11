export default function SportsFilter({ sport, onChange }) {
  const sports = [
    "athletics", "boxing", "cycling", "equestrian", "fencing",
    "football", "golf", "gymnastics", "hockey", "judo",
    "karate", "rowing", "rugby", "sailing", "shooting",
    "swimming", "table-tennis", "taekwondo", "tennis", "triathlon",
    "volleyball", "weightlifting", "wrestling", "basketball"
  ];

  return (
    <select value={sport} onChange={(e) => onChange(e.target.value)}>
      <option value="">All Sports</option>
      {sports.map((s) => (
        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
      ))}
    </select>
  );
}