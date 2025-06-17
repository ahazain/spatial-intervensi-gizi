import React, { useState } from "react";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { DataTable } from "../../components/ui/DataTable";
import { ButtonLink } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { PopUpFailitasKesehatan } from "../../types";
import { Plus, Edit2, Search } from "lucide-react";

const FacilitiesPage: React.FC = () => {
  const { facilities } = useFacilitiesStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFacilities = facilities.filter((facility) => {
    // Pastikan nilai tidak null/undefined sebelum memanggil toLowerCase()
    const facilityName = facility.fasilitas_nama?.toLowerCase() || "";
    const kecamatanName = facility.kecamatan_nama?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    return (
      facilityName.includes(searchLower) || kecamatanName.includes(searchLower)
    );
  });

  const columns = [
    {
      header: "Nama Fasilitas",
      accessor: (facility: PopUpFailitasKesehatan) => facility.fasilitas_nama,
    },
    {
      header: "Tipe",
      accessor: (facility: PopUpFailitasKesehatan) =>
        facility.type === "puskesmas"
          ? "Puskesmas"
          : facility.type === "pustu"
          ? "Pustu"
          : "Rumah Sakit",
      className: "w-32",
    },
    {
      header: "Kecamatan",
      accessor: (facility: PopUpFailitasKesehatan) => {
        console.log("facility kecamatan:", facility.kecamatan?.nama);
        return facility.kecamatan_nama;
      },
    },
    {
      header: "Kapasitas",
      accessor: (facility: PopUpFailitasKesehatan) => facility.capacity,
      className: "w-28",
    },
    {
      header: "Total Balita",
      accessor: (facility: PopUpFailitasKesehatan) => facility.total_balita,
      className: "w-28",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Fasilitas Kesehatan"
        description="Manajemen data fasilitas kesehatan"
        actions={
          <ButtonLink
            to="/dashboard/facilities/add"
            variant="primary"
            leftIcon={<Plus size={16} />}
          >
            Tambah Fasilitas
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
                placeholder="Cari berdasarkan nama atau kecamatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Total: {filteredFacilities.length} fasilitas
          </div>
        </div>

        <DataTable<PopUpFailitasKesehatan>
          columns={columns}
          data={filteredFacilities}
          keyField="fasilitas_id"
          actions={(facility) => (
            <div className="flex justify-end space-x-2">
              <ButtonLink
                to={`/dashboard/facilities/edit/${facility.fasilitas_id}`}
                variant="ghost"
                size="sm"
                leftIcon={<Edit2 size={16} />}
              >
                Edit
              </ButtonLink>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default FacilitiesPage;
