// import React, { useState } from "react";
// import { useChildrenStore } from "../../stores/childrenStore";
// import { DataTable } from "../../components/ui/DataTable";
// import { Button, ButtonLink } from "../../components/ui/Button";
// import PageHeader from "../../components/ui/PageHeader";
// import StatusBadge from "../../components/ui/StatusBadge";
// import { Child } from "../../types";
// import { Plus, Edit2, Trash2, Search } from "lucide-react";

// const ChildrenPage: React.FC = () => {
//   const { children, deleteChild } = useChildrenStore();

//   const [searchTerm, setSearchTerm] = useState("");

//   // Filter children based on officer's district (removed role and district checks)
//   const filteredByDistrict = children;

//   // Filter by search term (name or district)
//   const filteredChildren = filteredByDistrict.filter(
//     (child) =>
//       child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       child.district.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Apakah Anda yakin ingin menghapus data balita ini?")) {
//       await deleteChild(id);
//     }
//   };

//   const columns = [
//     {
//       header: "ID",
//       accessor: (child: Child) => child.id.split("-")[1],
//       className: "w-16",
//     },
//     {
//       header: "Nama",
//       accessor: (child: Child) => child.name,
//     },
//     {
//       header: "Usia (bulan)",
//       accessor: (child: Child) => child.age,
//       className: "w-32",
//     },
//     {
//       header: "Status Gizi",
//       accessor: (child: Child) => (
//         <StatusBadge status={child.nutritionStatus} />
//       ),
//     },
//     {
//       header: "Kecamatan",
//       accessor: (child: Child) => child.district,
//     },
//     {
//       header: "Diperbarui",
//       accessor: (child: Child) =>
//         new Date(child.updatedAt).toLocaleDateString("id-ID"),
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <PageHeader
//         title="Data Balita"
//         description="Manajemen data balita"
//         actions={
//           <ButtonLink
//             to="/dashboard/children/add"
//             variant="primary"
//             leftIcon={<Plus size={16} />}
//           >
//             Tambah Balita
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
//             Total: {filteredChildren.length} balita
//           </div>
//         </div>

//         <DataTable<Child>
//           columns={columns}
//           data={filteredChildren}
//           keyField="id"
//           actions={(child) => (
//             <div className="flex justify-end space-x-2">
//               <ButtonLink
//                 to={`/dashboard/children/edit/${child.id}`}
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
//                 onClick={() => handleDelete(child.id)}
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

// export default ChildrenPage;
