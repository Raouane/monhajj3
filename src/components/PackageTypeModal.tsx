import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PackageTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PackageTypeModal = ({ isOpen, onClose }: PackageTypeModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Choisissez votre type de pèlerinage
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 mt-6">
          <Button
            className="h-32 text-lg"
            onClick={() => navigate('/hajj')}
          >
            <div className="space-y-2">
              <div className="font-bold">Hajj</div>
              <div className="text-sm font-normal">
                Le grand pèlerinage à La Mecque
              </div>
            </div>
          </Button>
          <Button
            className="h-32 text-lg"
            onClick={() => navigate('/omra')}
          >
            <div className="space-y-2">
              <div className="font-bold">Omra</div>
              <div className="text-sm font-normal">
                Le petit pèlerinage à La Mecque
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageTypeModal; 