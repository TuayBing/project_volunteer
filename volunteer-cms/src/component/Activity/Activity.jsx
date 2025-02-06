import React, { useState } from 'react';
import MainLayout from '../../layout/NavigationBar/MainLayout';
import ActivityList from './ActivityList';

function Activity() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div>
      <MainLayout>
            <ActivityList />
      </MainLayout>
    </div>
  );
}

export default Activity;