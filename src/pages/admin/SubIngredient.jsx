import { useState, useEffect } from 'react'
import AdminNav from '../../components/AdminNav'
import { getIngredients } from '../../functions/ingredient'
import { createSub, getSubs } from '../../functions/subIngredient'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import AccordianRow from '../../components/AccordianRow'

const SubIngredient = () => {

    const [name, setName] = useState('')
    const [parent, setParent] = useState('')
    const [ingredients, setIngredients] = useState([])
    // const [allSubs, setAllSubs] = useState([])
    const { user } = useSelector(state => ({ ...state }))

    useEffect(() => {
        loadIngredients();
        // loadSubIngredients();
        // console.log(ingredients);
    }, [])

    const loadIngredients = () => getIngredients().then((c) => setIngredients(c.data))
    // const loadSubIngredients = () => getSubs().then((c) => setAllSubs(c.data))

    const handleCreate = () => {
        if (name.length === 0 || parent.length === 0) return;
        
        createSub({title: name, parent: parent, qty: 0}, user.token)
        .then(res => {
            setName('');
            // setParent('');
            toast.success(`${res.data.title} is created`)
            // loadSubIngredients();
            loadIngredients();
        })
        .catch(err => {
            if (err.response.status === 400) toast.error(err.response.data);
        })

    }

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

                        <div className="flex flex-col">
                            <div className='mb-2'>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input onChange={e => setName(e.target.value)} id="name" name="name" value={name} type="text" autoComplete="name" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Ingredient name" />
                            </div>

                            <div className="mb-2">
                                {/* <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Category</label> */}
                                <select onChange={(e) => {setParent(e.target.value)}} id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none rounded-t-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value={''} defaultChecked>Select Category</option>
                                    {ingredients.length > 0 && ingredients.map((item, i) => (
                                        <option key={i} value={item._id}>{item.title}</option>
                                    ))}
                                </select>
                            </div>

                            <button onClick={handleCreate} type="button" className="py-2 px-4 w-[5rem] inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Create
                            </button>
                        </div>

                        <div className="hs-accordion-group mt-4">

                            {ingredients.length > 0 && ingredients.map((item, i) => (
                                <AccordianRow key={i} ingrediant={item} />
                            ))}
                    
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubIngredient