import { useState } from "react";
import Image from "next/image";

interface PlayerData {
  fullName: string;
  contactNumber: string;
  nationality: string;
  guardianName: string;
  guardianContactNumber: string;
  birthCertificate: string;
  passportSizePhoto: string;
}

interface ModalProps {
  closeModal: () => void;
  playerData: PlayerData;
  handleEdit: (updatedPlayerData: PlayerData) => void;
}

export default function PlayerEditModal({ closeModal, playerData, handleEdit }: ModalProps) {
  const [formData, setFormData] = useState<PlayerData>({
    ...playerData,
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    birthCertificate: null,
    passportSizePhoto: null,
  });

  const [imagePreviews, setImagePreviews] = useState<{ birthCertificate?: string, passportSizePhoto?: string }>({
    birthCertificate: playerData.birthCertificate || "",
    passportSizePhoto: playerData.passportSizePhoto || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevState) => ({
          ...prevState,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(selectedFile);

      setFormData((prevState) => ({
        ...prevState,
        [type]: selectedFile,
      }));

      setFiles((prevFiles) => ({
        ...prevFiles,
        [type]: selectedFile,
      }));
    }
  };

  const handleRemoveImage = (type: string) => {
    setImagePreviews((prevState) => ({
      ...prevState,
      [type]: "",
    }));

    setFormData({ ...formData, [type]: "" });
    setFiles((prevFiles) => ({
      ...prevFiles,
      [type]: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataWithFiles = new FormData();
    if (files['birthCertificate']) {
      formDataWithFiles.append('files', files['birthCertificate']);
    }
    if (files['passportSizePhoto']) {
      formDataWithFiles.append('files', files['passportSizePhoto']);
    }

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formDataWithFiles,
    });

    const uploadResult = await uploadResponse.json();
    formData.birthCertificate = uploadResult.urls[1];
    formData.passportSizePhoto = uploadResult.urls[0];

    handleEdit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h3 className="text-xl text-[#0E1AC6] font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#0E1AC6]">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-[#0E1AC6]">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-[#0E1AC6]">Nationality</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="guardianName" className="block text-sm font-medium text-[#0E1AC6]">Guardian Name</label>
            <input
              type="text"
              id="guardianName"
              name="guardianName"
              value={formData.guardianName || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="guardianContactNumber" className="block text-sm font-medium text-[#0E1AC6]">Guardian Contact Number</label>
            <input
              type="text"
              id="guardianContactNumber"
              name="guardianContactNumber"
              value={formData.guardianContactNumber || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Display and Remove Current Images */}
          {imagePreviews.birthCertificate && (
            <div className="mb-4">
              <p><strong>Current Birth Certificate:</strong></p>
              <Image
                src={imagePreviews.birthCertificate}
                alt="Current Birth Certificate"
                width={200}
                height={200}
                className="max-w-full h-auto"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage("birthCertificate")}
                className="mt-2 text-red-500"
              >
                Remove Birth Certificate
              </button>
            </div>
          )}
          {imagePreviews.passportSizePhoto && (
            <div className="mb-4">
              <p><strong>Current Passport Photo:</strong></p>
              <Image
                src={imagePreviews.passportSizePhoto}
                alt="Current Passport Photo"
                width={200}
                height={200}
                className="max-w-full h-auto"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage("passportSizePhoto")}
                className="mt-2 text-red-500"
              >
                Remove Passport Photo
              </button>
            </div>
          )}
          
          {/* File Uploads for Documents */}
          <div>
            <label htmlFor="birthCertificate" className="block text-sm font-medium text-[#0E1AC6]">Birth Certificate</label>
            <input
              type="file"
              id="birthCertificate"
              name="birthCertificate"
              onChange={(e) => handleFileChange(e, "birthCertificate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="passportSizePhoto" className="block text-sm font-medium text-[#0E1AC6]">Passport Size Photo</label>
            <input
              type="file"
              id="passportSizePhoto"
              name="passportSizePhoto"
              onChange={(e) => handleFileChange(e, "passportSizePhoto")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex justify-end mt-4 space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
