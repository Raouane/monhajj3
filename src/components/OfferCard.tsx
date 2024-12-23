import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OfferCardProps {
  id: string;
  title: string;
  price: string;
  duration: string;
  location: string;
  imageUrl: string;
}

const OfferCard = ({ id, title, price, duration, location, imageUrl }: OfferCardProps) => {
  const navigate = useNavigate();

  const handleInscription = () => {
    navigate('/inscription', { 
      state: { 
        offerId: id,
        offerTitle: title,
        offerPrice: price 
      } 
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg shadow-lg overflow-hidden border border-[#2A2A2A] hover:border-[#FFD700] transition-all">
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-4 right-4 bg-[#FFD700] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-medium">
          {price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#FFD700] mb-2">{title}</h3>
        <div className="flex items-center text-white mb-4">
          <span className="text-[#808080]">{duration}</span>
          <span className="mx-2">•</span>
          <span className="text-[#808080]">{location}</span>
        </div>
        <Button 
          className="w-full bg-[#2A2A2A] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A1A1A]"
          onClick={() => navigate(`/package/${id}`)}
        >
          Voir les détails
        </Button>
      </div>
    </div>
  );
};

export default OfferCard;