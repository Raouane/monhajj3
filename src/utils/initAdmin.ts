import { API_BASE_URL } from "@/config/api";

export const initializeAdmin = async () => {
  try {
    const adminData = {
      email: "admin2025@hajj.com",
      password: "Admin123!",
      firstName: "Admin",
      lastName: "System",
      phoneNumber: "+33600000000"
    };

    console.log('Tentative de création admin avec:', adminData);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(adminData)
    });

    const data = await response.json();
    console.log('Réponse complète:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création');
    }

    return data;
  } catch (error) {
    console.error('Erreur détaillée:', error);
    return null;
  }
}; 