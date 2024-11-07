import Modal from "react-modal";

const ModalPortal = ({ isOpen, name, closeModal, content }) => {
  
  const generateClassNames = () => ({
    base: `retraced-logs-viewer-app retracedModal ${name}`,
    afterOpen: `${name}_after-open`,
    beforeClose: `${name}_before-close`,
  });

  return (
    <div>
      <Modal
        isOpen={isOpen}
        className={generateClassNames()}
        contentLabel={name}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        {content}
        <button className="icon u-closeIcon" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ModalPortal;