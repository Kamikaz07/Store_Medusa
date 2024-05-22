"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Medusa from "@medusajs/medusa-js";

// Configuração do cliente Medusa
const Backend_Url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '';
const medusa = new Medusa({ baseUrl: Backend_Url, maxRetries: 3 });

// Função personalizada para buscar os hero banners
const fetchHeroBanners = async () => {
  try {
    const response = await fetch(`${Backend_Url}/store/hero-banners`);
    if (!response.ok) {
      throw new Error("Failed to fetch hero banners");
    }
    const data = await response.json();
    return data.banners.map((banner: any) => ({
      ...banner,
      is_active: banner.is_active !== undefined ? banner.is_active : true // Garantir que is_active tenha um valor padrão
    }));
  } catch (error) {
    console.error("Error fetching hero banners:", error);
    throw error;
  }
};

// Tipo de Banner
type Banner = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  mid_text?: string;
  button_text?: string;
  button_url?: string;
  start_date?: string;
  end_date?: string;
  discount?: string;
  background_color?: string;
  is_active?: boolean;
};

const HeroBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    console.log("HeroBanner mounted");
    fetchHeroBanners()
      .then((data) => {
        console.log("Fetched banners:", data); // Log the fetched data
        setBanners(data);
      })
      .catch((error) => {
        console.error("Error fetching hero banners:", error);
      });
    return () => {
      console.log("HeroBanner unmounted");
    };
  }, []);

  return (
    <div className="hero-banner-container">
      {banners.filter(banner => banner.is_active).map((banner, index) => (
        <div key={banner.id} style={{ backgroundColor: banner.background_color || '#dcdcdc' }} className="hero-banner p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between relative">
          
          <div className="hero-banner-text md:w-1/3 flex flex-col justify-between">
            <div>
              <p className="text-lg font-medium text-gray-700">{banner.start_date && banner.end_date && new Date(banner.start_date).toLocaleDateString()} - {banner.start_date && banner.end_date && new Date(banner.end_date).toLocaleDateString()}</p>
              <h1 className="text-6xl font-extrabold text-black mt-2">{banner.title}</h1>
              <h1 className="text-6xl font-extrabold text-white mt-2">{banner.discount} Off</h1>
            </div>
            <div className="mt-4">
              {banner.button_text && banner.button_url && (
                <Link href={banner.button_url} legacyBehavior>
                  <a className="mt-6 inline-block bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    {banner.button_text}
                  </a>
                </Link>
              )}
            </div>
          </div>
          
          <div className="hero-banner-image md:w-1/3 flex justify-center">
            <Image 
              src={banner.image_url} 
              alt={banner.title} 
              className="hero-banner-image" 
              width={450} 
              height={450} 
              priority={index === 0}
            />
          </div>
          <div className="desc md:w-1/3 flex flex-col justify-end">
            <div className="mt-4 inline-flex">
              <h1 className="text-lg font-extrabold text-gray-600 text-center">{banner.description}</h1>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default HeroBanner;
