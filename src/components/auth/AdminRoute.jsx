import React, { useEffect, useState } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!User.isAuthenticated()) {
        // Not authenticated - redirect to home
        navigate(createPageUrl('Home'));
        return;
      }

      const currentUser = await User.getProfile();
      
      if (!currentUser || currentUser.role !== 'admin') {
        // Not authorized - redirect to home
        navigate(createPageUrl('Home'));
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      // Error getting profile - redirect to home
      navigate(createPageUrl('Home'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  return children;
}