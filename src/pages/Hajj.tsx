import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfferCard from "@/components/OfferCard";
import FAQ from "@/components/FAQ";

const fetchHajjPackages = async () => {
  const response = await fetch(`${API_BASE_URL}/packages?type=hajj`);
  if (!response.ok) throw new Error("Erreur lors du chargement");
  return response.json();
};

const hajjFAQItems = [
  {
    question: "Quelles sont les conditions pour effectuer le Hajj ?",
    answer: "Pour effectuer le Hajj, il faut être musulman, majeur, sain d'esprit et avoir les moyens financiers et physiques. Il est également nécessaire d'avoir un visa spécial Hajj."
  },
  {
    question: "Quelle est la meilleure période pour réserver son Hajj ?",
    answer: "Il est recommandé de réserver son Hajj au moins 6 à 8 mois à l'avance pour bénéficier des meilleures offres et s'assurer d'avoir une place, car le nombre de visas est limité."
  },
  {
    question: "Que comprennent vos packages Hajj ?",
    answer: "Nos packages Hajj comprennent le vol aller-retour, l'hébergement en hôtel, les transferts sur place, l'accompagnement spirituel, l'assurance voyage et tous les déplacements liés aux rituels."
  },
  {
    question: "Comment se déroule la préparation au Hajj ?",
    answer: "Nous organisons plusieurs séances de préparation avant le départ, couvrant les aspects spirituels, pratiques et logistiques du pèlerinage. Un guide détaillé est fourni à chaque pèlerin."
  },
  {
    question: "Quel type d'accompagnement proposez-vous sur place ?",
    answer: "Nos groupes sont accompagnés par des guides expérimentés parlant français et arabe. Ils sont disponibles 24h/24 et assurent l'encadrement spirituel et logistique pendant tout le séjour."
  }
];

const Hajj = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["hajj-packages"],
    queryFn: fetchHajjPackages,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            Packages Hajj
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Découvrez nos offres pour le grand pèlerinage à La Mecque. Des packages complets incluant vol, hébergement et accompagnement spirituel.
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
                  imageUrl="/images/hajj.jpg"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <FAQ 
        title="Questions fréquentes sur le Hajj" 
        items={hajjFAQItems} 
      />
      <Footer />
    </div>
  );
};

export default Hajj; 