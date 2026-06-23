"use client";

import React from "react";
import { AnimatedModal } from "@/components/shared/animated-modal";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </AnimatedModal>
  );
};

