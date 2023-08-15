import {useState, useEffect} from 'react'
import AdminNav from '../../components/AdminNav'
import AddStockTable from './AddStockTable'
import { getIngredients } from '../../functions/ingredient'

const AddStock = () => {

    const [ingredients, setIngredients] = useState([])

    useEffect(() => {
        loadIngredients();
    }, [])

    const loadIngredients = () => getIngredients().then((c) => setIngredients(c.data))

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

                        {ingredients.length > 0 && ingredients.map((item, i) => (
                            <AddStockTable key={i} ingredient={item}  />

                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStock