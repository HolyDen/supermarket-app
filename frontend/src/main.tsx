import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useSelector } from 'react-redux'
import App from './App.tsx'
import './index.css'
import { store, RootState } from './redux/store.ts'

const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeInitializer>
        <App />
      </ThemeInitializer>
    </Provider>
  </React.StrictMode>,
)
