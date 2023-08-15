import {useState, useEffect} from 'react'
import AdminNav from '../../components/AdminNav'
import PizzaCard from '../../components/PizzaCard'
import { images } from '../../constants'
import { getProductsByCount } from '../../functions/pizza'

const Pizza = () => {

    const [pizzaList, setPizzaList] = useState([]);

    useEffect(() => {
        loadPizzas();
    }, [])

    const loadPizzas = () => getProductsByCount(10).then(res => setPizzaList(res.data)).catch(err => console.log(err));

    return (
        <div className="">
            <div className="container px-5  py-5 mx-auto">
                <div className="flex flex-col text-center w-full ">
                    <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">Admin Dashboard</h1>
                </div>
            </div>

            <div className="">
                <AdminNav />
            </div>
            <div className="">
                <div className="p-4 sm:ml-64">
                    <div className="p-4 border-2 min-h-screen border-gray-200 border-dashed rounded-lg dark:border-gray-700">

                        <div className="flex flex-wrap -m-4 justify-center items-center">
                            {pizzaList.length > 0 && pizzaList.map((item, i) => (
                                <PizzaCard key={i} admin={true} product={item} delete={true} />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pizza