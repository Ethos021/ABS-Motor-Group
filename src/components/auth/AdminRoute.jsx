import React, { useEffect, useState } from "react";
import { localApi } from "@/api/localApiClient";
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
      const currentUser = await localApi.auth.me();
      
      if (!currentUser || currentUser.role !== 'admin') {
        // Not authorized - redirect to home
        navigate(createPageUrl('Home'));
        return setLoading(false);
      }
      
      setUser(currentUser);
    } catch (error) {
      // Not authenticated - redirect to home without external login
      navigate(createPageUrl('Home'));
    } finally {
      setLoading(false);
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
