import { Link, useLocation } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail 
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { user } = useAuth();
  const location = useLocation()


  if (user && user.role === "admin") return null;
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className="w-10 h-10"
      >
        <circle cx="50" cy="50" r="45" fill="#FFB7C5" />
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontSize="50" 
          fontWeight="bold" 
          fill="#8B4513"
        >
          日本
        </text>
      </svg>
      <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Learn</span>
    </div>
  );

  return (
    <footer className="bg-gray-100 dark:bg-zinc-900 py-8 px-4 mt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Logo />
          <ul className="space-y-2 mt-4">
            <li><Link to="/learn" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Learn Vocab</Link></li>
            <li><Link to="/kanji" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Kanji Study</Link></li>
            <li><Link to="/practice" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Practice Tests</Link></li>
            <li><Link to="/progress" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">My Progress</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Resources</h3>
          <ul className="space-y-2">
            <li><Link to="/blog" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Learning Blog</Link></li>
            <li><Link to="/grammar-guides" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Grammar Guides</Link></li>
            <li><Link to="/pronunciation" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Pronunciation Tips</Link></li>
            <li><Link to="/dictionary" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Vocab Dictionary</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Community</h3>
          <ul className="space-y-2">
            <li><Link to="/forums" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Discussion Forums</Link></li>
            <li><Link to="/study-groups" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Study Groups</Link></li>
            <li><Link to="/events" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Events & Workshops</Link></li>
            <li><Link to="/leaderboard" className="text-gray-600 dark:text-gray-200 hover:text-blue-600">Leaderboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Connect With Us</h3>
          <div className="flex space-x-4 mb-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-200 hover:text-blue-700">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-200 hover:text-blue-400">
              <Twitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-200 hover:text-pink-600">
              <Instagram size={24} />
            </a>
          
          </div>
          <div>
            <a 
              href="mailto:support@nihonlearn.com" 
              className="flex items-center text-gray-600 dark:text-gray-200 hover:text-blue-600"
            >
              <Mail size={18} className="mr-2" /> support@nihonlearn.com
            </a>
          </div>
        </div>
      </div>


      <div className="border-t lg:mb-0 md:mb-0 mb-20 border-gray-200 mt-8 pt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          © {currentYear} ~日本~ Learn. All Rights Reserved.
          <span className="ml-4">
            <Link to="/privacy" className="hover:text-blue-600 mr-3">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;