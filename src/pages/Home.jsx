import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <h1>Flutter Focus</h1>
      <Link to="/calendar"><button>Calendar</button></Link>
      <Link to="/study"><button>Study Now</button></Link>
      <Link to="/garden"><button>Garden</button></Link>
    </div>
  );
}

export default Home;