import React, { useEffect, useState } from "react";
import api from "../../api/api"; // <-- correct relative path
import Layout from "../../components/admin/Layout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard"); // adjust your backend endpoint
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bgCard text-textPrimary p-6 rounded shadow flex flex-col items-center">
            <i className="fa fa-file-text text-3xl mb-2"></i>
            <h4>Articles</h4>
            <h2 className="text-2xl font-bold">{stats.articles}</h2>
          </div>
          <div className="bg-accent text-white p-6 rounded shadow flex flex-col items-center">
            <i className="fa fa-gears text-3xl mb-2"></i>
            <h4>Categories</h4>
            <h2 className="text-2xl font-bold">{stats.categories}</h2>
          </div>
          <div className="bg-bgCard text-textPrimary p-6 rounded shadow flex flex-col items-center">
            <i className="fa fa-users text-3xl mb-2"></i>
            <h4>Users</h4>
            <h2 className="text-2xl font-bold">{stats.users}</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
