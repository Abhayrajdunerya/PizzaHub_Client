import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import AdminNav from '../../components/AdminNav'

import { createIngredient, getIngredients, removeIngredient, updateIngredient } from '../../functions/ingredient'
import IngredientCard from '../../components/IngredientCard'
import { useNavigate } from 'react-router-dom'

const Ingredient = () => {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [ingredients, setIngredients] = useState([])
    const [keyword, setKeyword] = useState('')
    const { user } = useSelector(state => ({ ...state }))

    const navigate = useNavigate();

    useEffect(() => {
        loadIngredients();
        // console.log(ingredients);
    }, [])

    const loadIngredients = () => getIngredients().then((c) => setIngredients(c.data))

    const handleCreate = () => {
        if (name.length == 0) return;
        setLoading(true);

        createIngredient(name, user.token)
            .then(res => {
                setLoading(false);
                setName('');
                toast.success(`${res.data.title} is created`)
                loadIngredients();
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            })
    }

    const handleRemove = async (slug) => {
        if (window.confirm('Delete?')) {
            setLoading(true);
            // remove-category
            removeIngredient(slug, user.token)
                .then(res => {
                    setLoading(false)
                    toast.error(`${res.data.title} deleted`);
                    loadIngredients();
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                    toast.error(err.response.data)
                })
        }
        // console.log(slug);
    }

    const handleUpdate = (newTitle, slug) => {
        if (newTitle.length === 0) return;
        setLoading(true);
        updateIngredient(slug, newTitle, user.token)
        .then(res => {
            setLoading(false)
            toast.success(`${res.data.title} is updated`);
            navigate('/admin/ingredient');
          })
          .catch (err => {
            console.log(err);
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data);
          })
        // console.log(newTitle);
        // console.log(slug);
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

                        <div className="space-y-2">
                            <div className='mb-2'>
                                <label htmlFor="email" className="sr-only">Name</label>
                                <input onChange={e => setName(e.target.value)} id="name" name="name" value={name} type="text" autoComplete="name" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Ingredient name" />
                            </div>
                            <button onClick={handleCreate} type="button" className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Create
                            </button>
                        </div>

                        <div className="mt-4 flex flex-wrap">
                            
                            {ingredients.length > 0 && ingredients.map((item, i) => (
                                <IngredientCard key={i} item={item} handleRemove={handleRemove} handleUpdate={handleUpdate} />
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ingredient