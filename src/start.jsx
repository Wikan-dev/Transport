import { Link } from "react-router-dom";
import logo from './assets/logo.png'

const Start = () => {
    return (
        <div className="bg-[#EF7721] h-[100vh] px-5">
            <img src={logo} alt="logo" className="relative top-20" />

            <div className="absolute bottom-10">
                <h1 className="kanit font-bold text-white text-[40px] text-base/12 ">Hello There, ready to go around Bali?</h1>
                <Link to={'/start'}><button className="kanit font-bold text-white text-[30px] bg-[#FAA433] w-[95%] mx-auto rounded-2xl py-2 mt-5">Lets Go</button></Link>
            </div>
        </div>
    )
}

export default Start;