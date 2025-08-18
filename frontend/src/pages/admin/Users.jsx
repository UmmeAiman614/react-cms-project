import React, { useEffect, useState } from "react";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!users.length) return;

    const table = new Tabulator("#usersTable", {
      data: users,
      layout: "fitDataTable",
      responsiveLayout: false,
      pagination: true,
      paginationSize: 10,
      paginationSizeSelector: [5, 10, 25, 50, 100],
      resizableColumns: true,
      rowFormatter: function (row) {
        const index = row.getPosition(true);
        const el = row.getElement();
        el.style.backgroundColor = index % 2 === 0 ? "#93DA97" : "#C2E8C5";
        el.style.color = "#3E5F44";

        el.addEventListener("mouseenter", () => {
          el.style.backgroundColor = "#5E936C";
          el.style.color = "#fff";
        });
        el.addEventListener("mouseleave", () => {
          el.style.backgroundColor = index % 2 === 0 ? "#93DA97" : "#C2E8C5";
          el.style.color = "#3E5F44";
        });
      },
      columns: [
        { title: "S.No.", formatter: "rownum", hozAlign: "center", minWidth: 80 },
        { title: "Full Name", field: "fullname", headerFilter: "input", minWidth: 200 },
        { title: "User Name", field: "username", headerFilter: "input", minWidth: 200 },
        { title: "Role", field: "role", headerFilter: "input", minWidth: 150 },
        {
          title: "Actions",
          hozAlign: "center",
          headerSort: false,
          minWidth: 200,
          formatter: (cell) => {
            const id = cell.getRow().getData()._id;
            return `
              <div class="flex flex-row gap-1 justify-center">
                <button class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition" onclick="editUser('${id}')">Edit</button>
                <button class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition" onclick="deleteUser('${id}')">Delete</button>
              </div>
            `;
          },
        },
      ],
    });

    // Delete function
    window.deleteUser = async (id) => {
      if (window.confirm("Are you sure to delete this user?")) {
        try {
          const response = await api.delete(`/admin/delete-user/${id}`);
          if (response.status === 200) table.replaceData(users.filter(u => u._id !== id));
          else alert("Failed to delete user.");
        } catch (err) {
          console.error(err);
          alert("Error deleting user.");
        }
      }
    };

    window.editUser = (id) => navigate(`/admin/update-user/${id}`);
  }, [users, navigate]);

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <i className="fa fa-users"></i> All Users
          </h1>
          <button
            className="bg-muted-green text-white px-4 py-2 rounded hover:bg-deep-green transition w-full md:w-auto text-center"
            onClick={() => navigate("/admin/add-user")}
          >
            Add User
          </button>
        </div>

        <div className="flex justify-center">
          <div className="bg-light-mint rounded-lg shadow p-4 max-w-full md:max-w-[1200px] overflow-x-auto md:overflow-x-hidden">
            <div id="usersTable" className="min-w-[600px]"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
