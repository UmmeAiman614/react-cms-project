import React, { useEffect, useState } from "react";
import { getFrontendSettings } from "../../api/api"; // same as header

const Footer = () => {
  const [settings, setSettings] = useState({ footer_description: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getFrontendSettings(); // same API as header
        setSettings(res || {}); // fallback to empty object if undefined
      } catch (err) {
        console.error("Error fetching footer settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-light-mint py-4 mt-auto shadow-inner">
      <div className="container mx-auto text-center text-deep-green">
        {settings.footer_description && settings.footer_description.trim() !== "" ? (
          <span>{settings.footer_description}</span>
        ) : (
          <span>
            © Copyright 2025 News | Powered by{" "}
            <a href="http://www.Aiman.com/" className="text-muted-green hover:text-deep-green">
              Yahu Baba
            </a>
          </span>
        )}
      </div>
    </footer>
  );
};

export default Footer;
