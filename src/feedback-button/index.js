import React from 'react';
import { CookiesProvider } from 'react-cookie';
import App from './App';

const FeedbackButton = () => (
    <CookiesProvider>
        <App />
    </CookiesProvider>
)

export default FeedbackButton