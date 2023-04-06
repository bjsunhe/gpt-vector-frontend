import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import ReactMarkdown from 'react-markdown';

import './index.css';
import App from './App';
import Chat from './Chat'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <Chat />
  </div>
);


