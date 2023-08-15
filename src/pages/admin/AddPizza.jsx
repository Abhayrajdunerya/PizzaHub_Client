import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import Multiselect from 'multiselect-react-dropdown';
import AdminNav from '../../components/AdminNav'
import { getIngredients } from '../../functions/ingredient';
import { getSubsByCategory } from '../../functions/subIngredient';
import { createProduct } from '../../functions/pizza';
import FileUpload from '../../components/FileUpload';

const initialState = {
    title: '',
    description: '',
    price: '',
    ingredients: [],
    subIngredients: [],
    ingredient: '',
    images: [],
    sizes: ['s', 'm', 'l', 'xl'],
}

const AddPizza = () => {

    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [selectedSubs, setSelectedSubs] = useState([]);
    
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadIngredients();
    }, []);

    useEffect(() => {
        getSubsByCategory(values.ingredient)
        .then(res => {
            setSubOptions(res.data);
            // setSelectedSubs([]);
        })
        .catch(err => console.log(err));
    }, [values.ingredient])

    useEffect(() => {
        setValues({ ...values, subIngredients: selectedSubs });
        console.log(values.subIngredients);
    }, [selectedSubs])

    const loadIngredients = () => getIngredients().then((c) => {
        setValues({ ...values, ingredients: c.data });
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleCreate = () => {
        if (values.title.length === 0 || values.description.length === 0 || values.ingredient.length === 0 || values.price.length === 0 || values.images.length === 0) {
            toast.error("All fields are required");
            return;
        }

        createProduct(values, user.token)
        .then(res => {
            console.log(res);
            window.alert(`${res.data.title} is created`);
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.err);
        })
    }

    const handleSubChange  = (selectedItem) => {
        setSelectedSubs([]);
        setValues({ ...values, subIngredients: []})
        selectedItem.map((item, i) => {
            
            setSelectedSubs(prev => {
                return [...prev, item._id];
            })
        })
        
        setValues({ ...values, subIngredients: selectedSubs})
        return selectedSubs;
    }


    return (
        <div className="">
            <div className="container px-5  py-5 mx-auto">
                <div className="flex flex-col text-center w-full ">
                    {loading ? <h1 className="text-2xl font-medium title-font mb-4 text-red-700">Loading ... </h1> : <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">Admin Dashboard</h1>}
                </div>
            </div>

            <div className="">
                <AdminNav />
            </div>
            <div className="">
                <div className="p-4 sm:ml-64">
                    <div className="p-4 space-y-2 border-2 min-h-screen border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            
                    <FileUpload values={values} setValues={setValues} setLoading={setLoading} />

                    <input onChange={handleChange} type="text" name='title' value={values.title} id='name' className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Title" />
                    <textarea onChange={handleChange} name='description' value={values.description} id='description' className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" rows="3" placeholder="Description" />
                    <input onChange={handleChange} type="number" name='price' value={values.price} id='price' className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Price" />

                    <select onChange={handleChange} name='ingredient' value={values.ingredient} id="ingredient" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={''} defaultChecked>Select Category</option>
                        {values.ingredients.length > 0 && values.ingredients.map((item, i) => (
                            <option key={i} value={item._id}>{item.title}</option>
                        ))}
                    </select>

                    <Multiselect 
                        options={subOptions}
                        onSelect={handleSubChange}
                        onRemove={handleSubChange}
                        placeholder='Select Sub Ingredients'
                        displayValue='title'
                        showArrow={true}
                        className=''
                        
                    />

                    <button onClick={handleCreate} type="button" className="py-2 px-4 w-[5rem] inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                        Create
                    </button>
                </div>
            </div>
        </div>
        </div >
    )
}

export default AddPizza