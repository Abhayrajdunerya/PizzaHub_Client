import {useState, useEffect} from 'react'
import { getSubsByCategory, removeSub } from '../functions/subIngredient'
import IngredientCard from './IngredientCard'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const AccordianRow = ({ingrediant}) => {

    const [subIngredients, setSubIngredients] = useState([])
    const [loading, setLoading] = useState(false)

    const { user } = useSelector(state => ({ ...state }))

    useEffect(() => {
        loadSubIngredients()
    }, [ingrediant])

    const loadSubIngredients = () => getSubsByCategory(ingrediant._id).then(res => setSubIngredients(res.data)).catch(err => console.log(err))

    const handleRemove = async (slug) => {
        if (window.confirm('Delete?')) {
            setLoading(true);
            // remove-category
            removeSub(slug, user.token)
                .then(res => {
                    setLoading(false);
                    toast.error(`${res.data.title} deleted`);
                    loadSubIngredients();
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                    toast.error(err.response.data)
                })
        }
        // console.log(slug);
    }

    return (
        <div className="mt-5 flex flex-wrap flex-col">
            <h3 className='text-base font-medium m-2'>{ingrediant.title}</h3>

            <div className="flex flex-row m-2 flex-wrap">
                {subIngredients.length > 0 && subIngredients.map((item, i) => (
                    <IngredientCard key={i} item={item} handleRemove={handleRemove} />
                ))}
            </div>
        </div>
    )
}

export default AccordianRow