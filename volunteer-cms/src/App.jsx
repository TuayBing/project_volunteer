import React from 'react';
import Router from './BrowserRouter';
import { SavedActivitiesProvider } from './layout/NavigationBar/SavedActivitiesContext';

function App() {
  return (
    <SavedActivitiesProvider>
      <div>
        <Router />
      </div>
    </SavedActivitiesProvider>
  );
}

export default App;