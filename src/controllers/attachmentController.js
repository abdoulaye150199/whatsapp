import { renderAttachmentModal, hideAttachmentModal } from '../views/attachmentModalView.js';

export function initAttachmentController() {
  const attachButton = document.getElementById('attach-button');
  
  if (attachButton) {
    attachButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const buttonRect = attachButton.getBoundingClientRect();
      const position = {
        x: buttonRect.left,
        y: window.innerHeight - buttonRect.bottom - 360 // Hauteur du modal
      };
      
      renderAttachmentModal(position);
    });
  }
}

export function handleAttachmentSelection(type) {
  switch(type) {
    case 'document':
      openFilePicker('.pdf,.doc,.docx,.xls,.xlsx');
      break;
    case 'media':
      openFilePicker('image/*,video/*');
      break;
    case 'audio':
      openFilePicker('audio/*');
      break;
  }
  hideAttachmentModal();
}