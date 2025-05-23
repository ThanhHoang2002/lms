/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCodeEditor } from "../hooks/useCodeEditor";
import ProblemDescription from "../components/problem/description";
import CodeEditor from "../components/problem/code-editor";
import LanguageSelector from "../components/problem/language-selector";
import loadingIcon from "../assets/image/loading.gif";
import axios from "axios";
import SubmitHistory from "../components/problem/submit-history";
import SubmitResult from "../components/problem/submit-result";
import {baseUrl} from "../util/constant";

export default function ProblemPage() {
  const [activeTab, setActiveTab] = useState("description");
  const { classExerciseId } = useParams();
  const [problem, setProblem] = useState(null); // State for the fetched data
  const [submissionHistory, setSubmitHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for the loading status
  const token = localStorage.getItem("token"); // Retrieve JWT token
  const [error, setError] = useState(null); // State for any errors

  useEffect(() => {
    if (!classExerciseId) return; // Prevent fetching if no ID is provided

    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      setError(null); // Reset error state

      try {
        const response = await axios.get(
          baseUrl+`class/exercise/${classExerciseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProblem(response.data); // Store the fetched data in state
      } catch (err) {
        setError(err.message || "Failed to fetch data."); // Handle any errors
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchData(); // Call the async function
  }, []);

  useEffect(() => {
    if (!classExerciseId) return; // Prevent fetching if no ID is provided

    const fetchSubmissonData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      setError(null); // Reset error state

      try {
        const response = await axios.get(
          `https://localhost:7104/api/submission/history/${classExerciseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmitHistory(response.data); // Store the fetched data in state
      } catch (err) {
        setError(err.message || "Failed to fetch data."); // Handle any errors
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    if (activeTab === "submissions") {
      fetchSubmissonData();
    }
  }, [activeTab]);

  const {
    code,
    language,
    isRunning,
    output,
    setCode,
    setLanguage,
    runCode,
    setLanguageId,
  } = useCodeEditor();
  return (
    <div className="h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className=" flex-1 max-h-[calc(100vh-64px)] grid grid-cols-2 gap-2 p-3 bg-[rgb(240_240_240_/0.5)]">
        {/* Left Panel */}
        <div className="border flex flex-col border-gray-300 rounded-lg bg-white max-h-[calc(100vh-70px)] shadow-md">
          <div className="flex space-x-4 py-[2px] bg-[#fafafa] rounded-t-lg shadow-sm">
            <button
              className={`px-4 py-2 rounded flex justify-center items-center w-[110px] text-sm ${
                activeTab === "description" ? "font-medium" : "opacity-40 "
              }`}
              onClick={() => setActiveTab("description")}
            >
              <svg
                className="size-4 mr-2 text-blue-500"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="memo"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  fill="currentColor"
                  d="M64 48c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64zM0 64C0 28.7 28.7 0 64 0H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm120 64H264c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 96H264c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 96h48c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                ></path>
              </svg>
              Mô tả
            </button>
            <button
              className={`px-4 py-2 rounded flex justify-center items-center w-[145px] text-sm ${
                activeTab === "submissions" ? "font-medium" : "opacity-40 "
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              <svg
                className="size-4 mr-2 text-blue-500"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="clock-rotate-left"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M48 106.7V56c0-13.3-10.7-24-24-24S0 42.7 0 56V168c0 13.3 10.7 24 24 24H136c13.3 0 24-10.7 24-24s-10.7-24-24-24H80.7c37-57.8 101.7-96 175.3-96c114.9 0 208 93.1 208 208s-93.1 208-208 208c-42.5 0-81.9-12.7-114.7-34.5c-11-7.3-25.9-4.3-33.3 6.7s-4.3 25.9 6.7 33.3C155.2 496.4 203.8 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C170.3 0 94.4 42.1 48 106.7zM256 128c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z"
                ></path>
              </svg>
              Lịch sử nộp
            </button>
          </div>

          <div className="flex-1 w-full overflow-y-auto pt-0 pb-1">
            {activeTab === "description" &&
              (isLoading === false ? (
                error ? (
                  <div>{error}</div>
                ) : (
                  <ProblemDescription problem={problem} />
                )
              ) : (
                <div>Loading problem description...</div>
              ))}

            {activeTab === "submissions" &&
              (isLoading === false ? (
                submissionHistory && submissionHistory.length > 0 ? (
                  <SubmitHistory submissionHistory={submissionHistory} />
                ) : (
                  <div>No submissions found</div>
                )
              ) : (
                <div>Loading problem description...</div>
              ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="border flex flex-col border-gray-300 rounded-lg bg-inherit max-h-[calc(100vh-64px)]">
          <div className="flex space-x-4 bg-[#fafafa] rounded-t-lg shadow-sm justify-between p-[2px] mb-[2px] ">
            <div
              className={`px-4 py-2 rounded flex justify-center items-center w-[100px] text-sm font-medium `}
            >
              <svg
                className="size-4 mr-2 text-green-500"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="code"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path
                  fill="currentColor"
                  d="M399.1 1.1c-12.7-3.9-26.1 3.1-30 15.8l-144 464c-3.9 12.7 3.1 26.1 15.8 30s26.1-3.1 30-15.8l144-464c3.9-12.7-3.1-26.1-15.8-30zm71.4 118.5c-9.1 9.7-8.6 24.9 1.1 33.9L580.9 256 471.6 358.5c-9.7 9.1-10.2 24.3-1.1 33.9s24.3 10.2 33.9 1.1l128-120c4.8-4.5 7.6-10.9 7.6-17.5s-2.7-13-7.6-17.5l-128-120c-9.7-9.1-24.9-8.6-33.9 1.1zm-301 0c-9.1-9.7-24.3-10.2-33.9-1.1l-128 120C2.7 243 0 249.4 0 256s2.7 13 7.6 17.5l128 120c9.7 9.1 24.9 8.6 33.9-1.1s8.6-24.9-1.1-33.9L59.1 256 168.4 153.5c9.7-9.1 10.2-24.3 1.1-33.9z"
                ></path>
              </svg>
              Code
            </div>
            {isRunning === false ? (
              <button
                className="font-medium items-center 
              whitespace-nowrap focus:outline-none 
              inline-flex relative select-none px-3 py-1.5 
              rounded text-[#01B328] hover:bg-[#0000000f]"
                onClick={() => runCode(classExerciseId)}
              >
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mr-2">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="cloud-arrow-up"
                    className="size-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="currentColor"
                      d="M354.9 121.7c13.8 16 36.5 21.1 55.9 12.5c8.9-3.9 18.7-6.2 29.2-6.2c39.8 0 72 32.2 72 72c0 4-.3 7.9-.9 11.7c-3.5 21.6 8.1 42.9 28.1 51.7C570.4 276.9 592 308 592 344c0 46.8-36.6 85.2-82.8 87.8c-.6 0-1.3 .1-1.9 .2H504 144c-53 0-96-43-96-96c0-41.7 26.6-77.3 64-90.5c19.2-6.8 32-24.9 32-45.3l0-.2v0 0c0-66.3 53.7-120 120-120c36.3 0 68.8 16.1 90.9 41.7zM512 480v-.2c71.4-4.1 128-63.3 128-135.8c0-55.7-33.5-103.7-81.5-124.7c1-6.3 1.5-12.8 1.5-19.3c0-66.3-53.7-120-120-120c-17.4 0-33.8 3.7-48.7 10.3C360.4 54.6 314.9 32 264 32C171.2 32 96 107.2 96 200l0 .2C40.1 220 0 273.3 0 336c0 79.5 64.5 144 144 144H464h40 8zM223 255c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V384c0 13.3 10.7 24 24 24s24-10.7 24-24V249.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                    ></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Submit</span>
              </button>
            ) : (
              <div className="flex px-3 justify-center items-center w-[105px]">
                <img src={loadingIcon} alt="loading" />
              </div>
            )}
          </div>

          <div className="flex h-8 items-center justify-between border-b p-3 text-[#0000008c] bg-white ">
            <div className="rounded hover:bg-[#0000000f] px-1">
              <LanguageSelector
                setLanguage={setLanguage}
                setLanguageId={setLanguageId}
              />
            </div>
          </div>

          <div className="flex-1 bg-white rounded-b-lg pb-1">
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>
          <div>
            <SubmitResult output={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
