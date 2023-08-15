import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { BiPlusCircle, BiMinusCircle } from 'react-icons/bi'
import { AiOutlineDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'
import ModalImage from "react-modal-image";
import { images } from '../constants'

const ProductCardInCheckout = ({ p }) => {

    let dispatch = useDispatch();

    const [quantity, setQuantity] = useState(p.count);

    useEffect(() => {
        handleQuantityChange();
    }, [quantity])

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleQuantityChange = () => {

        // if (quantity > p.quantity) {
        //     toast.error(`Max available quantity: ${p.quantity}`);
        //     return;
        // }

        let cart = [];
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart[i].count = quantity;
                }
            })

            // console.log('cart updated count', cart);
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            });
        }
    }

    const handleRemove = () => {
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart.splice(i, 1);
                }
            })

            // console.log('cart updated count', cart);
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            });
        }
    }

    return (
        <div className='flex flex-col p-3'>
            <div className='flex upper space-x-4'>
                <div style={{ width: '100px', height: 'auto' }} className='img '>
                    {p.images.length ? <ModalImage small={p.images[0].url} large={p.images[0].url} /> : <ModalImage small={images.blank} large={images.blank} />
                        // <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXoPs7av_3dWLBqDdhBCuvlaYeG6_nX1D7rA&usqp=CAU"} className="h-20 w-20 md:h-[7rem] md:w-[7rem]" />
                        //  : 
                        // ''

                    }
                </div>
                <div className='w-[70%] md:w-[50%]'>
                    <div className='product-name font-bold text-base md:text-lg text-black cursor-pointer'>{p.title}</div>
                    <div>
                        {/* <pre className='size text-black text-base leading-7'>Size: {p.size},{p.color}</pre> */}
                        <pre className='price flex text-black text-base leading-7 space-x-2 mb-0'>
                            Price:
                            <pre className='text-lg font-semibold text-green-700'> ₹{p.price} </pre>
                        </pre>
                    </div>
                </div>
                {/* <div className='hidden md:flex text-xs md:text-sm'>Delivery by Wed Aug 10 | Fee ₹40</div> */}
            </div>
            <div className='flex flex-col'>
                <div className='flex mt-2 py-2 space-x-14'>
                    <div className='flex ml-2 space-x-2'>
                        <div className='cursor-pointer'><BiPlusCircle size={30} onClick={handleIncrement} /> </div>
                        <div className=''>{quantity}</div>
                        <div className='cursor-pointer'><BiMinusCircle size={30} onClick={handleDecrement} /></div>
                    </div>
                    <div className='text-black text-xs md:text-base font-semibold cursor-pointer' onClick={handleRemove} ><AiOutlineDelete size={25} className='text-red-600' /></div>
                </div>
                {/* <div className='flex mb-3 md:hidden text-xs'>Delivery by Wed Aug 10 | Fee ₹40</div> */}
            </div>
            <hr className='border-gray-300' />
        </div>
    )
}

export default ProductCardInCheckout