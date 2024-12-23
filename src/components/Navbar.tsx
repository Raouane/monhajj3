import { Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import PackageTypeModal from "./PackageTypeModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import './ui/sheet.css';

const Navbar = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  // Fonction pour scroller vers la section des packages
  const scrollToPackages = () => {
    const packagesSection = document.getElementById('packages-section');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Si on n'est pas sur la page d'accueil, rediriger vers la page d'accueil + section packages
      navigate('/#packages-section');
    }
  };

  const renderAuthButton = () => {
    if (userToken) {
      return (
        <>
          <div 
            className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md" 
            onClick={() => navigate("/mes-reservations")}
          >
            Mes réservations
          </div>
          <div 
            className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md" 
            onClick={() => {
              localStorage.removeItem("userToken");
              navigate("/");
            }}
          >
            Déconnexion
          </div>
        </>
      );
    }
    return (
      <div 
        className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md" 
        onClick={() => navigate("/connexion")}
      >
        Connexion
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A] border-b border-[#2A2A2A] shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-[300px] sm:w-[400px] bg-gradient-to-br from-gold to-gold-hover border-r border-black/20 overflow-y-auto"
                >
                  <button 
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                    onClick={() => document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed')}
                  >
                    <X className="h-6 w-6 text-black" />
                    <span className="sr-only">Fermer</span>
                  </button>

                  <nav className="flex flex-col gap-4 pt-8 pb-20">
                    <div className="px-4 py-2 font-medium text-black">Menu</div>
                    <div 
                      className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md" 
                      onClick={() => navigate("/")}
                    >
                      Accueil
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md" 
                      onClick={() => navigate("/hajj")}
                    >
                      Hajj
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md" 
                      onClick={() => navigate("/omra")}
                    >
                      Omra
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md"
                    >
                      À Propos
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md"
                    >
                      Contact
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-black/10 cursor-pointer text-black transition-colors rounded-md" 
                      onClick={() => {
                        setIsTypeModalOpen(true);
                      }}
                    >
                      S'inscrire
                    </div>
                    <div className="border-t border-black/20 my-2" />
                    {renderAuthButton()}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="flex items-center flex-1 justify-center md:justify-start">
              <a href="/" className="text-xl font-bold text-[#FFD700]">
                Hajj & Omra
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Nos Offres</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px]">
                        <NavigationMenuLink
                          href="#"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Hajj</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Découvrez nos offres pour le grand pèlerinage
                          </p>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          href="#"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Omra</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explorez nos forfaits pour le petit pèlerinage
                          </p>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      À Propos
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      Contact
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <button 
                      onClick={() => setIsTypeModalOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-[#FFD700] rounded-md hover:bg-[#FFC000]"
                    >
                      S'inscrire
                    </button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {userToken ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/mes-reservations")}>
                      Mes réservations
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        localStorage.removeItem("userToken");
                        navigate("/");
                      }}
                    >
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/connexion")}
                  className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A1A1A]"
                >
                  Connexion
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <PackageTypeModal 
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
      />
    </>
  );
};

export default Navbar;