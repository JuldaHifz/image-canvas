/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";

function App() {
  const [canvasWidth, setCanvasWidth] = useState(640);
  const [canvasHeight, setCanvasHeight] = useState(360);
  const [inputCanvasWidth, setInputCanvasWidth] = useState(640);
  const [inputCanvasHeight, setInputCanvasHeight] = useState(360);

  const [imgSrc, setImgSrc] = useState(null);
  const [imgX, setImgX] = useState(0);
  const [imgY, setImgY] = useState(0);
  const [inputImgX, setInputImgX] = useState(0);
  const [inputImgY, setInputImgY] = useState(0);

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [inputImgWidth, setInputImgWidth] = useState(0);
  const [inputImgHeight, setInputImgHeight] = useState(0);

  const [error, setError] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("File bukan gambar!");
      setShowErrorPopup(true);
      imgSrc(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      console.log("FileReader onload triggered");
      const img = new Image();
      img.onload = () => {
        setImgSrc(reader.result);
        setImgX(0);
        setImgY(0);

        const canvas = canvasRef.current;
        console.log("canvas", canvas.width, canvas.height);
        const ctx = canvas.getContext("2d");

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const scaledImgWidth = img.width * scale;
        const scaledImgHeight = img.height * scale;

        setImgWidth(scaledImgWidth);
        setImgHeight(scaledImgHeight);
        setInputImgWidth(scaledImgWidth);
        setInputImgHeight(scaledImgHeight);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, imgX, imgY, scaledImgWidth, scaledImgHeight);
      };
      setError(null);
      setShowErrorPopup(false);

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const handleCanvasChange = () => {
    setError(null);
    setShowErrorPopup(false);
    const width = parseInt(inputCanvasWidth, 10);
    const height = parseInt(inputCanvasHeight, 10);
    if (width < 100 || height < 100) {
      setError("Width atau Height kurang dari 100");
      setShowErrorPopup(true);
      return;
    }

    // setCanvasWidth(width);
    // setCanvasHeight(height);

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    setCanvasWidth(width);
    setCanvasHeight(height);

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    if (imgSrc) {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const scaledImgWidth = img.width * scale;
        const scaledImgHeight = img.height * scale;

        setImgWidth(scaledImgWidth);
        setImgHeight(scaledImgHeight);

        ctx.drawImage(img, imgX, imgY, scaledImgWidth, scaledImgHeight);
      };
    }
  };

  const handleImageChange = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, inputImgX, inputImgY, inputImgWidth, inputImgHeight);
      setImgX(inputImgX);
      setImgY(inputImgY);
      setImgHeight(inputImgHeight);
      setImgWidth(inputImgWidth);
    };
    img.src = imgSrc;
  };

  return (
    <>
      {showErrorPopup && (
        <div className="flex justify-center items-center mt-5">
          <span className=" bg-red-100 px-5 py-7 rounded-lg border-red-500 text-red-900">
            {error}
          </span>
        </div>
      )}
      <div className="flex flex-row justify-center gap-4 mt-10">
        <div className="flex flex-col gap-3 items-center">
          <h2 className="font-bold text-xl">Canvas Properties</h2>
          <label className="flex gap-2 border-[1px] px-3 py-1 hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <span>Width </span>
            <input
              className=" pl-2 border-l-[1px]"
              type="number"
              value={inputCanvasWidth}
              onChange={(e) => setInputCanvasWidth(e.target.value)}
              min={100}
            />
          </label>
          <label className="flex gap-2 border-[1px] px-3 py-1 hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <span>Height</span>
            <input
              className=" pl-2 border-l-[1px]"
              type="number"
              value={inputCanvasHeight}
              onChange={(e) => setInputCanvasHeight(e.target.value)}
              min={100}
            />
          </label>
          <button
            className={` border border-blue-500 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 ${
              imgSrc ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleCanvasChange}
            disabled={imgSrc}
          >
            Change Size
          </button>
        </div>

        <div>
          <canvas
            className=" border-2"
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
          ></canvas>
          <label className="flex gap-2 border-[1px] px-3 py-1 mt-4 hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <span className="px-4">Pilih File</span>
            <input
              className=" pl-2 border-l-[1px]"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </div>

        {imgSrc && (
          <div className="flex flex-col gap-3 items-center">
            <h2 className="font-bold text-xl">Image Properties</h2>
            <label className="flex gap-2 border-[1px] px-3 py-1 hover:shadow-lg transition-shadow duration-300 ease-in-out">
              X{" "}
              <input
                className=" pl-2 border-l-[1px]"
                type="number"
                value={inputImgX}
                onChange={(e) => setInputImgX(e.target.value)}
              />
            </label>
            <label className="flex gap-2 border-[1px] px-3 py-1 hover:shadow-lg transition-shadow duration-300 ease-in-out">
              Y{" "}
              <input
                className=" pl-2 border-l-[1px]"
                type="number"
                value={inputImgY}
                onChange={(e) => setInputImgY(e.target.value)}
              />
            </label>
            <label className="flex gap-2 border-[1px] px-3 py-1 hover:shadow-lg transition-shadow duration-300 ease-in-out">
              Width{" "}
              <input
                className=" pl-2 border-l-[1px]"
                type="number"
                value={inputImgWidth}
                onChange={(e) => setInputImgWidth(e.target.value)}
              />
            </label>
            <label className="flex gap-2 border-[1px] px-3 py-1 hover:shadow-lg transition-shadow duration-300 ease-in-out">
              Height{" "}
              <input
                className=" pl-2 border-l-[1px]"
                type="number"
                value={inputImgHeight}
                onChange={(e) => setInputImgHeight(e.target.value)}
              />
            </label>
            <button
              className=" border border-blue-500 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={handleImageChange}
            >
              Change Size
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
