import './normalize.css';

import { useEffect } from 'react';

import styles from './App.module.less';
import { useTTSInit, useTTSStore } from './hooks/useTTS';

function App() {
  const speak = useTTSStore((state) => state.speak);
  const speech = () => {
    speak('如何学习 rust ', () => {
      console.log('speak done');
    });
  };
  const init = useTTSInit();

  useEffect(() => {
    init();
  }, []);

  return (
    <div className={styles.root}>
      <button onClick={speech}>speech</button>
      <h1>123</h1>
    </div>
  );
}

export default App;
