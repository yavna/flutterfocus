import { useState } from "react";
import { Link } from "react-router-dom";

function Garden() {
  const [butterflies, setButterflies] = useState([]);

  const addButterfly = () => {
    setButterflies([...butterflies, "🦋"]);
  };


  return (
    <div>
      <h2>Garden</h2>
      <button onClick={addButterfly}>Release butterly collection</button>
      <div>{butterflies.map((b, i) => <span key={i}>{b}</span>)}</div>
      <Link to="/home"><button>Back</button></Link>
    </div>
  );
}

export default Garden;