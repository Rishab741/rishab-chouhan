'use client';

import React from 'react';
import { useScrollProgress } from '../hooks';

export const ScrollProgressBar: React.FC = () => {
    const progress = useScrollProgress();
    
    return (
        <div 
            className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 transition-all duration-300"
            style={{ width: `${progress}%` }}
        />
    );
};