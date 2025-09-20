import { useState, useEffect } from "react";
import { GameContainer } from "./components/game/GameContainer";
import { useAudio } from "./lib/stores/useAudio";
import "./styles/game.css";
import "@fontsource/inter";

function App() {
  const [gameInitialized, setGameInitialized] = useState(false);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Initialize audio files
    const initializeAudio = async () => {
      try {
        const bgMusic = new Audio("/sounds/background.mp3");
        const hitSound = new Audio("/sounds/hit.mp3");
        const successSound = new Audio("/sounds/success.mp3");

        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        
        setBackgroundMusic(bgMusic);
        setHitSound(hitSound);
        setSuccessSound(successSound);
        
        setGameInitialized(true);
      } catch (error) {
        console.log("Audio initialization failed:", error);
        setGameInitialized(true); // Continue without audio
      }
    };

    initializeAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  if (!gameInitialized) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Money Quest...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <GameContainer />
    </div>
  );
}

export default App;
