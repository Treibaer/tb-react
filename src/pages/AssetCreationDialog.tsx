import { useEffect, useRef, useState } from "react";
import Dialog from "../components/common/Dialog";
import Button from "../components/Button";
import Client from "../services/Client";
import { showToast } from "../utils/tbToast";

export const AssetCreationDialog: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For image preview
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  async function handleCreateAsset() {
    if (!file) {
      showToast("error", "", "Please select a file to upload");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      // Send the POST request to upload the file
      const response = await Client.shared.uploadFile("/assets", formData);
      console.log(response);
      onClose();
      showToast("success", "", "File uploaded successfully");
    } catch (err) {
      console.error(err);
      showToast("error", "", "Failed to upload file");
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      generateImagePreview(selectedFile); // Generate preview for image files
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      generateImagePreview(droppedFile); // Generate preview for image files
    }
  }

  // Generates a preview URL for image files
  function generateImagePreview(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string); // Set the preview URL
    };
  }

  function handleDragEnter(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }

  // Handle drag events across the window
  function handleWindowDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleWindowDragLeave(event: DragEvent) {
    event.preventDefault();
    setDragActive(false);
  }

  function handleWindowDrop(event: DragEvent) {
    event.preventDefault();
    setDragActive(false);
  }

  return (
    <>
      <Dialog
        title="Create Asset"
        onClose={onClose}
        onSubmit={handleCreateAsset}
      >
        <input
          type="text"
          placeholder="Title"
          className="tb-input"
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="tb-input mb-10"
          ref={descriptionRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* File input field */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="flex w-full gap-2">
          <div
            className={`drag-drop-area ${dragActive ? "active" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={handleDrop}
            style={{
              border: dragActive ? "2px dashed #00aaff" : "2px dashed #cccccc",
              flexGrow: 1,
              padding: "20px",
              textAlign: "center",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {file ? (
              <p>{file.name}</p>
            ) : (
              <p>Drag & Drop a file here or click the button to upload</p>
            )}
          </div>
          <div className="flex justify-center items-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              title="Select File"
            />
          </div>
        </div>

        {previewUrl && (
          <div className="image-preview mb-4">
            <img
              className="max-w-full min-w-48 h-auto rounded-lg max-h-[300px] object-contain"
              src={previewUrl}
              alt="Preview"
              style={{
                imageRendering: "pixelated",
              }}
            />
          </div>
        )}
        <div className="mb-8"></div>
      </Dialog>
    </>
  );
};

export default AssetCreationDialog;
