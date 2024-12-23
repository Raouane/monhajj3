import { Check } from "lucide-react";

const reasons = [
  {
    title: "Expertise",
    description: "Plus de 15 ans d'expérience dans l'organisation de pèlerinages",
  },
  {
    title: "Accompagnement",
    description: "Une équipe dédiée à votre service 24/7",
  },
  {
    title: "Qualité",
    description: "Des prestations haut de gamme pour votre confort",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi Nous Choisir ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-primary rounded-full">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{reason.title}</h3>
              </div>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;