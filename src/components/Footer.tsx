import React from "react";
import { Heart, Sparkles } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>vibe coded with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
          </div>
          <div className="text-center">
            <a
              href="https://github.com/mehulmorker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-cyan-600 hover:to-indigo-700 transition-all duration-300 cursor-pointer inline-block"
              aria-label="Visit Mehul Morker's GitHub profile"
            >
              Mehul Morker
            </a>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Crafted with passion and attention to detail
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
