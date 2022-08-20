
import React from 'react';
import './App.css';
import { Dashboard } from './components/dashboard/Dashboard';
import { AppRoutes } from './routes/Routes';
import { BrowserRouter } from 'react-router-dom'

function App() {

  return (
    <div className="App" style={{display:"flex", flexDirection: "column"}}>
      <BrowserRouter>
        <Dashboard
          data={
            <AppRoutes />
          }
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
