import React from 'react';
import Router from './BrowserRouter';
import { SavedActivitiesProvider } from './layout/NavigationBar/SavedActivitiesContext';
import PDPAModal from './layout/PDPAModal/PDPAModal';

function App() {
  return (
    <SavedActivitiesProvider>
      <div>
        <PDPAModal />
        <Router />
      </div>
    </SavedActivitiesProvider>
  );
}

export default App;
