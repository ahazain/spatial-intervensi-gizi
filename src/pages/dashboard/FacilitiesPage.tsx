// import React, { useState } from "react";
// import { useFacilitiesStore } from "../../stores/facilitiesStore";
// import { DataTable } from "../../components/ui/DataTable";
// import { Button, ButtonLink } from "../../components/ui/Button";
// import PageHeader from "../../components/ui/PageHeader";
// import { HealthFacility } from "../../types";
// import { Plus, Edit2, Trash2, Search } from "lucide-react";

// const FacilitiesPage: React.FC = () => {
//   const { facilities, deleteFacility } = useFacilitiesStore();

//   const [searchTerm, setSearchTerm] = useState("");

//   // Filter facilities based on search term
//   const filteredFacilities = facilities.filter(
//     (facility) =>
//       facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       facility.district.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = async (id: string) => {
//     if (
//       window.confirm(
//         "Apakah Anda yakin ingin menghapus data fasilitas kesehatan ini?"
//       )
//     ) {
//       await deleteFacility(id);
//     }
//   };

//   const columns = [
//     {
//       header: "Nama Fasilitas",
//       accessor: (facility: HealthFacility) => facility.name,
//     },
//     {
//       header: "Tipe",
//       accessor: (facility: HealthFacility) =>
//         facility.type === "puskesmas" ? "Puskesmas" : "Pustu",
//       className: "w-32",
//     },
//     {
//       header: "Kecamatan",
//       accessor: (facility: HealthFacility) => facility.district,
//     },
//     {
//       header: "Kapasitas",
//       accessor: (facility: HealthFacility) => facility.capacity,
//       className: "w-28",
//     },
//     {
//       header: "Diperbarui",
//       accessor: (facility: HealthFacility) =>
//         new Date(facility.updatedAt).toLocaleDateString("id-ID"),
//       className: "w-32",
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <PageHeader
//         title="Fasilitas Kesehatan"
//         description="Manajemen data fasilitas kesehatan"
//         actions={
//           <ButtonLink
//             to="/dashboard/facilities/add"
//             variant="primary"
//             leftIcon={<Plus size={16} />}
//           >
//             Tambah Fasilitas
//           </ButtonLink>
//         }
//       />

//       <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
//         <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
//           <div className="w-full sm:w-80">
//             <label htmlFor="search" className="sr-only">
//               Cari
//             </label>
//             <div className="relative rounded-md shadow-sm">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search size={18} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 id="search"
//                 className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                 placeholder="Cari berdasarkan nama atau kecamatan..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="text-sm text-gray-500">
//             Total: {filteredFacilities.length} fasilitas
//           </div>
//         </div>

//         <DataTable<HealthFacility>
//           columns={columns}
//           data={filteredFacilities}
//           keyField="id"
//           actions={(facility) => (
//             <div className="flex justify-end space-x-2">
//               <ButtonLink
//                 to={`/dashboard/facilities/edit/${facility.id}`}
//                 variant="ghost"
//                 size="sm"
//                 leftIcon={<Edit2 size={16} />}
//               >
//                 Edit
//               </ButtonLink>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 leftIcon={<Trash2 size={16} className="text-red-500" />}
//                 className="text-red-500 hover:bg-red-50"
//                 onClick={() => handleDelete(facility.id)}
//               >
//                 Hapus
//               </Button>
//             </div>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// export default FacilitiesPage;
