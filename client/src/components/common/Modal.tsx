  import { Button as BootstrapButton, Modal as BootstrapModal } from 'react-bootstrap';
 interface ModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, handleClose, title, children }) => {
  return (
    <BootstrapModal show={show} onHide={handleClose} centered>
      <BootstrapModal.Header closeButton closeVariant="white" style={{backgroundColor: 'var(--light-bg)', borderBottomColor: 'var(--border-color)'}}>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body style={{backgroundColor: 'var(--dark-bg)'}}>
        {children}
      </BootstrapModal.Body>
      <BootstrapModal.Footer style={{backgroundColor: 'var(--light-bg)', borderTopColor: 'var(--border-color)'}}>
        <BootstrapButton variant="secondary" onClick={handleClose}>
          Close
        </BootstrapButton>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};
export default Modal;
