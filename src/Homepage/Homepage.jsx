import React, { useState, useEffect } from "react";
import banner from "./img/banner.png";
import banner2 from "./img/banner2.webp";
import banner3 from "./img/banner3.webp";
import "./Homepage.style.css";

const Homepage = () => {
  const images = [banner, banner2, banner3]; // Use the direct paths without brackets
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      <div
        className="banner-container"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
        }}
      >
        <div className="text-container">
          <div>
            <h2 className="font">신선한 재료로 완벽한 요리를!</h2>
          </div>
          <div>
            <h2 className="font">레시피 추천을 받아보세요</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
