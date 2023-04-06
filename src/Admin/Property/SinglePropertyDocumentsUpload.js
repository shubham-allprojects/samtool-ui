import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";

let singleChunkInByte = 1024 * 7;
const chunkSize = singleChunkInByte * 1024;
let authHeader = "";
let temp = 0;
const SinglePropertyDocumentsUpload = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const { id } = useParams();
  const [imageFiles, setImageFiles] = useState([]);
  const [savedImageFiles, setSavedImageFiles] = useState([]);
  const [currentImageFileIndex, setCurrentImageFileIndex] = useState(null);
  const [lastUploadedImageFileIndex, setLastUploadedImageFileIndex] =
    useState(null);
  const [currentChunkIndexOfImage, setCurrentChunkIndexOfImage] =
    useState(null);

  const [uniqueId, setUinqueId] = useState(uuid());

  const handleImageFileChange = (e) => {
    e.preventDefault();
    setSavedImageFiles([...imageFiles, ...e.target.files]);
  };

  const readAndUploadCurrentImageChunk = () => {
    const reader = new FileReader();
    const file = imageFiles[currentImageFileIndex];
    if (!file) {
      return;
    }
    const from = currentChunkIndexOfImage * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadImageChunk(e);
    reader.readAsDataURL(blob);
  };

  const uploadImageChunk = async (readerEvent) => {
    let fileSize = 0;
    const file = imageFiles[currentImageFileIndex];
    const size = Math.round(file.size / 1024);
    fileSize = size >= 1024 ? (size / 1024).toFixed(1) + " MB" : size + " KB";
    const data = readerEvent.target.result.split(",")[1];
    const detailsToPost = {
      upload_id: uniqueId,
      chunk_number: `${currentChunkIndexOfImage + 1}`,
      total_chunks: `${Math.ceil(file.size / chunkSize)}`,
      total_file_size: `${fileSize}`,
      file_name: `${file.name}`,
      property_id: 1,
      data: `${data}`,
    };
    console.log(detailsToPost);
    const chunks = Math.ceil(file.size / chunkSize) - 1;
    const isLastChunk = currentChunkIndexOfImage === chunks;
    console.warn("IS LAST CHUNK: ", isLastChunk);
    try {
      await axios
        .post(`/sam/v1/property/auth/upload-images`, detailsToPost, {
          headers: authHeader,
        })
        .then((res) => {
          if (isLastChunk) {
            if (res.data.msg !== 0) {
              toast.error("Error while uploading files");
            } else {
              if (currentImageFileIndex === savedImageFiles.length - 1) {
                toast.success("Files uploaded successfully");
                setTimeout(() => {
                  window.location.reload();
                }, 4000);
              }
            }
          }
        });
    } catch (error) {
      toast.error("Internal server error");
    }
    if (isLastChunk) {
      setUinqueId(uuid());
      setLastUploadedImageFileIndex(currentImageFileIndex);
      setCurrentChunkIndexOfImage(null);
    } else {
      setCurrentChunkIndexOfImage(currentChunkIndexOfImage + 1);
    }
  };

  useEffect(() => {
    if (lastUploadedImageFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedImageFileIndex === imageFiles.length - 1;
    const nextFileIndex = isLastFile ? null : currentImageFileIndex + 1;
    setCurrentImageFileIndex(nextFileIndex);
    // eslint-disable-next-line
  }, [lastUploadedImageFileIndex]);

  useEffect(() => {
    if (imageFiles.length > 0) {
      if (currentImageFileIndex === null) {
        setCurrentImageFileIndex(
          lastUploadedImageFileIndex === null
            ? 0
            : lastUploadedImageFileIndex + 1
        );
      }
    }
    // eslint-disable-next-line
  }, [imageFiles.length]);

  useEffect(() => {
    if (currentImageFileIndex !== null) {
      setCurrentChunkIndexOfImage(0);
    }
  }, [currentImageFileIndex]);

  useEffect(() => {
    if (currentChunkIndexOfImage !== null) {
      readAndUploadCurrentImageChunk();
    }
    // eslint-disable-next-line
  }, [currentChunkIndexOfImage]);

  const postImages = (e) => {
    e.preventDefault();
    setImageFiles(savedImageFiles);
  };

  const [pdfFiles, setPdfFiles] = useState([]);
  const [savedPdfFiles, setSavedPdfFiles] = useState([]);
  const [currentPdfFileIndex, setCurrentPdfFileIndex] = useState(null);
  const [lastUploadedPdfFileIndex, setLastUploadedPdfFileIndex] =
    useState(null);
  const [currentChunkIndexOfPdf, setCurrentChunkIndexOfPdf] = useState(null);

  const [uniqueIdForPdf, setUinqueIdForPdf] = useState(uuid());

  const handlePdfFileChange = (e) => {
    e.preventDefault();
    setSavedPdfFiles([...pdfFiles, ...e.target.files]);
  };

  const readAndUploadCurrentPdfChunk = () => {
    const reader = new FileReader();
    const file = pdfFiles[currentPdfFileIndex];
    if (!file) {
      return;
    }
    const from = currentChunkIndexOfPdf * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadPdfChunk(e);
    reader.readAsDataURL(blob);
  };
  const uploadPdfChunk = async (readerEvent) => {
    const file = pdfFiles[currentPdfFileIndex];
    const size = file.size / 1024;
    const data = readerEvent.target.result.split(",")[1];
    let currentChunkSize = singleChunkInByte;
    temp += singleChunkInByte;
    if (temp > size) {
      currentChunkSize = size - (temp - singleChunkInByte);
    }
    const detailsToPost = {
      upload_id: uniqueIdForPdf,
      chunk_number: `${currentChunkIndexOfPdf + 1}`,
      total_chunks: `${Math.ceil(file.size / chunkSize)}`,
      total_file_size: `${size.toFixed(2)}`,
      file_name: `${file.name}`,
      chunkSizeOfCurrentChunk: currentChunkSize.toFixed(2),
      // data: `${data}`,
    };
    console.log(detailsToPost);
    const chunks = Math.ceil(file.size / chunkSize) - 1;
    const isLastChunk = currentChunkIndexOfPdf === chunks;
    console.warn("IS LAST CHUNK: ", isLastChunk);
    // try {
    //   await axios
    //     .post(`/sam/v1/property/auth/property-documents`, detailsToPost, {
    //       headers: authHeader,
    //     })
    //     .then((res) => {
    //       if (isLastChunk) {
    //         if (res.data.msg !== 0) {
    //           toast.error("Error while uploading files");
    //         } else {
    //           if (currentPdfFileIndex === savedPdfFiles.length - 1) {
    //             toast.success("Files uploaded successfully");
    //             setTimeout(() => {
    //               window.location.reload();
    //             }, 4000);
    //           }
    //         }
    //       }
    //     });
    // } catch (error) {
    //   toast.error("Internal server error");
    // }
    if (isLastChunk) {
      setUinqueIdForPdf(uuid());
      setLastUploadedPdfFileIndex(currentPdfFileIndex);
      setCurrentChunkIndexOfPdf(null);
    } else {
      setCurrentChunkIndexOfPdf(currentChunkIndexOfPdf + 1);
    }
  };

  useEffect(() => {
    if (lastUploadedPdfFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedPdfFileIndex === pdfFiles.length - 1;
    const nextFileIndex = isLastFile ? null : currentPdfFileIndex + 1;
    setCurrentPdfFileIndex(nextFileIndex);
    // eslint-disable-next-line
  }, [lastUploadedPdfFileIndex]);

  useEffect(() => {
    if (pdfFiles.length > 0) {
      if (currentPdfFileIndex === null) {
        setCurrentPdfFileIndex(
          lastUploadedPdfFileIndex === null ? 0 : lastUploadedPdfFileIndex + 1
        );
      }
    }
    // eslint-disable-next-line
  }, [pdfFiles.length]);

  useEffect(() => {
    if (currentPdfFileIndex !== null) {
      setCurrentChunkIndexOfPdf(0);
    }
  }, [currentPdfFileIndex]);

  useEffect(() => {
    if (currentChunkIndexOfPdf !== null) {
      readAndUploadCurrentPdfChunk();
    }
    // eslint-disable-next-line
  }, [currentChunkIndexOfPdf]);

  const postPdf = (e) => {
    e.preventDefault();
    setPdfFiles(savedPdfFiles);
  };

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 mt-4 mt-md-0">
            <BreadCrumb />
            <section className="upload-documents-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <h4 className="fw-bold text-primary p-0">
                    Property Id: {id}
                  </h4>
                  <hr />
                </div>
                <div className="row border p-4">
                  <h5 className="mb-3">Upload Property Images</h5>
                  <div className="col-8">
                    <input
                      onChange={handleImageFileChange}
                      type="file"
                      multiple
                      className="form-control"
                    />
                  </div>
                  <div className="col-4">
                    <button className="btn btn-primary" onClick={postImages}>
                      Upload
                    </button>
                  </div>
                </div>
                <div className="row border p-4 mt-4">
                  <h5 className="mb-3">Upload Property Documents</h5>
                  <div className="col-8">
                    <input
                      onChange={handlePdfFileChange}
                      type="file"
                      className="form-control"
                      multiple
                    />
                  </div>
                  <div className="col-4">
                    <button className="btn btn-primary" onClick={postPdf}>
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SinglePropertyDocumentsUpload;
