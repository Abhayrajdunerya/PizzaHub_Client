import { useState, useEffect } from 'react'
import { addQty } from '../functions/subIngredient'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const threshold = import.meta.env.VITE_THRESHOLD;

const OrderRow = ({ subIngredient, loadSubIngredients }) => {

    const [qty, setQty] = useState(0);
    const { user } = useSelector(state => ({ ...state }))

    const handleAddQty = () => {
        addQty(subIngredient._id, parseInt(subIngredient.qty)+parseInt(qty), user.token)
        .then(res => {
            loadSubIngredients();
        })
        .catch(err => {
            toast.error(err)
        })
    }

    return (
        <tr>
            <td className={`px-4 py-4 text-sm whitespace-nowrap ${subIngredient.qty < threshold ? 'bg-red-200 border border-red-600' : ''}`}>
                <div>
                    <h4 className="text-gray-700 dark:text-gray-200">{subIngredient.title}</h4>
                    {/* <p className="text-gray-500 dark:text-gray-400">Brings all your news into one place</p> */}
                </div>
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div>
                    <h4 className="text-gray-700 dark:text-gray-200">{subIngredient.qty}</h4>
                    {/* <p className="text-gray-500 dark:text-gray-400">Brings all your news into one place</p> */}
                </div>
            </td>
            {/* <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div>
                    <h4 className="text-gray-700 dark:text-gray-200">{subIngredient.sold}</h4>
                    <p className="text-gray-500 dark:text-gray-400">Brings all your news into one place</p>
                </div>
            </td> */}
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div className="">
                    <div className='my-2'>
                        <input onChange={e => setQty(e.target.value)} id="name" name="name" value={qty} type="number" autoComplete="name" required className={`appearance-none w-16 rounded-none relative px-3 py-2 border ${subIngredient.qty < threshold ? 'border-red-500 border-l-8' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`} placeholder="Enter qty." />
                    </div>
                    <button onClick={handleAddQty} type="button" className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                        Add
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default OrderRow