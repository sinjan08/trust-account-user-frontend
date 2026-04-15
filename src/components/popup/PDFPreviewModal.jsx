import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PDFPreviewModal = ({ show, onClose, onSave, fileUrl }) => {
  if (!fileUrl) return null;

  const fileURL = URL.createObjectURL(fileUrl);
  const fileType = fileUrl.type;

  const renderPreview = () => {
    if (fileType === 'application/pdf') {
      return <iframe src={fileURL} title="PDF Preview" />;
    }

    if (fileType.startsWith('image/')) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <img src={fileURL} alt="Image Preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
        </div>
      );
    }

    // Word/Excel (open via Google Docs Viewer as fallback)
    if (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${fileURL}&embedded=true`}
          title="Document Preview"
        />
      );
    }

    return <p style={{ padding: 20 }}>Unsupported file format</p>;
  };

  return (
    <>
      <style>{`
        .pdf-preview-modal .modal-dialog {
          max-width: 90%;
          width: 90%;
        }
        .pdf-preview-modal .modal-body {
          height: 80vh;
          overflow-y: auto;
          padding: 0;
        }
        .pdf-preview-modal iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .pdf-preview-modal .modal-footer {
          justify-content: flex-end;
        }
        .pdf-preview-modal .modal-footer button {
          margin-left: 10px;
        }
      `}</style>

      <Modal
        className="pdf-preview-modal"
        show={show}
        onHide={onClose}
        size="lg"
        centered
        style={{ zIndex: 1000000000, position: 'fixed', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <Modal.Header closeButton />
        <Modal.Body>
          {renderPreview()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={onSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PDFPreviewModal;
