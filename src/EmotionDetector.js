import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const EmotionDetector = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const lastSentEmotion = useRef(null); // To avoid redundant API calls
  const [detectedEmotion, setDetectedEmotion] = useState('');

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const sendEmotionToAPI = async (emotion) => {
      try {
        const response = await fetch('http://127.0.0.1:5000/emotion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ emotion: emotion })
        });

        const data = await response.json();
        console.log('Response from server:', data);
      } catch (error) {
        console.error('Error sending emotion to backend:', error);
      }
    };

    const detectEmotions = () => {
      setInterval(async () => {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resized = faceapi.resizeResults(detections, displaySize);

        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        resized.forEach(result => {
          const { x, y, width, height } = result.detection.box;
          const sorted = Object.entries(result.expressions).sort((a, b) => b[1] - a[1]);
          const emotion = sorted[0][0];

          // Display on canvas
          ctx.strokeStyle = 'lime';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = 'lime';
          ctx.font = '20px Arial';
          ctx.fillText(`Emotion: ${emotion}`, x, y - 10);

          // Only send to API if emotion changed
          if (lastSentEmotion.current !== emotion) {
            lastSentEmotion.current = emotion;
            setDetectedEmotion(emotion);
            sendEmotionToAPI(emotion);
          }
        });
      }, 500); // Every 500ms
    };

    loadModels().then(() => {
      startVideo();
      videoRef.current.addEventListener('play', detectEmotions);
    });
  }, []);

  if(detectedEmotion === 'happy') {
    var emoji = '😊';
  }else if(detectedEmotion === 'sad') {
    var emoji = '😢';
  }else if(detectedEmotion === 'angry') {
    var emoji = '😡';
  }else if(detectedEmotion === 'neutral') {
    var emoji = '😐';
  }else if(detectedEmotion === 'surprised') {
    var emoji = '😲';
    }else if(detectedEmotion === 'disgusted') {
    var emoji = '🤢';
    }else if(detectedEmotion === 'fearful') {
    var emoji = '😱';
    }


  return (
    <>
      <h1 className='box'>Look in the mirror</h1>
      <div className='mirror' id='mirror'>
      <div className='box' style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute'}}
        />
      </div>
      </div>
      <div className="box" id='box'>
        <h2>Detected Emotion: {detectedEmotion} {emoji}</h2>
      </div>
      
    </>
  );
};

export default EmotionDetector;
