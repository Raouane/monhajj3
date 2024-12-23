import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">Aucune information de réservation disponible</p>
              <Button onClick={() => navigate('/')} className="w-full">
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Réservation confirmée !
              </h1>
              <p className="text-gray-600">
                Votre demande pour {booking.packageTitle} a été enregistrée avec succès.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="border-b pb-4">
                <h2 className="font-semibold mb-2">Détails de la réservation</h2>
                <p className="text-sm text-gray-600">Numéro de réservation : {booking.number}</p>
                <p className="text-sm text-gray-600">Montant total : {booking.totalPrice} €</p>
                <p className="text-sm text-gray-600">Nombre de voyageurs : {booking.passengerCount}</p>
                <p className="text-sm text-gray-600">Statut : {booking.status === 'pending' ? 'En attente' : booking.status}</p>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Prochaines étapes</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Un email de confirmation a été envoyé à {booking.contactEmail}
                </p>
                <p className="text-sm text-gray-600">
                  Notre équipe vous contactera prochainement pour finaliser votre dossier.
                </p>
              </div>
            </div>

            <Button onClick={() => navigate('/')} className="w-full">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Confirmation; 