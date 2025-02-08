import { useState } from "react";

function Garden() {
  const [butterflies, setButterflies] = useState([]);

  const addButterfly = () => {
    setButterflies([...butterflies, "🦋"]);
  };

  return (
    <div>
      <h2>Garden</h2>
      <button onClick={addButterfly}>Release Butterfly</button>
      <div>{butterflies.map((b, i) => <span key={i}>{b}</span>)}</div>
    </div>
  );
}

export default Garden;