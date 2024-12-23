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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowLeft } from "lucide-react";

interface Passenger {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

interface Booking {
  _id: string;
  bookingNumber: number;
  packageTitle: string;
  totalPrice: number;
  status: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  passengerDetails: Passenger[];
}

interface BookingStats {
  pending: number;
  confirmed: number;
  cancelled: number;
  total: number;
  totalAmount: number;
  averagePassengers: number;
  todayCount: number;
  weekCount: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<BookingStats>({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    total: 0,
    totalAmount: 0,
    averagePassengers: 0,
    todayCount: 0,
    weekCount: 0
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    if (!storedAuth) {
      navigate("/admin/login");
      return;
    }

    try {
      const authData = JSON.parse(storedAuth);
      if (!authData.token || authData.role !== 'admin') {
        throw new Error("Session invalide");
      }
      fetchBookings(authData.token);
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  }, [navigate]);

  const calculateStats = (bookings: Booking[]) => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newStats = bookings.reduce((acc, booking) => {
      acc[booking.status]++;
      acc.total++;
      acc.totalAmount += booking.totalPrice;
      acc.averagePassengers += booking.passengerDetails.length;
      const bookingDate = new Date(booking.createdAt);
      if (bookingDate.toDateString() === today.toDateString()) {
        acc.todayCount++;
      }
      if (bookingDate >= weekAgo) {
        acc.weekCount++;
      }
      return acc;
    }, {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      total: 0,
      totalAmount: 0,
      averagePassengers: 0,
      todayCount: 0,
      weekCount: 0
    });

    newStats.averagePassengers = newStats.total > 0 
      ? Math.round((newStats.averagePassengers / newStats.total) * 10) / 10
      : 0;

    setStats(newStats);
  };

  const fetchBookings = async (token: string, page = 1) => {
    try {
      setLoading(true);
      console.log('Token utilisé:', token);

      const response = await fetch(`${API_BASE_URL}/admin/bookings?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur détaillée:', errorData);
        throw new Error(errorData.message || "Non autorisé");
      }

      const data = await response.json();
      console.log('Données reçues:', data);
      setBookings(data.bookings || []);
      calculateStats(data.bookings);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Erreur:", error);
      if (error instanceof Error && error.message.includes('Non autorisé')) {
        localStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminToken');
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      // Mettre à jour l'état local
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de bord administrateur
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/admin/packages')}>
                Gérer les Packages
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Total réservations</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-yellow-800">En attente</h3>
            <p className="text-2xl font-semibold text-yellow-900">{stats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-green-800">Confirmées</h3>
            <p className="text-2xl font-semibold text-green-900">{stats.confirmed}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-red-800">Annulées</h3>
            <p className="text-2xl font-semibold text-red-900">{stats.cancelled}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-blue-800">Montant total</h3>
            <p className="text-2xl font-semibold text-blue-900">{stats.totalAmount.toLocaleString()} €</p>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-purple-800">Moyenne passagers</h3>
            <p className="text-2xl font-semibold text-purple-900">{stats.averagePassengers}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-indigo-800">Aujourd'hui</h3>
            <p className="text-2xl font-semibold text-indigo-900">{stats.todayCount}</p>
          </div>
          <div className="bg-pink-50 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-pink-800">Cette semaine</h3>
            <p className="text-2xl font-semibold text-pink-900">{stats.weekCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Réservations récentes</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Réservation</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="min-w-[250px]">Client</TableHead>
                  <TableHead>Offre</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.bookingNumber}</TableCell>
                    <TableCell>{formatDate(booking.createdAt)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {booking.passengerDetails[0]?.firstName} {booking.passengerDetails[0]?.lastName}
                        </div>
                        <div className="text-sm text-gray-500 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span>📧</span> {booking.contactEmail}
                          </div>
                          {booking.contactPhone && (
                            <div className="flex items-center gap-2">
                              <span>📱</span> {booking.contactPhone}
                            </div>
                          )}
                          {booking.passengerDetails.length > 1 && (
                            <div className="text-xs text-gray-400">
                              +{booking.passengerDetails.length - 1} autre(s) passager(s)
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.packageTitle}</TableCell>
                    <TableCell className="font-medium">
                      {booking.totalPrice.toLocaleString()} €
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-between ${
                              booking.status === "pending"
                                ? "text-yellow-800 bg-yellow-100"
                                : "text-green-800 bg-green-100"
                            }`}
                          >
                            {booking.status === "pending" ? "En attente" : "Confirmé"}
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => updateBookingStatus(booking._id, "pending")}
                            className="text-yellow-800"
                          >
                            En attente
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateBookingStatus(booking._id, "confirmed")}
                            className="text-green-800"
                          >
                            Confirmé
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateBookingStatus(booking._id, "cancelled")}
                            className="text-red-800"
                          >
                            Annulé
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => fetchBookings(authData.token, currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fetchBookings(authData.token, currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 