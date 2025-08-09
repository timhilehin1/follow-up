import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ReusableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function ReusableModal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ReusableModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85%] sm:w-[85%] my-8  max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white text-[#44444B] dark:bg-[#242529] dark:text-white">
        <DialogHeader className="text-left mb-4">
          <DialogTitle className="mb-2 capitalize mr-1">{title}</DialogTitle>
          {description && (
            <DialogDescription className="mb-4">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="w-full overflow-auto max-h-[50vh]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
