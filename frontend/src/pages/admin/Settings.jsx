import React, { useState } from "react";
import api from "../../api/api";

const AdminSettings = ({ initialSettings }) => {
  const [settings, setSettings] = useState({
    website_title: initialSettings.website_title || "",
    website_logo: null,
    footer_description: initialSettings.footer_description || "",
  });

  const [previewLogo, setPreviewLogo] = useState(initialSettings.website_logo || null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSettings((prev) => ({ ...prev, website_logo: e.target.files[0] }));
      setPreviewLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("website_title", settings.website_title);
    formData.append("footer_description", settings.footer_description);
    if (settings.website_logo) formData.append("website_logo", settings.website_logo);

    try {
      const res = await api.post("/admin/save-settings", formData);
      if (res.status === 200) alert("Settings saved successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings");
    }
  };

  return (
    <div className="bg-pale-yellow text-deep-green min-h-screen flex justify-center py-8">
      <div className="w-full max-w-3xl px-4">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
          <i className="fa fa-cog"></i> Settings
        </h1>

        <div className="bg-light-mint rounded-lg p-6 shadow-md w-full">
          <h5 className="text-xl font-semibold mb-4">Settings</h5>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Website Title */}
            <div>
              <label className="block font-medium mb-1">Website Title</label>
              <input
                type="text"
                name="website_title"
                value={settings.website_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded border border-deep-green bg-light-mint text-deep-green focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block font-medium mb-1">Upload Logo</label>
              {previewLogo && (
                <img src={previewLogo} alt="Logo" className="w-32 mb-3 rounded" />
              )}
              <input
                type="file"
                name="website_logo"
                id="fileInput"
                onChange={handleFileChange}
                className="hidden"
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
              <label className="block font-medium mb-1">Footer Description</label>
              <input
                type="text"
                name="footer_description"
                value={settings.footer_description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded border border-deep-green bg-light-mint text-deep-green focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="bg-muted-green text-white px-6 py-2 rounded hover:bg-deep-green transition"
              >
                Save
              </button>
            </div>

            {error && <p className="mt-2 text-red-600">{error}</p>}

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
