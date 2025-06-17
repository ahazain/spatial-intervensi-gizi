import React, { useState, useEffect } from "react";
import { useChildrenStore } from "../../stores/childrenStore";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { DataTable } from "../../components/ui/DataTable";
import { Button, ButtonLink } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Balita } from "../../types";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

// StatusBadge component integrated directly
interface StatusBadgeProps {
  status: Balita["status_nutrisi"] | null | undefined;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Define status configuration matching the Balita interface exactly
  const statusConfig: Record<
    Balita["status_nutrisi"],
    { text: string; color: string }
  > = {
    normal: {
      text: "Normal",
      color: "bg-green-100 text-green-800",
    },
    kurang: {
      text: "Kurang",
      color: "bg-yellow-100 text-yellow-800",
    },
    buruk: {
      text: "Buruk",
      color: "bg-red-100 text-red-800",
    },
    stunting: {
      text: "Stunting",
      color: "bg-red-100 text-red-800",
    },
  };

  // Handle null or undefined status
  if (!status) {
    console.warn("StatusBadge received null/undefined status");
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Status Tidak Diketahui
      </span>
    );
  }

  // Check if status is one of the expected values
  const validStatuses: Array<Balita["status_nutrisi"]> = [
    "normal",
    "buruk",
    "kurang",
    "stunting",
  ];

  if (!validStatuses.includes(status)) {
    console.error(`StatusBadge received invalid status: "${status}"`);
    console.log("Valid statuses are:", validStatuses);
    console.log("Received status type:", typeof status);

    // Return the raw status with a generic style
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {String(status)}
      </span>
    );
  }

  // Get the configuration for the valid status
  const config = statusConfig[status];
  const { text, color } = config;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {text}
    </span>
  );
};

const ChildrenPage: React.FC = () => {
  const { children, initializeFromSupabase } = useChildrenStore();
  const { facilities, initializeFromSupabase: initializeFacilities } =
    useFacilitiesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([initializeFromSupabase(), initializeFacilities()]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [initializeFromSupabase, initializeFacilities]);

  // Debug: Log children data to check status_nutrisi values
  useEffect(() => {
    if (children.length > 0) {
      console.log("=== DEBUGGING STATUS NUTRISI VALUES ===");
      console.log("Children data:", children);

      // Check each child's status_nutrisi
      children.forEach((child, index) => {
        console.log(`Child ${index + 1} (${child.nama}):`, {
          status_nutrisi: child.status_nutrisi,
          status_type: typeof child.status_nutrisi,
          status_raw: JSON.stringify(child.status_nutrisi),
          is_null: child.status_nutrisi === null,
          is_undefined: child.status_nutrisi === undefined,
        });
      });

      // Get unique status values
      const uniqueStatuses = [
        ...new Set(children.map((child) => child.status_nutrisi)),
      ];
      console.log("Unique status values found:", uniqueStatuses);

      // Check which ones are not in expected values
      const expectedStatuses = ["normal", "buruk", "kurang", "stunting"];
      const unexpectedStatuses = uniqueStatuses.filter(
        (status) =>
          status !== null &&
          status !== undefined &&
          !expectedStatuses.includes(status)
      );

      if (unexpectedStatuses.length > 0) {
        console.warn("⚠️ UNEXPECTED STATUS VALUES FOUND:", unexpectedStatuses);
        console.warn("Expected values are:", expectedStatuses);
      }

      console.log("=== END DEBUGGING ===");
    }
  }, [children]);

  const filteredChildren = children.filter((child) => {
    // Add null/undefined checks
    if (!child || !child.nama) return false;
    return child.nama.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getFacilityName = (facilityId: string) => {
    if (!facilityId || !facilities.length) return "Unknown Facility";
    const facility = facilities.find((f) => f.id === facilityId);
    return facility ? facility.nama : "Unknown Facility";
  };

  const columns = [
    {
      header: "ID",
      accessor: (child: Balita) =>
        child.id ? child.id.split("-")[1] || child.id.substring(0, 8) : "N/A",
      className: "w-20",
    },
    {
      header: "Nama",
      accessor: (child: Balita) => child.nama || "Nama tidak tersedia",
    },
    {
      header: "Status Gizi",
      accessor: (child: Balita) => {
        try {
          // Add safety check before passing to StatusBadge
          const status = child.status_nutrisi;
          console.log(
            `Rendering StatusBadge for child ${child.nama} with status:`,
            status,
            typeof status
          );
          return <StatusBadge status={status} />;
        } catch (error) {
          console.error(
            `Error rendering StatusBadge for child ${child.nama}:`,
            error
          );
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Error
            </span>
          );
        }
      },
    },
    {
      header: "Fasilitas Kesehatan",
      accessor: (child: Balita) =>
        getFacilityName(child.fasilitas_kesehatan_id),
      className: "w-48",
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Data Balita"
        description="Manajemen data balita"
        actions={
          <ButtonLink
            to="/dashboard/children/add"
            variant="primary"
            leftIcon={<Plus size={16} />}
          >
            Tambah Balita
          </ButtonLink>
        }
      />

      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="w-full sm:w-80">
            <label htmlFor="search" className="sr-only">
              Cari
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Cari berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Total: {filteredChildren.length} balita
          </div>
        </div>

        <DataTable<Balita>
          columns={columns}
          data={filteredChildren}
          keyField="id"
          actions={(child) => (
            <div className="flex justify-end space-x-2">
              <ButtonLink
                to={`/dashboard/children/edit/${child.id}`}
                variant="ghost"
                size="sm"
                leftIcon={<Edit2 size={16} />}
              >
                Edit
              </ButtonLink>

              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 size={16} className="text-red-500" />}
                className="text-red-500 hover:bg-red-50"
                // onClick={() => handleDelete(child.id)}
              >
                Hapus
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ChildrenPage;
