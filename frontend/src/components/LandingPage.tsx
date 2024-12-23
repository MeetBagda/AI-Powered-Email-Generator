import { Button } from "./ui/button";

function LandingPage() {
  return (
    <div className=" w-full h-screen ">
      <div className=" w-[70%] m-auto h-screen flex flex-col p-5">
        <div className="w-full h-20  flex flex-row justify-between items-center">
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
            <Button variant={'ghost'} className="border border-slate-400">Log In</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-t from-orange-100 to-white-100 rounded-xl">
          <div className="p-11">content</div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
