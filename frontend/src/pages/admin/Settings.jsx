// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api"; 
import Layout from "../../components/admin/Layout";

const Settings = () => {
  const [settings, setSettings] = useState({
    website_title: "",
    website_logo: "",
    footer_description: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [file, setFile] = useState(null);

  // ✅ Load existing settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/admin/settings", { withCredentials: true });
        setSettings(res.data);
        if (res.data.website_logo) {
          setLogoPreview(`http://localhost:3000/uploads/${res.data.website_logo}`);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("website_title", settings.website_title);
    formData.append("footer_description", settings.footer_description);
    if (file) {
      formData.append("website_logo", file);
    }

    try {
      await api.post("/admin/save-settings", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings");
    }
  };

  return (
    <Layout>
      <main className="flex-grow flex justify-center items-start py-8 bg-pale-yellow">
        <div id="admin-content" className="w-full max-w-3xl px-4">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2 text-deep-green">
              <i className="fa fa-cog"></i> Settings
            </h1>
          </div>

          {/* Card */}
          <div className="bg-light-mint rounded-lg p-6 shadow-md w-full border border-muted-green">
            <h5 className="text-xl font-semibold mb-4 text-deep-green">Settings</h5>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Website Title */}
              <div>
                <label className="block font-medium mb-1 text-deep-green">Website Title</label>
                <input
                  type="text"
                  name="website_title"
                  value={settings.website_title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border border-deep-green bg-pale-yellow text-deep-green focus:outline-none focus:ring-2 focus:ring-light-mint"
                />
              </div>

              {/* Upload Logo */}
              <div>
                <label className="block font-medium mb-1 text-deep-green">Upload Logo</label>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="w-32 mb-3 rounded border border-muted-green" />
                )}
                <input
                  type="file"
                  name="website_logo"
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileInput"
                  className="inline-block px-4 py-2 rounded bg-muted-green text-white cursor-pointer hover:bg-deep-green transition"
                >
                  Choose File
                </label>
              </div>

              {/* Footer Description */}
              <div>
                <label className="block font-medium mb-1 text-deep-green">Footer Description</label>
                <input
                  type="text"
                  name="footer_description"
                  value={settings.footer_description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border border-deep-green bg-pale-yellow text-deep-green focus:outline-none focus:ring-2 focus:ring-light-mint"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="bg-deep-green text-white px-6 py-2 rounded hover:bg-muted-green transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Settings;
