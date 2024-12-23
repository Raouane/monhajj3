import { Facebook, Instagram, Twitter } from "lucide-react";
import OfferCard from "./OfferCard";
import { Link } from "react-router-dom";

const offers = [
  {
    title: "Hajj - Forfait Premium",
    price: "6900 €",
    duration: "21 jours",
    location: "La Mecque & Médine",
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800",
  },
  {
    title: "Omra - Ramadan",
    price: "2900 €",
    duration: "14 jours",
    location: "La Mecque",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800",
  },
  {
    title: "Omra - Hiver",
    price: "1900 €",
    duration: "10 jours",
    location: "La Mecque & Médine",
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800",
  },
  {
    title: "Omra - Été",
    price: "2200 €",
    duration: "12 jours",
    location: "La Mecque",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800",
  },
  {
    title: "Hajj - Économique",
    price: "5500 €",
    duration: "18 jours",
    location: "La Mecque & Médine",
    imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800",
  },
  {
    title: "Omra - Premium",
    price: "3500 €",
    duration: "15 jours",
    location: "La Mecque & Médine",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800",
  }
];

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#2A2A2A] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-[#FFD700] font-bold mb-4">Hajj & Omra</h3>
            <p className="text-[#808080]">
              Votre partenaire de confiance pour les pèlerinages
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300">Email: contact@pilgrimage.com</p>
            <p className="text-gray-300">Tél: +33 1 23 45 67 89</p>
            <p className="text-gray-300">Adresse: 123 Rue du Pèlerinage, Paris</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nos offres</a></li>
              <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#2A2A2A] mt-8 pt-8 text-center text-[#808080]">
          © 2024 Hajj & Omra. Tous droits réservés.
        </div>
        <div className="text-center text-xs text-gray-500 mt-8">
          <Link 
            to="/admin/login" 
            className="hover:text-gray-400 transition-colors"
          >
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;