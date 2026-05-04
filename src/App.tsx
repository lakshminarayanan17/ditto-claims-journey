import { Navbar } from "./Navbar";
import { ClaimsJourney } from "./ClaimsJourney";

function App() {
  return (
    <main className="min-h-screen w-full bg-white">
      <Navbar />
      <ClaimsJourney />
      <div className="h-[40vh]" />
    </main>
  );
}

export default App;
