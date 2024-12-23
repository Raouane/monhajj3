import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

const UserLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emailFormData, setEmailFormData] = useState({
    email: "",
    password: "",
  });
  const [bookingFormData, setBookingFormData] = useState({
    email: "",
    bookingNumber: "",
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Tentative de connexion avec:', emailFormData);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailFormData.email.toLowerCase().trim(),
          password: emailFormData.password
        }),
      });

      const data = await response.json();
      console.log('Réponse du serveur:', data);

      if (!response.ok) {
        throw new Error(data.message || "Email ou mot de passe incorrect");
      }

      localStorage.setItem("userToken", data.token);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
        duration: 3000,
      });

      navigate("/mes-reservations");
    } catch (error) {
      console.error('Erreur complète:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  const handleBookingLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Informations invalides");
      }

      localStorage.setItem("userToken", data.token);
      
      toast({
        title: "Connexion réussie",
        description: "Accès à votre réservation",
        duration: 3000,
      });

      navigate("/mes-reservations");
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Informations invalides",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-gray-600 hover:text-primary"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Button>

        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à vos réservations
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email + Mot de passe</TabsTrigger>
            <TabsTrigger value="booking">Email + N° Réservation</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={emailFormData.email}
                    onChange={(e) =>
                      setEmailFormData({ ...emailFormData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={emailFormData.password}
                    onChange={(e) =>
                      setEmailFormData({ ...emailFormData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="booking">
            <form className="mt-8 space-y-6" onSubmit={handleBookingLogin}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bookingEmail">Email</Label>
                  <Input
                    id="bookingEmail"
                    type="email"
                    required
                    placeholder="Email utilisé lors de la réservation"
                    value={bookingFormData.email}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bookingNumber">Numéro de réservation</Label>
                  <Input
                    id="bookingNumber"
                    type="text"
                    required
                    placeholder="Ex: 123456"
                    value={bookingFormData.bookingNumber}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, bookingNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Accéder à ma réservation
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserLogin; 