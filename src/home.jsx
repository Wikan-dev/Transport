import Slider from "react-slick";
import Image1 from './assets/image1.png';
import Sponsor1 from './assets/sponsor.png';
import Sponsor2 from './assets/sponsor1.png';
import Sponsor3 from './assets/sponsor2.png';
import Sponsor4 from './assets/sponsor3.png';
import Sponsor5 from './assets/sponsor4.png';
import Background from './assets/background.png';
import listIcon from './assets/listIcon.svg';
import mail from './assets/Mail.svg';
import insta from './assets/Instagram.svg';
import phone from './assets/Phone.svg';
import car from './assets/car.svg';
import data from '../backend/data/main.json';
import { useLocation, Link } from "react-router-dom";

const MiniIcon = ({gambar, title}) => {
    return (
        <div className="relative z-20">
            <div className="bg-white drop-shadow-xl w-14 p-2 rounded-full mx-auto">
                <img src={gambar} alt="price list" />
            </div>
            <h1>
                {title} 
            </h1>
        </div>
    )
}

const TourList = ({ gambar, harga, nama }) => {
    let hasil = Number(harga.toString().slice(0, 3));
    

    return (
        <div className="bg-white drop-shadow-xl w-fit p-3">
            <img src={gambar} alt="" className="w-30" />
            <h1 className="acumalaka font-bold text-[15px] w-30 truncate mt-3">{nama}</h1>
            <h1 className="text-[#EF7721] text-[25px] font-bold acumalaka">{hasil}K</h1>
        </div>
    )
}

const Home = () => {
    const { state } = useLocation();
    let nama = state?.userName || [];
    // console.log(nama);
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false
    }

    return (
        <div className="p-5 w-full">
            <div className="flex">
                <div className="w-10 h-10 bg-red-500 rounded-full"></div>
                <h1 className="ml-5 font-bold relative top-1 text-[20px]">{nama}</h1>
            </div>

            <div className="rounded-tl-2xl rounded-tr-2xl mt-5 absolute w-full left-0 drop-shadow-2xl/80 bg-red-500 h-auto inline-block z-10 ">
                <Slider {...settings} className="reltive z-10">
                    <div>
                        <img src={Image1} alt="image" className="rounded-tl-2xl rounded-tr-2xl h-auto w-full" />
                    </div>
                    <div>
                        <img src={Image1} alt="image" className="rounded-tl-2xl rounded-tr-2xl h-auto w-full" />
                    </div>
                    <div>
                        <img src={Image1} alt="image" className="rounded-tl-2xl rounded-tr-2xl h-auto w-full" />
                    </div>
                    <div>
                        <img src={Image1} alt="image" className="rounded-tl-2xl rounded-tr-2xl h-auto w-full" />
                    </div>
                </Slider>
                
                <div className="bg-white absolute w-full justify-between px-2 top-60 h-12 p-2 flex flex-row z-20">
                    <img src={Sponsor1} alt="sponsor" />
                    <img src={Sponsor2} alt="sponsor" />
                    <img src={Sponsor3} alt="sponsor" />
                    <img src={Sponsor4} alt="sponsor" />
                    <img src={Sponsor5} alt="sponsor" />
                </div>
                
                <div className="absolute inset-0 z-0 ">
                    <div className="absolute inset-0 z-0 bg-repeat bg-center" style={{ backgroundImage: `url(${Background})`}}></div>
                    {/* <img src={Background} alt="" className="w-full h-full bg-repeat" /> */}
                    {/* <img src={Background} alt="" className="w-full h-full bg-repeat" /> */}
                </div>

                <div className="flex gap-20 justify-center mt-15 max-w-full flex-wrap">
                    <Link to='/Price'><MiniIcon gambar={listIcon} title={'Price List'} /></Link>
                    <Link to='/shuttle'><MiniIcon gambar={car} title={'shuttle'} /></Link>
                    <Link to='/Price'><MiniIcon gambar={listIcon} title={'Price List'} /></Link>   
                </div>

                <div className="relative z-20 px-5 mt-5 flex flex-wrap flex-row justify-center gap-15 px-7 max-w-full">
                    {data.tour.map((item, i) => (
                        <TourList key={i} gambar={import.meta.env.BASE_URL + item.gambar.slice(1)} harga={item.harga} nama={item.nama} />
                    ))}
                </div>

                <div className="h-70 w-full bg-[#373737] z-40 mt-10 relative">
                    <h1 className="text-center text-white khula text-[25px] relative top-5">About us</h1>
                    <div className="w-50 mx-auto h-[1px] bg-white relative top-5"></div>
                    <div className="w-20 mx-auto h-[5px] bg-[#EF7721] relative top-[17px]"></div>

                    <div className="flex justify-between px-5 flex-row-reverse relative top-10">
                        <h1 className="w-40 text-[10px] text-right text-white ">
                            We are a platform dedicated to helping travelers find the best deals for tours and shuttles in Bali. With transparent price comparisons and trusted service providers, we make it easier for you to choose the right transportation and travel packages that fit your needs and budget.
                        </h1>

                        <div className="flex flex-col gap-5">
                            <div className="flex gap-2">
                                <img src={mail} alt="email" />
                                <h1 className="text-white text-[10px] relative top-1">myEmail@gmail.com</h1>
                            </div>
                            <div className="flex gap-2">
                                <img src={phone} alt="email" />
                                <h1 className="text-white text-[10px] relative top-1">0812345678</h1>
                            </div>
                            <div className="flex gap-2">
                                <img src={insta} alt="email" />
                                <h1 className="text-white text-[10px] relative top-1">@myInsta</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const components = { Home, TourList };
export default components.Home;