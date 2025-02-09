import React, { useState } from 'react';
import ActivityList from './ActivityList';

function Activity() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div>
            <ActivityList />
    </div>
  );
}

export default Activity;