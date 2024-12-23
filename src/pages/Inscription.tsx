import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InscriptionForm from "@/components/InscriptionForm";

const Inscription = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Formulaire d'Inscription
            </h2>
            <InscriptionForm />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Inscription; 