import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { useKecamatanStore } from "../../stores/kecamatanStore";
import { Card, CardContent, CardFooter } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Save, MapPin, Loader } from "lucide-react";
import BaseMap from "../../components/map/BaseMap";

const FacilityUpdateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedFacility, getFacilityById, updateFacility } =
    useFacilitiesStore();
  const { kecamatanList, initializeFromSupabase } = useKecamatanStore();

  // Surabaya's center as default coordinates
  const defaultCoordinates: [number, number] = [-7.2575, 112.7521];

  const [formData, setFormData] = useState<{
    nama: string;
    type: "puskesmas" | "rumah sakit";
    kecamatan_id: string;
    capacity: number;
    coordinates: [number, number];
  }>({
    nama: "",
    type: "puskesmas",
    kecamatan_id: "",
    capacity: 100,
    coordinates: defaultCoordinates,
  });

  const [errors, setErrors] = useState<{
    nama?: string;
    kecamatan_id?: string;
    capacity?: string;
    coordinates?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Initialize kecamatan data and facility data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoadingData(true);

        // Validate ID parameter - check if it exists and is not empty
        if (!id || id.trim() === "") {
          setMessage({
            type: "error",
            text: "ID fasilitas tidak valid",
          });
          setIsLoadingData(false);
          return;
        }

        // Initialize kecamatan data if not already loaded
        if (kecamatanList.length === 0) {
          await initializeFromSupabase();
        }

        // Get facility data by ID (using string ID directly)
        console.log("Fetching facility with ID:", id);
        await getFacilityById(id);
      } catch (error) {
        console.error("Error initializing data:", error);
        setMessage({
          type: "error",
          text: "Gagal memuat data fasilitas",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    initializeData();
  }, [id, kecamatanList.length, initializeFromSupabase, getFacilityById]);

  // Update form data when selectedFacility changes
  useEffect(() => {
    if (selectedFacility) {
      setFormData({
        nama: selectedFacility.nama,
        type: selectedFacility.type,
        kecamatan_id: selectedFacility.kecamatan_id,
        capacity: selectedFacility.capacity,
        coordinates: selectedFacility.lokasi?.coordinates || defaultCoordinates,
      });
    }
  }, [selectedFacility]);

  // Component untuk handle map click events
  const MapClickHandler: React.FC = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          coordinates: [lat, lng],
        }));

        // Clear coordinate error if exists
        if (errors.coordinates) {
          setErrors((prev) => ({ ...prev, coordinates: undefined }));
        }
      },
    });
    return null;
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama fasilitas wajib diisi";
    }

    if (!formData.kecamatan_id) {
      newErrors.kecamatan_id = "Kecamatan wajib dipilih";
    }

    if (formData.capacity < 1) {
      newErrors.capacity = "Kapasitas harus lebih dari 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form and ID
    if (!validate() || !id || id.trim() === "") {
      if (!id || id.trim() === "") {
        setMessage({
          type: "error",
          text: "ID fasilitas tidak valid",
        });
      }
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Create update data - use database column names, not interface names
      const updateData = {
        nama: formData.nama,
        type: formData.type,
        kecamatan_id: formData.kecamatan_id,
        lokasi: {
          type: "Point" as const,
          coordinates: formData.coordinates,
        },
        capacity: formData.capacity,
      };

      console.log("Updating facility with ID:", id, updateData);
      await updateFacility(id, updateData);
      setMessage({
        type: "success",
        text: "Data fasilitas kesehatan berhasil diperbarui",
      });

      // Redirect after successful submission
      setTimeout(() => {
        navigate("/dashboard/facilities");
      }, 1500);
    } catch (error) {
      console.log("Error:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat memperbarui data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));

    // Clear error on input change
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCoordinateInputChange = (type: "lat" | "lng", value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData((prev) => ({
        ...prev,
        coordinates:
          type === "lat"
            ? [numValue, prev.coordinates[1]]
            : [prev.coordinates[0], numValue],
      }));
    }
  };

  const centerMapOnCoordinates = () => {
    // This will trigger flyTo effect in BaseMap
    setFormData((prev) => ({ ...prev, coordinates: [...prev.coordinates] }));
  };

  // Show loading spinner while data is being fetched
  if (isLoadingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center space-x-2">
            <Loader className="animate-spin h-6 w-6 text-teal-600" />
            <span className="text-gray-600">Memuat data fasilitas...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error if facility not found or invalid ID
  if ((!selectedFacility && !isLoadingData) || !id || id.trim() === "") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Fasilitas Tidak Ditemukan"
          description="Data fasilitas kesehatan yang dicari tidak ditemukan atau ID tidak valid"
          backLink="/dashboard/facilities"
          backLinkText="Kembali ke Daftar Fasilitas"
        />
        <div className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">
                {!id || id.trim() === ""
                  ? "ID fasilitas tidak valid atau kosong."
                  : `Fasilitas kesehatan dengan ID "${id}" tidak ditemukan.`}
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/dashboard/facilities")}
              >
                Kembali ke Daftar Fasilitas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Edit Fasilitas Kesehatan"
        description={`Perbarui data fasilitas kesehatan: ${
          selectedFacility?.nama || ""
        }`}
        backLink="/dashboard/facilities"
        backLinkText="Kembali ke Daftar Fasilitas"
      />

      {message && (
        <div
          className={`p-4 rounded-md mb-6 ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nama Fasilitas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
                      errors.nama ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.nama}
                    onChange={handleInputChange}
                  />
                  {errors.nama && (
                    <p className="mt-2 text-sm text-red-600">{errors.nama}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipe Fasilitas <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="puskesmas">Puskesmas</option>

                    <option value="rumah sakit">Rumah Sakit</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="kecamatan_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Kecamatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="kecamatan_id"
                    name="kecamatan_id"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
                      errors.kecamatan_id ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.kecamatan_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {kecamatanList.map((kecamatan) => (
                      <option
                        key={kecamatan.kecamatan_id || kecamatan.id}
                        value={kecamatan.kecamatan_id || kecamatan.id}
                      >
                        {kecamatan.kecamatan_nama || kecamatan.nama}
                      </option>
                    ))}
                  </select>
                  {errors.kecamatan_id && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.kecamatan_id}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Kapasitas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
                      errors.capacity ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.capacity}
                    onChange={handleInputChange}
                  />
                  {errors.capacity && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.capacity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Klik pada peta untuk mengubah lokasi
                  </p>

                  <div className="h-80 rounded-lg border border-gray-300 overflow-hidden">
                    <BaseMap
                      center={formData.coordinates}
                      zoom={13}
                      className="h-full w-full"
                      flyTo={formData.coordinates}
                    >
                      <MapClickHandler />
                      <Marker position={formData.coordinates}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-medium">
                              {formData.nama || "Lokasi Fasilitas Kesehatan"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Lat: {formData.coordinates[0].toFixed(6)}
                              <br />
                              Lng: {formData.coordinates[1].toFixed(6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </BaseMap>
                  </div>

                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex-1">
                      <label
                        htmlFor="latitude"
                        className="block text-xs font-medium text-gray-500"
                      >
                        Latitude
                      </label>
                      <input
                        type="number"
                        id="latitude"
                        step="any"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-xs"
                        value={formData.coordinates[0]}
                        onChange={(e) =>
                          handleCoordinateInputChange("lat", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="longitude"
                        className="block text-xs font-medium text-gray-500"
                      >
                        Longitude
                      </label>
                      <input
                        type="number"
                        id="longitude"
                        step="any"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-xs"
                        value={formData.coordinates[1]}
                        onChange={(e) =>
                          handleCoordinateInputChange("lng", e.target.value)
                        }
                      />
                    </div>
                    <div className="mt-auto">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        leftIcon={<MapPin size={16} />}
                        className="mt-1"
                        onClick={centerMapOnCoordinates}
                      >
                        Pusatkan
                      </Button>
                    </div>
                  </div>

                  {errors.coordinates && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.coordinates}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="px-6 py-4 bg-gray-50 flex justify-end">
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard/facilities")}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<Save size={16} />}
                    isLoading={isLoading}
                  >
                    Perbarui
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Petunjuk Edit
              </h3>

              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900">Nama Fasilitas</h4>
                  <p>Perbarui nama lengkap fasilitas kesehatan</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Tipe Fasilitas</h4>
                  <p>Ubah tipe fasilitas kesehatan jika diperlukan:</p>
                  <ul className="list-disc list-inside mt-2 pl-2">
                    <li>Puskesmas: Pusat Kesehatan Masyarakat</li>

                    <li>Rumah Sakit: Fasilitas kesehatan tingkat lanjut</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Kecamatan</h4>
                  <p>Perbarui kecamatan lokasi fasilitas kesehatan</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Kapasitas</h4>
                  <p>Perbarui kapasitas pelayanan pasien per hari</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Lokasi</h4>
                  <p>Klik pada peta untuk mengubah koordinat fasilitas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacilityUpdateFormPage;
