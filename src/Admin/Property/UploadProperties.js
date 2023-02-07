import React, { useEffect, useState } from "react";
import AdminSideBar from "../AdminSideBar";
import Papa from "papaparse";
import { useRef } from "react";
import Layout from "../../components/1.CommonLayout/Layout";
import { rootTitle } from "../../CommonFunctions";

const allowedExtensions = ["csv"];
const chunkSize = 3048;
const UploadProperties = () => {
  const [files, setFiles] = useState([]);
  const [saveFile, setSavedFile] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);
  const [chunkData, setChunkData] = useState("");

  const [allUseStates, setAllUseStates] = useState({
    data: [],
    tableHeadings: [],
    tableDisplayClass: "d-none",
  });

  const [dropzoneActive, setDropzoneActive] = useState(false);
  const [fileName, setFileName] = useState("");

  const fileRef = useRef();
  const { data, tableHeadings, tableDisplayClass } = allUseStates;

  const onCancelClick = (e) => {
    setAllUseStates({
      ...allUseStates,
      tableDisplayClass: "d-none",
    });
    fileRef.current.value = "";
    setFileName("");
    window.scrollTo(0, 0);
  };

  const readFileFunction = (inputFile) => {
    setFileName(inputFile.name);
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv.data;
      setAllUseStates({
        ...allUseStates,
        tableHeadings: Object.keys(parsedData[0]),
        data: parsedData,
        tableDisplayClass: "",
      });
    };
    reader.readAsText(inputFile);
    setDropzoneActive(false);
    document.getElementById("showCsvDataInTable").scrollIntoView(true);
  };

  const fileUpload = (e) => {
    setSavedFile([...files, ...e.target.files]);
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Please upload a csv file");
        fileRef.current.value = "";
        setFileName("");
        return;
      } else {
        readFileFunction(inputFile);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setSavedFile([...files, ...e.dataTransfer.files]);
    if (e.dataTransfer.files.length) {
      const inputFile = e.dataTransfer.files[0];
      const fileExtension = inputFile.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Please upload a csv file");
        setDropzoneActive(false);
        return;
      } else {
        readFileFunction(inputFile);
      }
    }
  };

  const readAndUploadCurrentChunk = () => {
    const reader = new FileReader();
    const file = files[currentFileIndex];
    if (!file) {
      return;
    }
    const from = currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(blob);
  };

  const uploadChunk = (readerEvent) => {
    let fileSize = 0;
    const file = files[currentFileIndex];
    const size = Math.round(file.size / 1024) + 1;
    fileSize = size >= 1024 ? (size / 1024).toFixed(1) + " MB" : size + " KB";
    const data = readerEvent.target.result.split(",")[1];
    const detailsToShow = `Name: ${
      file.name
    } ----- Size: ${fileSize} ----- TotalChunks: ${Math.ceil(
      file.size / chunkSize
    )} ----- Data For Chunk: ${currentChunkIndex + 1} is ====> ${data}`;
    setChunkData(chunkData + "      " + detailsToShow);
    console.log(detailsToShow);
    // const headers = { "Content-Type": "application/octet-stream" };
    const chunks = Math.ceil(file.size / chunkSize) - 1;
    const isLastChunk = currentChunkIndex === chunks;
    console.warn("IS LAST CHUNK: ", isLastChunk);
    if (isLastChunk) {
      setLastUploadedFileIndex(currentFileIndex);
      setCurrentChunkIndex(null);
    } else {
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  };

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedFileIndex === files.length - 1;
    const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
    setCurrentFileIndex(nextFileIndex);
  }, [lastUploadedFileIndex]);

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
        );
      }
    }
  }, [files.length]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);

  const postChunksToDataBase = () => {
    setFiles(saveFile);
  };

  useEffect(() => {
    rootTitle.textContent = "ADMIN - UPLOAD PROPERTIES";
  }, []);

  return (
    <Layout>
      <div
        className="container-fluid section-padding"
        onDrop={(e) => {
          e.preventDefault();
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-md-8 wrapper mt-4 mt-md-0">
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-xl-7 col-md-11 shadow p-md-4 p-3 mb-5 upload-file-main-wrapper">
                  <div className="">
                    <div
                      onDragOver={(e) => {
                        setDropzoneActive(true);
                        e.preventDefault();
                      }}
                      onDragLeave={(e) => {
                        setDropzoneActive(false);
                        e.preventDefault();
                      }}
                      onDrop={(e) => handleDrop(e)}
                      className={`py-3 upload-file-inner-wrapper ${
                        dropzoneActive ? "active" : ""
                      }`}
                    >
                      <div className="text-center fs-3 fw-bold">
                        Choose a file or drag it here
                      </div>

                      <div className="upload-btn-wrapper py-xl-3 py-md-2 py-1 w-100">
                        <i className="bi bi-upload fs-1 upload-iocn"></i>
                        <input
                          ref={fileRef}
                          onChange={fileUpload}
                          className="upload-csv-file"
                          type="file"
                          id="formFile"
                        />
                      </div>
                      {fileName ? (
                        <div className="text-center fs-5">{fileName}</div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="mt-2">
                      <small className="text-white">
                        Refer to the csv file example below.
                      </small>
                      <br />
                      <img
                        src="/sample-img.png"
                        className="img-fluid border mt-2"
                        alt="hint-img"
                      />
                    </div>
                  </div>
                </div>

                <div
                  id="showCsvDataInTable"
                  className="col-xl-12 position-relative mb-5"
                >
                  <div
                    className={`${tableDisplayClass} csv-data-table-wrapper`}
                  >
                    <table className="table table-striped table-bordered table-dark h-100">
                      <thead>
                        <tr>
                          {tableHeadings.map((heading, Index) => {
                            return <th key={Index}>{heading}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((i, Index) => {
                          return (
                            <tr key={Index}>
                              {tableHeadings.map((heading, Index) => {
                                return <td key={Index}>{i[heading]}</td>;
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="text-end mt-3 bg-dark position-absolute save-cancel-btn-div">
                      <button
                        className="btn btn-success me-2"
                        onClick={postChunksToDataBase}
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          onCancelClick(e);
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadProperties;
