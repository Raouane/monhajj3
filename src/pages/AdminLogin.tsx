import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { API_BASE_URL } from "@/config/api";
import { Eye, EyeOff } from "lucide-react";
import { initializeAdmin } from "@/utils/initAdmin";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "admin11@example.com",
    password: "admin123",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const loginData = {
        email: formData.email,
        password: formData.password
      };

      console.log('Tentative de connexion avec:', loginData);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log('Réponse de l\'API:', data);

      if (!response.ok) {
        throw new Error(data.message || "Erreur d'authentification");
      }

      if (!data.user || data.user.role !== 'admin') {
        throw new Error("Ce compte n'a pas les droits d'administrateur");
      }

      const authData = {
        token: data.token,
        role: data.user.role
      };

      if (rememberMe) {
        localStorage.setItem("adminToken", JSON.stringify(authData));
      } else {
        sessionStorage.setItem("adminToken", JSON.stringify(authData));
      }
      
      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Erreur complète:', error);
      if (error instanceof Error) {
        setError(`Erreur de connexion : ${error.message}`);
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    }
  };

  const handleInitAdmin = async () => {
    const result = await initializeAdmin();
    if (result) {
      alert("Compte admin initialisé avec succès !");
    } else {
      alert("Erreur lors de l'initialisation du compte admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Administration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous avec les identifiants admin
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Se souvenir de moi
              </Label>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 