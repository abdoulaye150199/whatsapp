// Nouveau fichier pour séparer les fonctionnalités de chat
import { EmojiPicker } from '../components/EmojiPicker.js';
import { addMessage } from '../models/messageModel.js';

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recordingStartTime = null;
let recordingTimer = null;
let wasCanceled = false;
let emojiPicker = null;

// Initialiser le picker d'emojis
export function initEmojiPicker() {
  if (!emojiPicker) {
    emojiPicker = new EmojiPicker();
    const emojiPickerElement = emojiPicker.create();
    document.body.appendChild(emojiPickerElement);
  }
  return emojiPicker;
}

// Gestion de l'enregistrement audio
export async function startVoiceRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });

    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }
    }

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType || undefined
    });
    
    audioChunks = [];
    isRecording = true;
    recordingStartTime = Date.now();
    wasCanceled = false;

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      stream.getTracks().forEach(track => track.stop());
      if (!wasCanceled && audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
        const duration = getDuration(recordingStartTime);
        return { audioBlob, duration };
      }
      return null;
    });

    mediaRecorder.start();
    return mediaRecorder;
  } catch (error) {
    console.error("Erreur d'accès au microphone:", error);
    throw error;
  }
}

export function stopVoiceRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    clearInterval(recordingTimer);
  }
}

export function cancelVoiceRecording() {
  wasCanceled = true;
  stopVoiceRecording();
}

function getDuration(startTime) {
  const duration = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Gestion des fichiers
export function handleFileUpload(files, onFileSelect) {
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result,
        file: file
      };
      onFileSelect(fileData);
    };
    reader.readAsDataURL(file);
  });
}

// Formatage de la taille des fichiers
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Timer d'enregistrement
export function startRecordingTimer(timerElement) {
  let seconds = 0;
  recordingTimer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (timerElement) {
      timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

export function stopRecordingTimer() {
  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }
}