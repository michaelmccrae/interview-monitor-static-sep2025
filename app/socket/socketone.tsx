'use client';



import { useRef, useState } from 'react';
import styles from './App.module.css';

export default function Transcriber() {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<null | MediaRecorder>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleTranscriptionToggle = async () => {
    if (isTranscribing) {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socketRef.current?.close();
      setIsTranscribing(false);
    } else {
      try {
        if (typeof window === 'undefined') return; // ✅ SSR guard

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        if ('MediaRecorder' in window) {
          const mediaRecorder = new window.MediaRecorder(stream, {
            mimeType: 'audio/webm',
          });
          mediaRecorderRef.current = mediaRecorder;

          const tokenRes = await fetch('/api/deepgram');
          const { key } = await tokenRes.json();

          const socket = new WebSocket(
            'wss://api.deepgram.com/v1/listen?model=nova-3&diarize=true&punctuate=true',
            ['token', key]
          );
          socketRef.current = socket;

          socket.onopen = () => {
            mediaRecorder.addEventListener('dataavailable', (event) => {
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(event.data);
              }
            });
            mediaRecorder.start(250);
          };

          socket.onmessage = (message) => {
            const received = JSON.parse(message.data);
            const result = received.channel.alternatives[0]?.transcript;
            if (result) {
              setTranscript((prev) => prev + ' ' + result);
            }
          };
        }

        setIsTranscribing(true);
      } catch (err) {
        console.error('Failed to start transcription:', err);
      }
    }
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.header}>Real-Time Transcription</h1>
      <button onClick={handleTranscriptionToggle} className={styles.toggleButton}>
        {isTranscribing ? 'Stop Transcription' : 'Start Transcription'}
      </button>
      <div className={styles.transcriptBox}>
        {transcript || (isTranscribing ? 'Listening...' : 'Click the button to begin')}
      </div>
    </div>
  );
}
