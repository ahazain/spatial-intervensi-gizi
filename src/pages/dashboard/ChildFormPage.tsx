// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useChildrenStore } from "../../stores/childrenStore";
// import { Card, CardContent, CardFooter } from "../../components/ui/Card";
// import { Button } from "../../components/ui/Button";
// import PageHeader from "../../components/ui/PageHeader";
// import { districts } from "../../lib/mockData";
// import { Save, MapPin } from "lucide-react";
// import { NutritionStatus } from "../../types";
// import BaseMap from "../../components/map/BaseMap";

// const ChildFormPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { getChildById, addChild, updateChild } = useChildrenStore();
//   const isEditMode = !!id;

//   // Surabaya's center as default coordinates
//   const defaultCoordinates: [number, number] = [-7.2575, 112.7521];

//   const [formData, setFormData] = useState<{
//     name: string;
//     age: number;
//     nutritionStatus: NutritionStatus;
//     district: string;
//     coordinates: [number, number];
//   }>({
//     name: "",
//     age: 0,
//     nutritionStatus: "normal",
//     district: "",
//     coordinates: defaultCoordinates,
//   });

//   const [errors, setErrors] = useState<{
//     name?: string;
//     age?: string;
//     nutritionStatus?: string;
//     district?: string;
//     coordinates?: string;
//   }>({});

//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

//   // Load existing data if in edit mode
//   useEffect(() => {
//     if (isEditMode && id) {
//       const childData = getChildById(id);
//       if (childData) {
//         setFormData({
//           name: childData.name,
//           age: childData.age,
//           nutritionStatus: childData.nutritionStatus,
//           district: childData.district,
//           coordinates: childData.coordinates,
//         });
//       } else {
//         setMessage({
//           type: "error",
//           text: "Data balita tidak ditemukan",
//         });
//       }
//     }
//   }, [isEditMode, id, getChildById]);

//   const validate = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Nama balita wajib diisi";
//     }

//     if (formData.age < 0 || formData.age > 60) {
//       newErrors.age = "Usia harus antara 0-60 bulan";
//     }

//     if (!formData.district) {
//       newErrors.district = "Kecamatan wajib dipilih";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validate()) {
//       return;
//     }

//     setIsLoading(true);
//     setMessage(null);

//     try {
//       if (isEditMode && id) {
//         await updateChild(id, formData);
//         setMessage({
//           type: "success",
//           text: "Data balita berhasil diperbarui",
//         });
//       } else {
//         await addChild(formData);
//         setMessage({
//           type: "success",
//           text: "Data balita berhasil ditambahkan",
//         });
//       }

//       // Redirect after successful submission
//       setTimeout(() => {
//         navigate("/dashboard/children");
//       }, 1500);
//     } catch (error) {
//       console.error(error);
//       setMessage({
//         type: "error",
//         text: "Terjadi kesalahan saat menyimpan data",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "age" ? parseInt(value) || 0 : value,
//     }));

//     // Clear error on input change
//     if (errors[name as keyof typeof errors]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
//     const { lat, lng } = e.latlng;
//     setFormData((prev) => ({
//       ...prev,
//       coordinates: [lat, lng],
//     }));

//     // Clear coordinate error if exists
//     if (errors.coordinates) {
//       setErrors((prev) => ({ ...prev, coordinates: undefined }));
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <PageHeader
//         title={isEditMode ? "Edit Data Balita" : "Tambah Data Balita"}
//         description={
//           isEditMode
//             ? "Perbarui informasi balita"
//             : "Tambahkan balita baru ke sistem"
//         }
//         backLink="/dashboard/children"
//         backLinkText="Kembali ke Daftar Balita"
//       />

//       {message && (
//         <div
//           className={`p-4 rounded-md mb-6 ${
//             message.type === "success"
//               ? "bg-green-50 text-green-700"
//               : "bg-red-50 text-red-700"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card>
//             <form onSubmit={handleSubmit}>
//               <CardContent className="p-6 space-y-6">
//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Nama Balita <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     className={`mt-1 block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
//                       errors.name ? "border-red-300" : "border-gray-300"
//                     }`}
//                     value={formData.name}
//                     onChange={handleInputChange}
//                   />
//                   {errors.name && (
//                     <p className="mt-2 text-sm text-red-600">{errors.name}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="age"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Usia (bulan) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     id="age"
//                     name="age"
//                     min="0"
//                     max="60"
//                     className={`mt-1 block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
//                       errors.age ? "border-red-300" : "border-gray-300"
//                     }`}
//                     value={formData.age}
//                     onChange={handleInputChange}
//                   />
//                   {errors.age && (
//                     <p className="mt-2 text-sm text-red-600">{errors.age}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="nutritionStatus"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Status Gizi <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="nutritionStatus"
//                     name="nutritionStatus"
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
//                     value={formData.nutritionStatus}
//                     onChange={handleInputChange}
//                   >
//                     <option value="normal">Normal</option>
//                     <option value="underweight">Gizi Kurang</option>
//                     <option value="severely_underweight">Gizi Buruk</option>
//                     <option value="stunting">Stunting</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="district"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Kecamatan <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="district"
//                     name="district"
//                     className={`mt-1 block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
//                       errors.district ? "border-red-300" : "border-gray-300"
//                     }`}
//                     value={formData.district}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Pilih Kecamatan</option>
//                     {districts.map((district) => (
//                       <option key={district} value={district}>
//                         {district}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.district && (
//                     <p className="mt-2 text-sm text-red-600">
//                       {errors.district}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Lokasi <span className="text-red-500">*</span>
//                   </label>
//                   <p className="text-sm text-gray-500 mb-2">
//                     Klik pada peta untuk menentukan lokasi
//                   </p>

//                   <div className="h-80 rounded-lg border border-gray-300 overflow-hidden">
//                     <BaseMap
//                       center={formData.coordinates}
//                       zoom={13}
//                       className="h-full w-full"
//                     >
//                       {formData.coordinates && (
//                         <div
//                           onClick={(e: any) => handleMapClick(e)}
//                           className="leaflet-click-handler"
//                         />
//                       )}
//                       {/* Add a marker for the current coordinates */}
//                       {formData.coordinates && (
//                         <div
//                           className="leaflet-marker"
//                           style={{
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             transform: "translate(-50%, -50%)",
//                           }}
//                         />
//                       )}
//                     </BaseMap>
//                   </div>

//                   <div className="mt-2 flex items-center space-x-4">
//                     <div>
//                       <label
//                         htmlFor="latitude"
//                         className="block text-xs font-medium text-gray-500"
//                       >
//                         Latitude
//                       </label>
//                       <input
//                         type="text"
//                         id="latitude"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-xs"
//                         value={formData.coordinates[0]}
//                         readOnly
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="longitude"
//                         className="block text-xs font-medium text-gray-500"
//                       >
//                         Longitude
//                       </label>
//                       <input
//                         type="text"
//                         id="longitude"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-xs"
//                         value={formData.coordinates[1]}
//                         readOnly
//                       />
//                     </div>
//                     <div className="mt-auto">
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="outline"
//                         leftIcon={<MapPin size={16} />}
//                         className="mt-1"
//                       >
//                         Pilih di Peta
//                       </Button>
//                     </div>
//                   </div>

//                   {errors.coordinates && (
//                     <p className="mt-2 text-sm text-red-600">
//                       {errors.coordinates}
//                     </p>
//                   )}
//                 </div>
//               </CardContent>

//               <CardFooter className="px-6 py-4 bg-gray-50 flex justify-end">
//                 <div className="flex space-x-3">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => navigate("/dashboard/children")}
//                   >
//                     Batal
//                   </Button>
//                   <Button
//                     type="submit"
//                     variant="primary"
//                     leftIcon={<Save size={16} />}
//                     isLoading={isLoading}
//                   >
//                     {isEditMode ? "Perbarui" : "Simpan"}
//                   </Button>
//                 </div>
//               </CardFooter>
//             </form>
//           </Card>
//         </div>

//         <div>
//           <Card>
//             <CardContent className="p-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Petunjuk Pengisian
//               </h3>

//               <div className="space-y-4 text-sm text-gray-600">
//                 <div>
//                   <h4 className="font-medium text-gray-900">Nama Balita</h4>
//                   <p>Masukkan nama lengkap balita</p>
//                 </div>

//                 <div>
//                   <h4 className="font-medium text-gray-900">Usia (bulan)</h4>
//                   <p>Masukkan usia balita dalam bulan (0-60 bulan)</p>
//                 </div>

//                 <div>
//                   <h4 className="font-medium text-gray-900">Status Gizi</h4>
//                   <p>Pilih status gizi balita berdasarkan klasifikasi:</p>
//                   <ul className="list-disc list-inside mt-2 pl-2 space-y-1">
//                     <li>Normal: BB/U dan TB/U normal</li>
//                     <li>Gizi Kurang: BB/U -2 SD s/d -3 SD</li>
//                     <li>Gizi Buruk: BB/U &lt; -3 SD</li>
//                     <li>Stunting: TB/U &lt; -2 SD</li>
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="font-medium text-gray-900">Kecamatan</h4>
//                   <p>Pilih kecamatan tempat tinggal balita</p>
//                 </div>

//                 <div>
//                   <h4 className="font-medium text-gray-900">Lokasi</h4>
//                   <p>
//                     Klik pada peta untuk menentukan lokasi tempat tinggal balita
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChildFormPage;
