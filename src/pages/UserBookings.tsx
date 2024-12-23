import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Booking {
  _id: string;
  bookingNumber: number;
  packageTitle: string;
  packageType: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  passengerDetails: {
    firstName: string;
    lastName: string;
  }[];
}

const UserBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    console.log('Token présent:', !!token);
    
    if (!token) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      navigate("/connexion");
      return;
    }

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const tokenExpiration = tokenData.exp * 1000; // Conversion en millisecondes
      
      if (tokenExpiration < Date.now()) {
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        localStorage.removeItem("userToken");
        navigate("/connexion");
        return;
      }
      
      console.log('Token valide jusqu\'à:', new Date(tokenExpiration));
    } catch (error) {
      console.error('Erreur de décodage du token:', error);
      localStorage.removeItem("userToken");
      navigate("/connexion");
      return;
    }

    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchBookings(token);
        setBookings(data.bookings || []);
        
        if (data.bookings?.length === 0) {
          toast({
            title: "Aucune réservation",
            description: "Vous n'avez pas encore de réservation",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos réservations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate, toast]);

  const fetchBookings = async (token: string) => {
    try {
      console.log('Tentative de récupération des réservations avec le token:', token);
      
      const response = await fetch(`${API_BASE_URL}/bookings/user-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        console.error('Erreur réponse:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error('Détails de l\'erreur:', errorData);
        throw new Error(errorData.message || "Erreur lors du chargement des réservations");
      }

      const data = await response.json();
      console.log('Structure complète des données reçues:', JSON.stringify(data, null, 2));
      
      const bookingsData = Array.isArray(data) ? data : data.bookings || [];
      console.log('Données de réservations formatées:', bookingsData);
      
      return { bookings: bookingsData };
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const renderBookingCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookings.map((booking) => (
        <div 
          key={booking._id}
          className="bg-white rounded-lg shadow p-4 space-y-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium capitalize">
                {booking.passengerDetails[0]?.firstName} {booking.passengerDetails[0]?.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                N° {booking.bookingNumber}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : booking.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {booking.status === "pending"
                ? "En attente de paiement"
                : booking.status === "confirmed"
                ? "Confirmé"
                : "Annulé"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Package</p>
              <p className="font-medium capitalize">
                {booking.packageType === 'hajj' ? 'Hajj' : 'Omra'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Prix</p>
              <p className="font-medium">{booking.totalPrice} €</p>
            </div>
            <div>
              <p className="text-gray-500">Date de réservation</p>
              <p className="font-medium">{formatDate(booking.createdAt)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mes réservations
        </h1>

        {bookings?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Vous n'avez pas encore de réservation
            </p>
            <Button onClick={() => navigate("/")}>
              Découvrir nos offres
            </Button>
          </div>
        ) : (
          renderBookingCards()
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserBookings; 