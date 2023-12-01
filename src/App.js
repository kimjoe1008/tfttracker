import logo from './logo.svg';
import './App.css';
import './Services/riotAPIServices';
import { getChallengerLeaderboard } from './Services/riotAPIServices';

function App() {
  console.log(getChallengerLeaderboard());
  return (
    <div className="App">
    </div>
  );
}

export default App;
