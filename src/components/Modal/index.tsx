import { useEffect, useState } from "react";
import ReactModal from "react-modal";

export default function Modal(props: any) {
  const { isOpen } = props;
  const [modalStatus, setModalStatus] = useState({ modalStatus: isOpen });

  useEffect(() => {
    console.log(props);
    setModalStatus({ modalStatus: isOpen });
  }, [modalStatus]);

  const { children, setIsOpen } = props;

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={modalStatus.modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          background: "#F0F0F5",
          color: "#000000",
          borderRadius: "8px",
          width: "736px",
          border: "none",
        },
        overlay: {
          backgroundColor: "#121214e6",
        },
      }}
    >
      {children}
    </ReactModal>
  );
}
