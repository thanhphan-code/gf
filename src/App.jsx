import React, { useState } from 'react';
import UnlockGate from './components/UnlockGate';
import MemoryWall from './components/MemoryWall';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <>
      {isUnlocked ? (
        <MemoryWall />
      ) : (
        <UnlockGate onUnlock={() => setIsUnlocked(true)} />
      )}
    </>
  );
}

export default App;
