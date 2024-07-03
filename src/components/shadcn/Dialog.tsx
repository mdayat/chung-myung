import { forwardRef } from "react";
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
} from "react";

import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-dialog";

import { cn } from "@lib/shadcn";
import { CloseIcon } from "@components/icons/CloseIcon";

const Dialog = Root;
const DialogTrigger = Trigger;
const DialogPortal = Portal;
const DialogClose = Close;

const DialogOverlay = forwardRef<
  ElementRef<typeof Overlay>,
  ComponentPropsWithoutRef<typeof Overlay>
>(({ className, ...props }, ref) => (
  <Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-neutral-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = Overlay.displayName;

interface DialogContentProps extends ComponentPropsWithoutRef<typeof Content> {
  type?: "lightbox" | "information";
}

const DialogContent = forwardRef<
  ElementRef<typeof Content>,
  DialogContentProps
>(({ className, children, type = "information", ...props }, ref) => {
  const dialogContentBg =
    type === "information" ? "bg-neutral-0" : "bg-neutral-100";

  return (
    <DialogPortal>
      <DialogOverlay />
      <Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-8 rounded-3xl shadow-[0_9px_18px_0_rgba(0,0,0,0.2)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-75 data-[state=open]:zoom-in-75 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          dialogContentBg,
          className
        )}
        {...props}
      >
        {children}

        {type === "information" ? (
          <Close className="absolute right-4 top-4 rounded-full disabled:pointer-events-none">
            <CloseIcon className="fill-neutral-800 w-6 h-6" />
            <span className="sr-only">Close</span>
          </Close>
        ) : (
          <Close className="absolute -top-16 left-1/2 -translate-x-1/2 border border-neutral-0 p-2 rounded-full disabled:pointer-events-none">
            <CloseIcon className="fill-neutral-0 w-6 h-6" />
            <span className="sr-only">Close</span>
          </Close>
        )}
      </Content>
    </DialogPortal>
  );
});
DialogContent.displayName = Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => <div className={className} {...props} />;
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => <div className={className} {...props} />;
DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef<
  ElementRef<typeof Title>,
  ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, ref) => (
  <Title ref={ref} className={className} {...props} />
));
DialogTitle.displayName = Title.displayName;

const DialogDescription = forwardRef<
  ElementRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
  <Description ref={ref} className={className} {...props} />
));
DialogDescription.displayName = Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
