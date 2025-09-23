import data from '../backend/data/main.json'
import filter from './assets/Filter.svg'
import search from './assets/search.svg'
import components from './home'

const Price = () => {
    return (
        <div className='p-5 pt-10'>
            <div className='relative'>
                <img src={search} alt="search icon" className='absolute top-2 left-4 w-7' />
                <input type="text" className='h-10 w-full rounded-xl outline-1 pl-13' placeholder='Search' />
            </div>

            <div className='mt-7'>
                {data.tour.map((item, i) => (
                    <components.TourList key={i} gambar={import.meta.env.BASE_URL + item.gambar.slice(1)} harga={item.harga} nama={item.nama} />
                ))}
            </div>
        </div>
    )
}

export default Price;