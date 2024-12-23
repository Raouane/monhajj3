import HeroSection from "@/components/HeroSection";
import OfferCard from "@/components/OfferCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";

const fetchPackages = async () => {
  const response = await fetch(`${API_BASE_URL}/packages`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

const Index = () => {
  const { data: packagesData, isLoading, error } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
  });

  console.log("API Response:", packagesData);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Erreur lors du chargement des offres</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1A1A1A] to-[#2C2C2C]">
      <Navbar />
      <HeroSection />
      
      {/* Section Packages */}
      <section id="packages-section" className="py-16 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FF9D00] bg-clip-text text-transparent mb-12">
            Nos Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packagesData?.packages && packagesData.packages.length > 0 ? (
              packagesData.packages.map((offer) => (
                <OfferCard
                  key={offer._id}
                  id={offer._id}
                  title={offer.title}
                  price={`${offer.price} €`}
                  duration={`${offer.duration} jours`}
                  location={offer.type === 'hajj' ? 'La Mecque' : 'Médine'}
                  imageUrl={
                    offer.type === 'hajj' 
                      ? '/images/hajj.jpg' 
                      : '/images/omra.jpg'
                  }
                />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                Aucune offre disponible pour le moment
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-16 bg-gradient-to-t from-black to-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FF9D00] bg-clip-text text-transparent mb-12">
            Pourquoi Nous Choisir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cartes d'avantages */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;