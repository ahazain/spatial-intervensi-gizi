import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useChildrenStore } from "../../stores/childrenStore";
import { useFacilitiesStore } from "../../stores/facilitiesStore";
import { Card, CardContent, CardFooter } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Save } from "lucide-react";

interface FormChildrenProps {
  existingData?: {
    id: string;
    nama: string;
    status_nutrisi: "normal" | "buruk" | "kurang" | "stunting";
    fasilitas_kesehatan_id: string;
  };
  onSuccess?: () => void;
}

const ChildFormPage: React.FC<FormChildrenProps> = ({
  existingData: propsExistingData,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { addChild, updateChild, children, getChildById } = useChildrenStore();
  const { facilities, initializeFromSupabase } = useFacilitiesStore();

  const isEditMode = Boolean(
    params.id || propsExistingData || location.state?.existingData
  );

  const [existingData, setExistingData] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    status_nutrisi: "normal" as const,
    fasilitas_kesehatan_id: "",
  });

  const [errors, setErrors] = useState<{
    nama?: string;
    status_nutrisi?: string;
    fasilitas_kesehatan_id?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load facilities data
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        await initializeFromSupabase();
      } catch (error) {
        console.error("Error loading facilities:", error);
      }
    };

    loadFacilities();
  }, [initializeFromSupabase]);

  // Load existing data from various sources
  useEffect(() => {
    const loadExistingData = async () => {
      setIsDataLoading(true);

      try {
        let dataToSet = null;

        if (propsExistingData) {
          dataToSet = propsExistingData;
        } else if (location.state?.existingData) {
          dataToSet = location.state.existingData;
        } else if (params.id) {
          const childFromStore = children.find((c) => c.id === params.id);
          if (childFromStore) {
            dataToSet = childFromStore;
          } else {
            const childFromAPI = await getChildById(params.id);
            dataToSet = childFromAPI;
          }
        }

        if (dataToSet) {
          setExistingData(dataToSet);
        }
      } catch (error) {
        console.error("Error loading child data:", error);
        setMessage({
          type: "error",
          text: "Gagal memuat data balita",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isEditMode) {
      loadExistingData();
    }
  }, [
    params.id,
    propsExistingData,
    location.state,
    children,
    getChildById,
    isEditMode,
  ]);

  // Populate form with existing data
  useEffect(() => {
    if (
      existingData &&
      typeof existingData === "object" &&
      !existingData.then
    ) {
      setFormData({
        nama: existingData.nama || "",
        status_nutrisi: existingData.status_nutrisi || "normal",
        fasilitas_kesehatan_id: existingData.fasilitas_kesehatan_id || "",
      });
    }
  }, [existingData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama balita wajib diisi";
    }

    if (!formData.fasilitas_kesehatan_id) {
      newErrors.fasilitas_kesehatan_id = "Fasilitas kesehatan wajib dipilih";
    }

    if (formData.fasilitas_kesehatan_id) {
      const facilityExists = facilities.find(
        (f) => String(f.id) === String(formData.fasilitas_kesehatan_id)
      );

      if (!facilityExists) {
        newErrors.fasilitas_kesehatan_id =
          "Fasilitas kesehatan yang dipilih tidak valid";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const balitaData = {
      nama: formData.nama,
      status_nutrisi: formData.status_nutrisi,
      fasilitas_kesehatan_id: formData.fasilitas_kesehatan_id,
    };

    try {
      if (existingData?.id) {
        await updateChild(existingData.id, balitaData);
      } else {
        await addChild(balitaData);
      }

      setMessage({
        type: "success",
        text: `Data balita berhasil ${
          existingData ? "diperbarui" : "disimpan"
        }`,
      });

      onSuccess?.();
      setTimeout(() => {
        navigate("/dashboard/children");
      }, 1500);
    } catch (error) {
      console.error("Error saving child:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menyimpan data",
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
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleReset = () => {
    if (existingData) {
      setFormData({
        nama: existingData.nama || "",
        status_nutrisi: existingData.status_nutrisi || "normal",
        fasilitas_kesehatan_id: existingData.fasilitas_kesehatan_id || "",
      });
    } else {
      setFormData({
        nama: "",
        status_nutrisi: "normal",
        fasilitas_kesehatan_id: "",
      });
    }
    setErrors({});
    setMessage(null);
  };

  if (isDataLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={isEditMode ? "Edit Data Balita" : "Tambah Data Balita"}
        description={
          isEditMode
            ? "Edit data balita yang sudah ada"
            : "Tambahkan balita baru ke sistem"
        }
        backLink="/dashboard/children"
        backLinkText="Kembali ke Daftar Balita"
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
                    Nama Balita <span className="text-red-500">*</span>
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
                    placeholder="Masukkan nama lengkap balita"
                  />
                  {errors.nama && (
                    <p className="mt-2 text-sm text-red-600">{errors.nama}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="status_nutrisi"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status Gizi <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status_nutrisi"
                    name="status_nutrisi"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    value={formData.status_nutrisi}
                    onChange={handleInputChange}
                  >
                    <option value="normal">Normal</option>
                    <option value="kurang">Gizi Kurang</option>
                    <option value="buruk">Gizi Buruk</option>
                    <option value="stunting">Stunting</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fasilitas_kesehatan_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fasilitas Kesehatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="fasilitas_kesehatan_id"
                    name="fasilitas_kesehatan_id"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
                      errors.fasilitas_kesehatan_id
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    value={formData.fasilitas_kesehatan_id}
                    onChange={handleInputChange}
                    disabled={facilities.length === 0}
                  >
                    {facilities.length === 0 ? (
                      <option value="" disabled>
                        Memuat fasilitas kesehatan...
                      </option>
                    ) : (
                      <>
                        <option value="">Pilih Fasilitas Kesehatan</option>
                        {facilities
                          .filter(
                            (faskes) => faskes.id && faskes.nama && faskes.type
                          )
                          .map((faskes) => (
                            <option key={faskes.id} value={String(faskes.id)}>
                              {faskes.nama} ({faskes.type})
                            </option>
                          ))}
                      </>
                    )}
                  </select>
                  {errors.fasilitas_kesehatan_id && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.fasilitas_kesehatan_id}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="px-6 py-4 bg-gray-50 flex justify-end">
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard/children")}
                  >
                    Batal
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<Save size={16} />}
                    isLoading={isLoading}
                    disabled={facilities.length === 0}
                  >
                    {isEditMode ? "Perbarui" : "Simpan"}
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
                Petunjuk Pengisian
              </h3>

              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900">Nama Balita</h4>
                  <p>Masukkan nama lengkap balita</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Status Gizi</h4>
                  <p>
                    Pilih status gizi balita berdasarkan klasifikasi
                    WHO/Kemenkes
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">
                    Fasilitas Kesehatan
                  </h4>
                  <p>
                    Pilih fasilitas kesehatan tempat balita terdaftar atau
                    berobat
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildFormPage;
