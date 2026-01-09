import React from "react";

export default function GoogleMap({ address, height = 200 }) {
  // Generate Google Maps embed URL from address using standard embed format
  const getEmbedUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="mt-4 rounded-lg overflow-hidden">
      <iframe
        src={getEmbedUrl(address)}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}