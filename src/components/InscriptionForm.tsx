import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { API_BASE_URL } from "@/config/api";

interface Person {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password?: string;
  confirmPassword?: string;
}

const InscriptionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const offerDetails = location.state;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const formTitle = offerDetails 
    ? `Inscription pour ${offerDetails.offerTitle}`
    : "Formulaire d'inscription";

  const [persons, setPersons] = useState<Person[]>([
    {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
    }
  ]);

  const addPerson = () => {
    setPersons([
      ...persons,
      {
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        password: "",
        confirmPassword: "",
      }
    ]);
  };

  const removePerson = (index: number) => {
    if (persons.length > 1) {
      setPersons(persons.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: keyof Person, value: string) => {
    const newPersons = [...persons];
    newPersons[index] = {
      ...newPersons[index],
      [field]: value
    };
    setPersons(newPersons);
  };

  const validatePasswords = () => {
    if (persons[0].password !== persons[0].confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    try {
      // 1. Créer un compte pour l'utilisateur principal
      const registerData = {
        firstName: persons[0].prenom,
        lastName: persons[0].nom,
        email: persons[0].email,
        password: persons[0].password,
        phoneNumber: persons[0].telephone
      };

      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        console.error('Erreur inscription:', errorData);
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const registerResult = await registerResponse.json();
      const token = registerResult.token;

      // 2. Créer la réservation avec le token
      const inscriptionData = {
        packageId: offerDetails.offerId,
        passengerDetails: persons.map(person => ({
          firstName: person.prenom,
          lastName: person.nom,
          email: person.email,
          phoneNumber: person.telephone,
          passportNumber: "À remplir",
          dateOfBirth: "1990-01-01"
        })),
        contactEmail: persons[0].email,
        contactPhone: persons[0].telephone,
        totalPrice: parseFloat(offerDetails.offerPrice.replace('€', '').trim())
      };

      const bookingResponse = await fetch(`${API_BASE_URL}/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(inscriptionData)
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        console.error('Erreur réservation:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la réservation');
      }

      const result = await bookingResponse.json();
      console.log('Réservation réussie:', result);

      navigate('/confirmation', { 
        state: { 
          booking: {
            number: result.booking.bookingNumber,
            totalPrice: result.booking.totalPrice,
            status: result.booking.status,
            contactEmail: result.booking.contactEmail,
            passengerCount: result.booking.passengerDetails?.length || 1,
            packageTitle: offerDetails.offerTitle
          }
        }
      });

    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const createTestBooking = async () => {
    try {
      // 1. Créer le compte test
      console.log('Création du compte test...');
      const registerData = {
        firstName: "User",
        lastName: "Test",
        email: "testmohamed@hajj.com",
        password: "Test123!",
        phoneNumber: "0600000000"
      };

      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const registerResult = await registerResponse.json();
      console.log('Résultat inscription:', registerResult);

      if (!registerResponse.ok) {
        throw new Error(registerResult.message || 'Erreur lors de la création du compte');
      }

      // 2. Créer la réservation avec le token
      console.log('Création de la réservation...');
      const testData = {
        packageId: offerDetails.offerId,
        passengerDetails: [{
          firstName: "User",
          lastName: "Test",
          email: "testmohamed@hajj.com",
          phoneNumber: "0600000000",
          passportNumber: "TEST123",
          dateOfBirth: "1990-01-01"
        }],
        contactEmail: "testmohamed@hajj.com",
        contactPhone: "0600000000",
        totalPrice: parseFloat(offerDetails.offerPrice.replace('€', '').trim())
      };

      const bookingResponse = await fetch(`${API_BASE_URL}/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${registerResult.token}`
        },
        body: JSON.stringify(testData)
      });

      const bookingResult = await bookingResponse.json();
      console.log('Résultat réservation:', bookingResult);

      if (!bookingResponse.ok) {
        throw new Error(bookingResult.message || 'Erreur lors de la création de la réservation');
      }

      alert(
        `Réservation test créée avec succès!\n\n` +
        `Identifiants de connexion:\n` +
        `Email: testmohamed@hajj.com\n` +
        `Mot de passe: Test123!\n` +
        `N° de réservation: ${bookingResult.booking.bookingNumber}\n\n` +
        `Vous pouvez vous connecter avec l'email + mot de passe ou l'email + n° de réservation`
      );
    } catch (error) {
      console.error('Erreur détaillée:', error);
      alert('Erreur lors de la création de la réservation test');
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 text-gray-600 hover:text-primary"
        onClick={handleBack}
      >
        <ArrowLeft size={16} />
        Retour aux offres
      </Button>

      {offerDetails && (
        <div className="bg-primary/10 p-4 rounded-lg">
          <h3 className="font-semibold text-lg text-primary mb-2">
            Vous avez choisi
          </h3>
          <div className="space-y-1">
            <p className="text-gray-700">{offerDetails.offerTitle}</p>
            <p className="text-primary font-medium">{offerDetails.offerPrice}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {persons.map((person, index) => (
          <div key={index} className="space-y-6 border-b pb-6 last:border-0">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">
                {index === 0 ? "Informations principales" : `Personne ${index + 1}`}
              </h3>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePerson(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`nom-${index}`}>Nom</Label>
                <Input
                  id={`nom-${index}`}
                  value={person.nom}
                  onChange={(e) => handleChange(index, 'nom', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`prenom-${index}`}>Prénom</Label>
                <Input
                  id={`prenom-${index}`}
                  value={person.prenom}
                  onChange={(e) => handleChange(index, 'prenom', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`email-${index}`}>Email</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  value={person.email}
                  onChange={(e) => handleChange(index, 'email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`telephone-${index}`}>Téléphone</Label>
                <Input
                  id={`telephone-${index}`}
                  type="tel"
                  value={person.telephone}
                  onChange={(e) => handleChange(index, 'telephone', e.target.value)}
                  required
                />
              </div>

              {index === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={person.password || ''}
                      onChange={(e) => handleChange(index, 'password', e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-sm text-gray-500">
                      Le mot de passe doit contenir au moins 6 caractères
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={person.confirmPassword || ''}
                      onChange={(e) => handleChange(index, 'confirmPassword', e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addPerson}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Ajouter une personne
        </Button>

        <Button type="submit" className="w-full">
          Valider l'inscription
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button
          type="button"
          variant="outline"
          onClick={createTestBooking}
          className="text-sm"
        >
          Créer une réservation test
        </Button>
      </div>
    </div>
  );
};

export default InscriptionForm; 