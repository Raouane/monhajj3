import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import CreatePackageForm from "@/components/CreatePackageForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Package {
  _id: string;
  type: string;
  title: string;
  description: string;
  duration: number;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  remainingSpots: number;
  status: string;
}

const AdminPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

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
      fetchPackages(authData.token);
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchPackages = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/packages/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors du chargement");
      }

      const data = await response.json();
      console.log('Données reçues:', data);
      
      const packagesList = Array.isArray(data) ? data : data.packages || [];
      setPackages(packagesList);
    } catch (error) {
      console.error("Erreur:", error);
      if (error instanceof Error && error.message.includes('Non autorisé')) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce package ?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setPackages(packages.filter(pkg => pkg._id !== packageId));
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    const storedAuth = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      fetchPackages(authData.token);
    }
  };

  const handleEditSuccess = () => {
    setEditingPackage(null);
    const storedAuth = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      fetchPackages(authData.token);
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-2xl font-bold">Gestion des Packages</h1>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau Package
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Places restantes</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages && packages.length > 0 ? (
            packages.map((pkg) => (
              <TableRow key={pkg._id}>
                <TableCell className="capitalize">{pkg.type}</TableCell>
                <TableCell>{pkg.title}</TableCell>
                <TableCell>{pkg.price} €</TableCell>
                <TableCell>{pkg.capacity}</TableCell>
                <TableCell>{pkg.remainingSpots}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      pkg.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {pkg.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPackage(pkg)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(pkg._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Aucun package disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Créer un nouveau package
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-6">
            <CreatePackageForm onSuccess={handleCreateSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Modifier le package
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-6">
            <CreatePackageForm
              packageData={editingPackage}
              onSuccess={handleEditSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPackages; 