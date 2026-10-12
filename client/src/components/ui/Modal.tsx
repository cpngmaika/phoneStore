"use client";

import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <dialog
      aria-label="Dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/50 p-5 backdrop:bg-transparent open:flex"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      open
    >
      <section className="w-full max-w-lg rounded-lg bg-surface p-6 shadow-soft">
        {children}
      </section>
    </dialog>
  );
}
