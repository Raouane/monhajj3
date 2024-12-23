import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/config/api";
import { ImagePlus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PackageFormData {
  type: "hajj" | "omra";
  title: string;
  description?: string;
  duration?: number;
  startDate?: string;
  endDate?: string;
  price: number;
  capacity?: number;
  includes?: string[];
  itinerary?: Array<{
    day?: number;
    description?: string;
  }>;
}

interface Props {
  packageData?: PackageFormData;
  onSuccess: () => void;
}

const DESCRIPTION_TEMPLATES = {
  hajj: [
    "Forfait Hajj Premium tout inclus avec hébergement 5 étoiles à proximité des lieux saints. Transport, repas et accompagnement spirituel inclus.",
    "Package Hajj complet avec guide francophone, hôtels confortables et transferts privés. Idéal pour un premier pèlerinage.",
    "Formule Hajj avec logements sélectionnés, transport et assistance 24/7. Groupe limité pour un meilleur accompagnement."
  ],
  omra: [
    "Package Omra Ramadan avec séjour dans des hôtels de luxe. Transport et repas inclus pour un pèlerinage serein.",
    "Formule Omra complète avec vols, transferts et hébergement de qualité. Guide expérimenté et programme spirituel.",
    "Offre Omra avec logements proche de la Mosquée Sacrée. Transferts privés et assistance permanente inclus."
  ]
};

const CreatePackageForm = ({ packageData, onSuccess }: Props) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PackageFormData>(packageData || {
    type: "hajj",
    title: "",
    description: "",
    price: 0,
    includes: ["Transport", "Hébergement"],
    itinerary: [{ day: 1, description: "Journée d'arrivée" }]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof PackageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setFormData(prev => ({
      ...prev,
      description: template
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      alert("Le titre, le prix et la description sont obligatoires");
      return;
    }

    try {
      setSubmitting(true);
      const storedAuth = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
      if (!storedAuth) {
        throw new Error("Non authentifié");
      }
      const authData = JSON.parse(storedAuth);

      // Structure exacte attendue par l'API avec champs requis
      const cleanedData = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),  // Maintenant requis
        duration: formData.duration || 1,          // Valeur par défaut à 1
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: Number(formData.price),
        capacity: formData.capacity || 10,         // Valeur par défaut à 10
        remainingSpots: formData.capacity || 10,
        includes: formData.includes?.filter(Boolean) || ["Transport", "Hébergement"],  // Valeurs par défaut
        itinerary: formData.itinerary?.filter(item => item.description || item.day).map(item => ({
          day: item.day || 1,
          description: item.description || "Journée libre"
        })) || [{ day: 1, description: "Journée d'arrivée" }],  // Valeur par défaut
        status: "active"
      };

      console.log('Données envoyées:', cleanedData);

      const response = await fetch(`${API_BASE_URL}/admin/packages`, {
        method: packageData ? "PUT" : "POST",
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      });

      const responseData = await response.json();
      console.log('Réponse du serveur:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Erreur lors de la sauvegarde");
      }

      toast({
        title: packageData ? "Package modifié" : "Package créé",
        description: packageData 
          ? `Le package "${formData.title}" a été mis à jour avec succès.`
          : `Le package "${formData.title}" a été créé avec succès. Il est maintenant disponible à la réservation.`,
        variant: "success",
        duration: 5000,
      });

      onSuccess();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Upload d'image */}
      <div className="space-y-2">
        <Label>Image du package</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Ajouter une image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Type de package */}
      <div className="space-y-2">
        <Label>Type de package</Label>
        <select
          value={formData.type}
          onChange={e => handleChange('type', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="hajj">Hajj</option>
          <option value="omra">Omra</option>
        </select>
      </div>

      {/* Titre */}
      <div className="space-y-2">
        <Label>Titre</Label>
        <Input
          value={formData.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="Ex: Hajj Premium 2024"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="space-y-4">
          <Textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Description détaillée du package..."
            className="min-h-[100px]"
          />
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-500">Suggestions de description :</Label>
            <div className="grid gap-2">
              {DESCRIPTION_TEMPLATES[formData.type].map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left text-sm p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {template.length > 100 ? template.slice(0, 100) + '...' : template}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dates et durée */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Date de début <span className="text-gray-400 text-sm">(optionnel)</span></Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={e => handleChange('startDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Date de fin <span className="text-gray-400 text-sm">(optionnel)</span></Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={e => handleChange('endDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Durée (jours) <span className="text-gray-400 text-sm">(optionnel)</span></Label>
          <Input
            type="number"
            value={formData.duration}
            onChange={e => handleChange('duration', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Prix et capacité */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prix (€)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={e => handleChange('price', Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Capacité <span className="text-gray-400 text-sm">(optionnel)</span></Label>
          <Input
            type="number"
            value={formData.capacity}
            onChange={e => handleChange('capacity', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Services inclus */}
      <div className="space-y-4">
        <Label>Services inclus <span className="text-gray-400 text-sm">(optionnel)</span></Label>
        {formData.includes?.map((_, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={formData.includes[index]}
              onChange={e => handleChange(`includes.${index}`, e.target.value)}
              placeholder={`Service ${index + 1}`}
            />
            {index > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const includes = formData.includes?.filter((_, i) => i !== index);
                  handleChange('includes', includes);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const includes = formData.includes;
            handleChange('includes', [...includes, ""]);
          }}
        >
          Ajouter un service
        </Button>
      </div>

      {/* Itinéraire */}
      <div className="space-y-4">
        <Label>Itinéraire <span className="text-gray-400 text-sm">(optionnel)</span></Label>
        {formData.itinerary?.map((_, index) => (
          <div key={index} className="grid grid-cols-[auto,1fr] gap-4">
            <Input
              type="number"
              value={formData.itinerary[index].day}
              onChange={e => handleChange(`itinerary.${index}.day`, Number(e.target.value))}
              className="w-20"
              placeholder="Jour"
            />
            <div className="flex gap-2">
              <Input
                value={formData.itinerary[index].description}
                onChange={e => handleChange(`itinerary.${index}.description`, e.target.value)}
                placeholder="Description de l'étape"
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const itinerary = formData.itinerary?.filter((_, i) => i !== index);
                    handleChange('itinerary', itinerary);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const itinerary = formData.itinerary;
            handleChange('itinerary', [...itinerary, { day: itinerary.length + 1, description: "" }]);
          }}
        >
          Ajouter une étape
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Enregistrement..." : (packageData ? "Modifier" : "Créer")}
      </Button>
    </form>
  );
};

export default CreatePackageForm; 