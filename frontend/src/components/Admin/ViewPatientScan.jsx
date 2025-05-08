import React, { useEffect, useState } from "react";
import api from "../../api";
import { getUser } from "../../pages/admin/admin"

const ViewPatientScan = () => {
  const [scanUrl, setScanUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = localStorage.getItem("user");
  console.log("User from localStorage:", JSON.parse(user).id);
  const getUser = getUser(JSON.parse(user).id); 
  console.log("User from API:", getUser);

  useEffect(() => {
    useEffect(() => {
            const storedUser = localStorage.getItem("user");
          
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser?.id) {
                fetchUser(parsedUser.id);
              } else {
                console.error("User ID is missing from localStorage.");
              }
            } else {
              console.error("No user found in localStorage.");
            }
          }, []);
          
          const fetchUser = async (userId) => {
            try {
              const userData = await getUser(userId);
              console.log("User from API:", userData);
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          };
    const fetchScan = async () => {
      try {
        const imageUrl = userData.data?.scan_image;

        if (imageUrl) {
          setScanUrl(imageUrl);
        } else {
          setError("No scan uploaded yet.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch scan.");
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, []);

  if (loading) return <p>Loading your scan...</p>;

  return (
    <div className="p-4 bg-white border rounded shadow max-w-md">
      <h2 className="text-lg font-semibold mb-3">My Scan</h2>

      {error && <p className="text-red-500">{error}</p>}

      {scanUrl && (
        <div>
          <img
            src={scanUrl}
            alt="Patient Scan"
            className="w-full max-w-xs border rounded shadow"
          />
          <a
            href={scanUrl}
            download
            className="block mt-4 px-4 py-2 bg-green-600 text-white rounded text-center hover:bg-green-700"
          >
            Download Scan
          </a>
        </div>
      )}
    </div>
  );
};

export default ViewPatientScan;
