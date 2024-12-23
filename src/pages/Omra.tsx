import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfferCard from "@/components/OfferCard";
import FAQ from "@/components/FAQ";

const omraFAQItems = [
  {
    question: "Quelle est la différence entre le Hajj et l'Omra ?",
    answer: "L'Omra est le petit pèlerinage qui peut être effectué tout au long de l'année, contrairement au Hajj qui a lieu à des dates précises. L'Omra est plus courte et comporte moins de rituels."
  },
  {
    question: "Quand peut-on effectuer l'Omra ?",
    answer: "L'Omra peut être effectuée tout au long de l'année. Cependant, certaines périodes sont particulièrement prisées comme le Ramadan ou les vacances scolaires."
  },
  {
    question: "Quelle est la durée moyenne d'une Omra ?",
    answer: "Nos packages Omra durent généralement entre 10 et 15 jours, permettant d'effectuer les rituels sereinement et de visiter les lieux saints."
  },
  {
    question: "Les femmes peuvent-elles faire l'Omra seules ?",
    answer: "Les femmes doivent être accompagnées d'un Mahram (mari ou proche parent) pour effectuer l'Omra. Nous pouvons vous conseiller sur les solutions possibles."
  },
  {
    question: "Que comprennent vos packages Omra ?",
    answer: "Nos packages incluent les vols, l'hébergement en hôtel, les transferts, l'accompagnement spirituel, les visites des lieux saints et l'assurance voyage."
  }
];

const fetchOmraPackages = async () => {
  const response = await fetch(`${API_BASE_URL}/packages?type=omra`);
  if (!response.ok) throw new Error("Erreur lors du chargement");
  return response.json();
};

const Omra = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["omra-packages"],
    queryFn: fetchOmraPackages,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            Packages Omra
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Découvrez nos offres pour le petit pèlerinage à La Mecque. Des séjours spirituels adaptés à tous les budgets.
          </p>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.packages.map((offer) => (
                <OfferCard
                  key={offer._id}
                  id={offer._id}
                  title={offer.title}
                  price={`${offer.price} €`}
                  duration={`${offer.duration} jours`}
                  location="La Mecque"
                  imageUrl="/images/omra.jpg"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <FAQ 
        title="Questions fréquentes sur l'Omra" 
        items={omraFAQItems} 
      />
      <Footer />
    </div>
  );
};

export default Omra; 