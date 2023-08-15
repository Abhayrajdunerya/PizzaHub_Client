import {useState, useEffect} from 'react'
import AddQtyRow from '../../components/AddQtyRow'
import { getIngredientSubs } from '../../functions/ingredient'

const AddStockTable = ({ingredient}) => {

    const [subIngredients, setSubIngredients] = useState([])

    useEffect(() => {
        loadSubIngredients();
    }, [])

    const loadSubIngredients = () => getIngredientSubs(ingredient._id).then((c) => setSubIngredients(c.data))

    return (
        <div className="flex flex-col mt-6 overflow-y-hidden scrollbar-hide">
            <div className="my-2 text-lg font-medium">{ingredient.title}</div>
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">

                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Title
                                    </th>

                                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Avl. Qty.
                                    </th>

                                    {/* <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Sold
                                    </th> */}

                                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Add Qty.
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">

                                {subIngredients.length > 0 && subIngredients.map((item, i) => (
                                    <AddQtyRow key={item._id} subIngredient={item} loadSubIngredients={loadSubIngredients} />
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStockTable