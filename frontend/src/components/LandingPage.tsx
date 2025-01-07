import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

function LandingPage() {
  const navigate = useNavigate();

  const handleStartForFreeClick = () => {
    navigate("/signup");
  };

  return (
    <div className="w-full h-screen">
      <div className="w-[70%] m-auto h-screen flex flex-col pb-5">
        {/* header */}
        <div className="w-full h-20 flex flex-row justify-between items-center">
          {/* logo */}
          <div className="p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="60"
              height="60"
              viewBox="0 0 48 48"
            >
              <path
                fill="#00838f"
                d="M4,13h10v29.016c0,0.891-1.077,1.337-1.707,0.707l-7.815-9.163C4.17,33.199,4,32.739,4,32.263V13z"
              ></path>
              <path
                fill="#ef5350"
                d="M34,13h10v19.263c0,0.476-0.17,0.936-0.478,1.298l-7.815,9.163C35.077,43.353,34,42.907,34,42.016V13	z"
              ></path>
              <path
                fill="#a5d6a7"
                d="M12.706,5.266L24,16v15L4,13l7.323-7.704C11.702,4.918,12.311,4.905,12.706,5.266z"
              ></path>
              <path
                fill="#ffecb3"
                d="M36.249,5.255L24,16v15l20-18l-6.352-7.64C37.288,4.949,36.666,4.902,36.249,5.255z"
              ></path>
            </svg>
          </div>
          {/* buttons */}
          <div className="flex flex-row gap-3 p-3">
            <Button
              onClick={() => {
                navigate("/signin");
              }}
              variant={"ghost"}
              className="border border-slate-400"
            >
              Log In
            </Button>
            <Button
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
        {/* content */}
        <div className="flex-1 bg-gradient-to-t from-[#FAF0E6] to-[#FAFAFA] rounded-xl flex flex-col gap-11 justify-center items-center ">
          <div className="text-center font-display text-4xl font-medium text-neutral-900 animate-fadeinup">
            <span>Generate Emails With</span>
            <br /> <span>SuperPowers</span>
          </div>
          <div className="text-2xl text-gray-500 animate-fadeinup">
            <p>Conquer Your Inbox with AI-Powered Email Generation</p>
          </div>
          <div className="flex flex-row gap-3 animate-fadeinup">
            <Button onClick={handleStartForFreeClick}>Start for free</Button>
            <Button className="border border-slate-400" variant={"ghost"}>
              Get Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;