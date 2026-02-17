import './App.css';
import React from 'react';

import { useState } from 'react';
import WebCamFeed from './WebCamFeed';

function MirrorDisplay(){
    return(
        <div className='Mirror'>
            <div className='MirrorDisplay'>
                <h1>Look In The Mirror</h1>
                <WebCamFeed />
            </div>
        </div>
    )
}

export default MirrorDisplay;