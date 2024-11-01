import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import useParty from "../../hooks/useParty";

const PartyComponent = () => {
  const { isParty } = useParty();
  const [recycleConfetti, setRecycleConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (isParty) {
      setRecycleConfetti(true);
      setTimeout(() => setRecycleConfetti(false), 1500);
    }
  }, [isParty]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isParty && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={180}
          gravity={0.2}
          recycle={recycleConfetti}
        />
      )}
    </>
  );
};

export default PartyComponent;
