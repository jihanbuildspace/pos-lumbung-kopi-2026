import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/App.tsx';

try {
  const html = ReactDOMServer.renderToString(React.createElement(App));
  console.log('RENDER SUCCESSFUL! HTML length:', html.length);
  console.log('Snippet:', html.slice(0, 300));
} catch (err) {
  console.error('RENDER FAILED WITH ERROR:', err);
}
