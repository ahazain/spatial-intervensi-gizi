import React, { useState, useEffect } from "react";
import { useChildrenStore } from "../../stores/childrenStore";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { DataTable } from "../../components/ui/DataTable";
import { Button, ButtonLink } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Balita } from "../../types";
import { Plus, Edit2, Trash2, Search, AlertTriangle, X } from "lucide-react";

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

// Delete Confirmation Modal Component
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  childName: string;
  isDeleting: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  childName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hapus Data Balita
              </h3>
              <p className="text-sm text-gray-600">
                Apakah Anda yakin ingin menghapus data balita{" "}
                <span className="font-medium text-gray-900">"{childName}"</span>
                ?
              </p>
              <p className="text-xs text-red-600 mt-2">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1"
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menghapus...
                  </div>
                ) : (
                  "Hapus"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChildrenPage: React.FC = () => {
  const { children, initializeFromSupabase } = useChildrenStore();
  const { facilities, initializeFromSupabase: initializeFacilities } =
    useFacilitiesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    childId: string;
    childName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    childId: "",
    childName: "",
    isDeleting: false,
  });

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

  const openDeleteModal = (childId: string, childName: string) => {
    setDeleteModal({
      isOpen: true,
      childId,
      childName,
      isDeleting: false,
    });
  };

  const closeDeleteModal = () => {
    if (deleteModal.isDeleting) return; // Prevent closing while deleting
    setDeleteModal({
      isOpen: false,
      childId: "",
      childName: "",
      isDeleting: false,
    });
  };

  const handleDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await useChildrenStore.getState().deleteChild(deleteModal.childId);
      await initializeFromSupabase(); // refresh data
      closeDeleteModal();

      // Optional: Show success notification
      // You can integrate with a toast notification system here
      console.log("Data balita berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus data balita:", error);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));

      // Optional: Show error notification
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

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
                onClick={() => openDeleteModal(child.id, child.nama)}
              >
                Hapus
              </Button>
            </div>
          )}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        childName={deleteModal.childName}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default ChildrenPage;
