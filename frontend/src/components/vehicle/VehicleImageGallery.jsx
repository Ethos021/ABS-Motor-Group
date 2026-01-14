import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, Eye } from "lucide-react";

export default function VehicleImageGallery({ vehicle }) {
  const [mainImage, setMainImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);

  const images = vehicle.images || [
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop"
  ];

  const nextImage = () => {
    setMainImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setMainImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index) => {
    setLightboxImage(index);
    setShowLightbox(true);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-video rounded-2xl overflow-hidden luxury-shadow">
        <img 
          src={images[mainImage]} 
          alt={`${vehicle.make} ${vehicle.model} - Image ${mainImage + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Zoom/View Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openLightbox(mainImage)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
        >
          <ZoomIn className="w-4 h-4 mr-2" />
          View Full Size
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {mainImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-6 gap-2">
        {images.slice(0, 12).map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(index)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
              mainImage === index ? 'border-red-500' : 'border-transparent hover:border-zinc-600'
            }`}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
        
        {/* Show More Button if there are more images */}
        {images.length > 12 && (
          <button
            onClick={() => openLightbox(12)}
            className="aspect-square rounded-lg overflow-hidden bg-zinc-800 border-2 border-zinc-700 hover:border-zinc-600 transition-all hover:scale-105 flex items-center justify-center"
          >
            <div className="text-center">
              <Eye className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
              <span className="text-xs text-zinc-400">+{images.length - 12}</span>
            </div>
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <img 
              src={images[lightboxImage]} 
              alt={`${vehicle.make} ${vehicle.model} - Full size`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Navigation in Lightbox */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLightboxImage((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLightboxImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {lightboxImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}