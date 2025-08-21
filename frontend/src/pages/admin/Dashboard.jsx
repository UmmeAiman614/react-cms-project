import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { FaCubes, FaFileAlt, FaCogs, FaUsers } from "react-icons/fa";
import Layout from "../../components/admin/Layout";

const Dashboard = () => {
  const [data, setData] = useState({
    fullname: "",
    role: "",
    articlesCount: 0,
    categoriesCount: 0,
    usersCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        console.log("Dashboard API response:", res.data);

        setData({
          fullname: res.data.fullname || "",
          role: res.data.role || "",
          articlesCount: res.data.articlesCount || 0,
          categoriesCount: res.data.categoriesCount || 0,
          usersCount: res.data.usersCount || 0,
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="p-4 bg-pale-yellow min-h-screen text-deep-green">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2">
              <FaCubes />
              Dashboard
              <small className="text-deep-green text-2xl font-normal w-full sm:w-auto">
                | Hello {data.fullname ? data.fullname : "User"}
              </small>
            </h1>
          </div>

          {/* Dashboard Blocks */}
          <div className="flex flex-wrap -mx-2">
            {/* Articles Block */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
              <div className="bg-deep-green text-white rounded-lg shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition">
                <FaFileAlt className="text-3xl mb-2" />
                <h4 className="text-lg font-semibold text-center">Articles</h4>
                <h1 className="text-2xl font-bold mt-2">
                  {data.articlesCount}
                </h1>
              </div>
            </div>

            {/* Categories Block */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
              <div className="bg-muted-green text-white rounded-lg shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition">
                <FaCogs className="text-3xl mb-2" />
                <h4 className="text-lg font-semibold text-center">
                  Categories
                </h4>
                <h1 className="text-2xl font-bold mt-2">
                  {data.categoriesCount}
                </h1>
              </div>
            </div>

            {/* Users Block (Admin only) */}
            {data.role === "admin" && (
              <div className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                <div className="bg-light-mint text-deep-green rounded-lg shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition">
                  <FaUsers className="text-3xl mb-2" />
                  <h4 className="text-lg font-semibold text-center">Users</h4>
                  <h1 className="text-2xl font-bold mt-2">
                    {data.usersCount}
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
