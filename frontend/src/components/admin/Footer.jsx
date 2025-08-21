// src/components/admin/Footer.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const Footer = () => {
  const [footerDesc, setFooterDesc] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/admin/settings", { withCredentials: true });
        setFooterDesc(res.data.footer_description || "");
      } catch (err) {
        console.error("Error fetching footer description:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-muted-green text-white text-center py-3 mt-auto">
      <div className="container mx-auto">
        <span>{footerDesc}</span>
      </div>
    </footer>
  );
};

export default Footer;
