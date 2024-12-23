import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative h-screen bg-gradient-to-br from-black via-[#1A1A1A] to-[#2C2C2C]">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FF9D00] bg-clip-text text-transparent mb-6 drop-shadow-lg">
              Votre Voyage Spirituel Commence Ici
            </h1>
            <p className="text-2xl text-white/90 mb-8 drop-shadow">
              Découvrez nos packages exclusifs pour le Hajj et l'Omra
            </p>
            <Button 
              className="bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold hover:from-[#FDB931] hover:to-[#FFD700] px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50"
              onClick={() => setIsTypeModalOpen(true)}
            >
              Réserver Maintenant
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;