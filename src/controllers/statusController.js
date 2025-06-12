// Nouveau contrôleur pour gérer les statuts WhatsApp
import { renderStatusView } from '../views/statusView.js';

let currentStatuses = [];

export function initStatusController() {
  // Charger les statuts depuis le localStorage
  loadStatuses();
  
  // Écouter les événements de statut
  document.addEventListener('status-created', handleStatusCreated);
  document.addEventListener('status-viewed', handleStatusViewed);
}

function loadStatuses() {
  const savedStatuses = localStorage.getItem('whatsapp_statuses');
  currentStatuses = savedStatuses ? JSON.parse(savedStatuses) : [];
  
  // Nettoyer les statuts expirés (plus de 24h)
  const now = Date.now();
  currentStatuses = currentStatuses.filter(status => 
    now - new Date(status.createdAt).getTime() < 24 * 60 * 60 * 1000
  );
  
  saveStatuses();
}

function saveStatuses() {
  localStorage.setItem('whatsapp_statuses', JSON.stringify(currentStatuses));
}

export function createStatus(content, type = 'text', backgroundColor = '#00a884') {
  const newStatus = {
    id: Date.now(),
    content: content,
    type: type, // 'text', 'image', 'video'
    backgroundColor: backgroundColor,
    createdAt: new Date().toISOString(),
    viewedBy: [],
    isOwn: true
  };
  
  currentStatuses.unshift(newStatus);
  saveStatuses();
  
  // Émettre un événement
  const event = new CustomEvent('status-created', { detail: newStatus });
  document.dispatchEvent(event);
  
  return newStatus;
}

export function viewStatus(statusId, viewerId = 'current-user') {
  const status = currentStatuses.find(s => s.id === statusId);
  if (status && !status.viewedBy.includes(viewerId)) {
    status.viewedBy.push(viewerId);
    saveStatuses();
    
    const event = new CustomEvent('status-viewed', { detail: { statusId, viewerId } });
    document.dispatchEvent(event);
  }
}

export function getAllStatuses() {
  loadStatuses();
  return currentStatuses;
}

export function getMyStatuses() {
  loadStatuses();
  return currentStatuses.filter(status => status.isOwn);
}

export function getOthersStatuses() {
  loadStatuses();
  return currentStatuses.filter(status => !status.isOwn);
}

function handleStatusCreated(event) {
  console.log('Nouveau statut créé:', event.detail);
  // Mettre à jour l'interface si nécessaire
}

function handleStatusViewed(event) {
  console.log('Statut vu:', event.detail);
  // Mettre à jour l'interface si nécessaire
}

export function deleteStatus(statusId) {
  currentStatuses = currentStatuses.filter(status => status.id !== statusId);
  saveStatuses();
}