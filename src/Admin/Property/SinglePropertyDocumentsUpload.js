import React, { useEffect, useState } from "react";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";

let authHeader = "";
let temp = 0;
let chunkSize = 0;

const SinglePropertyDocumentsUpload = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const [currentPropertyNumber, setCurrentPropertyNumber] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [savedImageFiles, setSavedImageFiles] = useState([]);
  const [currentImageFileIndex, setCurrentImageFileIndex] = useState(null);
  const [lastUploadedImageFileIndex, setLastUploadedImageFileIndex] =
    useState(null);
  const [currentChunkIndexOfImage, setCurrentChunkIndexOfImage] =
    useState(null);
  const [uniqueId, setUniqueId] = useState(uuid());
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageFileChange = (e) => {
    e.preventDefault();
    setSavedImageFiles([...imageFiles, ...e.target.files]);
  };

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };

  const readAndUploadCurrentImageChunk = () => {
    const reader = new FileReader();
    const file = imageFiles[currentImageFileIndex];
    if (!file) {
      return;
    }
    chunkSize = Math.round((file.size * 39) / 100);
    const from = currentChunkIndexOfImage * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadImageChunk(e);
    reader.readAsDataURL(blob);
  };

  const uploadImageChunk = async (readerEvent) => {
    const file = imageFiles[currentImageFileIndex];
    const size = file.size;
    let tempChunkSize = chunkSize;
    temp += tempChunkSize;
    if (temp > size) {
      tempChunkSize = size - (temp - chunkSize);
    }
    const data = readerEvent.target.result.split(",")[1];
    const detailsToPost = {
      upload_id: uniqueId,
      property_numner: currentPropertyNumber,
      chunk_number: currentChunkIndexOfImage + 1,
      total_chunks: Math.ceil(size / chunkSize),
      chunk_size: tempChunkSize,
      total_file_size: size,
      file_name: file.name,
      data: data,
    };
    console.log(detailsToPost);
    const chunks = Math.ceil(file.size / chunkSize) - 1;
    const isLastChunk = currentChunkIndexOfImage === chunks;
    console.warn("IS LAST CHUNK: ", isLastChunk);
    try {
      await axios
        .post(`/sam/v1/property/auth/property-documents`, detailsToPost, {
          headers: authHeader,
        })
        .then((res) => {
          if (isLastChunk) {
            if (res.data.msg !== 0) {
              setImageLoading(false);
              toast.error("Error while uploading files");
              reloadPage();
            } else {
              if (currentImageFileIndex === savedImageFiles.length - 1) {
                setImageLoading(false);
                toast.success("Files uploaded successfully");
                reloadPage();
              }
            }
          }
        });
    } catch (error) {
      if (isLastChunk) {
        setImageLoading(false);
        toast.error("Internal server error");
        reloadPage();
      }
    }
    if (isLastChunk) {
      setUniqueId(uuid());
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
    setImageLoading(true);
    setImageFiles(savedImageFiles);
  };

  // const [pdfFiles, setPdfFiles] = useState([]);
  // const [savedPdfFiles, setSavedPdfFiles] = useState([]);
  // const [currentPdfFileIndex, setCurrentPdfFileIndex] = useState(null);
  // const [lastUploadedPdfFileIndex, setLastUploadedPdfFileIndex] =
  //   useState(null);
  // const [currentChunkIndexOfPdf, setCurrentChunkIndexOfPdf] = useState(null);

  // const [uniqueIdForPdf, setUinqueIdForPdf] = useState(uuid());
  // const [pdfLoading, setPdfLoading] = useState(false);

  // const handlePdfFileChange = (e) => {
  //   e.preventDefault();
  //   setSavedPdfFiles([...pdfFiles, ...e.target.files]);
  // };

  // const readAndUploadCurrentPdfChunk = () => {
  //   const reader = new FileReader();
  //   const file = pdfFiles[currentPdfFileIndex];
  //   if (!file) {
  //     return;
  //   }
  //   chunkSize = Math.round((file.size * 39) / 100);
  //   const from = currentChunkIndexOfPdf * chunkSize;
  //   const to = from + chunkSize;
  //   const blob = file.slice(from, to);
  //   reader.onload = (e) => uploadPdfChunk(e);
  //   reader.readAsDataURL(blob);
  // };
  // const uploadPdfChunk = async (readerEvent) => {
  //   const file = pdfFiles[currentPdfFileIndex];
  //   const size = file.size;
  //   let tempChunkSize = chunkSize;
  //   temp += tempChunkSize;
  //   if (temp > size) {
  //     tempChunkSize = size - (temp - chunkSize);
  //   }
  //   const data = readerEvent.target.result.split(",")[1];
  //   const detailsToPost = {
  //     upload_id: uniqueIdForPdf,
  //     property_numner: currentPropertyNumber,
  //     chunk_number: currentChunkIndexOfPdf + 1,
  //     total_chunks: Math.ceil(size / chunkSize),
  //     chunk_size: tempChunkSize,
  //     total_file_size: size,
  //     file_name: file.name,
  //     data: data,
  //   };
  //   console.log(detailsToPost);
  //   const chunks = Math.ceil(file.size / chunkSize) - 1;
  //   const isLastChunk = currentChunkIndexOfPdf === chunks;
  //   console.warn("IS LAST CHUNK: ", isLastChunk);
  //   try {
  //     await axios
  //       .post(`/sam/v1/property/auth/property-documents`, detailsToPost, {
  //         headers: authHeader,
  //       })
  //       .then((res) => {
  //         if (isLastChunk) {
  //           if (res.data.msg !== 0) {
  //             setPdfLoading(false);
  //             toast.error("Error while uploading files");
  //             reloadPage();
  //           } else {
  //             if (currentPdfFileIndex === savedPdfFiles.length - 1) {
  //               setPdfLoading(false);
  //               toast.success("Files uploaded successfully");
  //               reloadPage();
  //             }
  //           }
  //         }
  //       });
  //   } catch (error) {
  //     if (isLastChunk) {
  //       setPdfLoading(false);
  //       toast.error("Internal server error");
  //       reloadPage();
  //     }
  //   }
  //   if (isLastChunk) {
  //     setUinqueIdForPdf(uuid());
  //     setLastUploadedPdfFileIndex(currentPdfFileIndex);
  //     setCurrentChunkIndexOfPdf(null);
  //   } else {
  //     setCurrentChunkIndexOfPdf(currentChunkIndexOfPdf + 1);
  //   }
  // };

  // useEffect(() => {
  //   if (lastUploadedPdfFileIndex === null) {
  //     return;
  //   }
  //   const isLastFile = lastUploadedPdfFileIndex === pdfFiles.length - 1;
  //   const nextFileIndex = isLastFile ? null : currentPdfFileIndex + 1;
  //   setCurrentPdfFileIndex(nextFileIndex);
  //   // eslint-disable-next-line
  // }, [lastUploadedPdfFileIndex]);

  // useEffect(() => {
  //   if (pdfFiles.length > 0) {
  //     if (currentPdfFileIndex === null) {
  //       setCurrentPdfFileIndex(
  //         lastUploadedPdfFileIndex === null ? 0 : lastUploadedPdfFileIndex + 1
  //       );
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [pdfFiles.length]);

  // useEffect(() => {
  //   if (currentPdfFileIndex !== null) {
  //     setCurrentChunkIndexOfPdf(0);
  //   }
  // }, [currentPdfFileIndex]);

  // useEffect(() => {
  //   if (currentChunkIndexOfPdf !== null) {
  //     readAndUploadCurrentPdfChunk();
  //   }
  //   // eslint-disable-next-line
  // }, [currentChunkIndexOfPdf]);

  // const postPdf = (e) => {
  //   e.preventDefault();
  //   setPdfLoading(true);
  //   setPdfFiles(savedPdfFiles);
  // };

  useEffect(() => {
    let propertyNumber = localStorage.getItem("property_number");
    if (propertyNumber) {
      setCurrentPropertyNumber(propertyNumber);
    }
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 wrapper mt-md-0">
            <section className="upload-documents-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <h4 className="fw-bold text-primary p-0">
                    Property Number: {currentPropertyNumber}
                  </h4>
                  <hr />
                </div>
                <div className="row border p-4">
                  <h5 className="mb-3">Upload Property Documents</h5>
                  <div className="col-xl-4 col-md-7 col-12">
                    <input
                      onChange={handleImageFileChange}
                      type="file"
                      multiple
                      className="form-control"
                    />
                  </div>
                  <div className="col-xl-3 col-md-5 col-12 mt-4 mt-md-0">
                    <button
                      disabled={
                        savedImageFiles.length === 0 || imageLoading
                          ? true
                          : false
                      }
                      className="btn btn-primary w-100"
                      onClick={postImages}
                    >
                      {imageLoading ? (
                        <>
                          <div
                            className="spinner-border spinner-border-sm text-light me-2"
                            role="status"
                          ></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  </div>
                </div>
                {/* <div className="row border p-4 mt-4">
                  <h5 className="mb-3">Upload Property Documents</h5>
                  <div className="col-xl-4 col-md-7 col-12">
                    <input
                      onChange={handlePdfFileChange}
                      type="file"
                      className="form-control"
                      multiple
                    />
                  </div>
                  <div className="col-xl-3 col-md-5 col-12 mt-4 mt-md-0">
                    <button
                      disabled={
                        savedPdfFiles.length === 0 || pdfLoading ? true : false
                      }
                      className="btn btn-primary w-100"
                      onClick={postPdf}
                    >
                      {pdfLoading ? (
                        <>
                          <div
                            className="spinner-border spinner-border-sm text-light me-2"
                            role="status"
                          ></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  </div>
                </div> */}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SinglePropertyDocumentsUpload;
