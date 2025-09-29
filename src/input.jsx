import { Link } from "react-router-dom";
import { use, useEffect, useState } from "react";

const InputData = () => {
    const [nama, setNama] = useState("");

    return (
        <div className="bg-[#EF7721] h-[100vh] px-5 pt-10">
            <h1 className="kanit text-[40px] text-white mb-5">WHATS YOUR NAME?</h1>

            <div className="bg-white h-[75.9vh] absolute w-full left-0 rounded-tl-4xl rounded-tr-4xl p-7">
                <h1 className="text-[20px]">NAME</h1>
                <input onChange={(e) => setNama(e.target.value)} type="text" className="bg-white w-full h-15 rounded-2xl outline-1 mt-3 pl-5" placeholder="input your name here" />
                <Link to={'/home'} state={{ userName : nama }}><button className="kanit font-bold text-white text-[30px] bg-[#FAA433] w-[90%] mx-auto rounded-2xl py-2 left-5 mt-5 absolute bottom-10">Lets Go</button></Link>
            </div>
        </div>
    )
}

export default InputData;