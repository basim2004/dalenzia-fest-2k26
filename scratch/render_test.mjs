import React from 'react';
import { renderToString } from 'react-dom/server';
import ScheduleModule from '../src/admin/components/ScheduleModule.jsx';

try {
  const html = renderToString(React.createElement(ScheduleModule, { activeSection: 'schedule' }));
  console.log('SUCCESS! Rendered HTML length:', html.length);
} catch (err) {
  console.error('ERROR rendering ScheduleModule:', err);
}
