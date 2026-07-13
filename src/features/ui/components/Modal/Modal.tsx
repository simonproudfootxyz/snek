"use client";

import { useEffect, useId, type ReactNode } from "react";
import Button from "@/features/ui/components/Button";
import "./Modal.css";

type ModalSize = "sm" | "md" | "lg";

type ModalProps = {
  title?: string;
  onClose?: () => void;
  children: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  contained?: boolean;
};

const Modal = ({
  title,
  onClose,
  children,
  size = "md",
  closeOnBackdrop = true,
  contained = false,
}: ModalProps) => {
  const generatedId = useId();
  const labelId = title ? `modal-title-${generatedId}` : undefined;

  useEffect(() => {
    if (!onClose) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleBackdropClick = () => {
    if (closeOnBackdrop && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay ${contained ? "modal-overlay--contained" : ""}`.trim()}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
    >
      <div
        className={`modal modal--${size}`}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="modal__header">
            {title ? (
              <h2 id={labelId} className="modal__title">
                {title}
              </h2>
            ) : null}
            {onClose ? (
              <Button
                onClick={onClose}
                className="modal__close"
                aria-label="Close"
              >
                ✕
              </Button>
            ) : null}
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
