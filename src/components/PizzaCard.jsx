import { useState, useEffect } from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify'
import _ from 'lodash';

import {images} from '../constants/index'
import { FiHeart } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { removeProduct } from '../functions/pizza'

const PizzaCard = ({product, admin}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state) => ({...state}));

    const handleAddToCart = () => {
        // Create Cart Array
        let cart = [];
        if (typeof window !== 'undefined') {
          // if cart is in localstorage GET it
          if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
          }
          // Push new product to cart
          cart.push({
            ...product,
            count: 1,
          });
          // Remove duplicate
          let unique = _.uniqWith(cart, _.isEqual);
  
          // Save to localStorage
          // console.log('unique', unique);
          localStorage.setItem('cart', JSON.stringify(unique));
  
          // show tooltip
        //   setTooltip('Added');
          toast.success('Item Added Into Cart')
  
          // add to redux state
          dispatch({
            type: 'ADD_TO_CART',
            payload: unique,
          })

          dispatch({
            type: 'SET_VISIBLE',
            payload: true,
          })
        }
    } 

    const handleBuyNow = () => {
        // console.log('BUY NOW');
        handleAddToCart();
        setTimeout(() => {
            navigate('/cart');
        }, 1000);
        
    }

    const handleDelete = () => {
        if (window.confirm('Delete?')) {
            removeProduct(product.slug, user.token).then(res => {
                toast.success(`${res.data.title} is deleted`)
                window.location.reload();
            }).catch(err => console.log(err))
        }
    }

    return (
        <>
            <div className="p-4 lg:w-1/4 md:w-1/2 hover:shadow-2xl m-1" >
                <div className="h-full flex flex-col items-center text-center cursor-pointer" data-hs-overlay={`#hs-vertically-centered-scrollable-modal-${product._id}`}>
                    {product && product.images && <img alt="team" className="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src={product.images.length > 0 ? product.images[0].url : images.blank} />}
                    <div className="w-full">
                        <h2 className="title-font font-medium text-lg text-gray-900">{product.title}</h2>
                        <p className="mb-4">{product.description.substring(0, 65)} . . .</p>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center gap-5">
                    {admin == true && <div onClick={handleDelete} className="cursor-pointer text-red-600">
                        <AiOutlineDelete size={26} />
                    </div>}
                    {/* {icon2 && <div className="cursor-pointe text-red-700">
                        {icon2}
                    </div>} */}
                </div>
            </div>

            {!admin && <div id={`hs-vertically-centered-scrollable-modal-${product._id}`} className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
                <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                    <div className="max-h-full overflow-hidden flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                        <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
                            <h3 className="font-bold text-gray-800 dark:text-white">
                                {product.title}
                            </h3>
                            <button type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay={`#hs-vertically-centered-scrollable-modal-${product._id}`}>
                                <span className="sr-only">Close</span>
                                <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <Carousel autoPlay={true} emulateTouch={true} infiniteLoop={true} interval={1000} showStatus={false} showThumbs={false} dynamicHeight={false} >
                                        {product && product.images && product.images.map((item, i) => (
                                            <div key={i}>
                                                <img src={item.url.length > 0 ? item.url : images.blank} className="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" />
                                            </div>

                                        ))}
                                    </Carousel>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{product.title}</h3>
                                    <p className="mt-1 text-gray-800 dark:text-gray-400">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
                            {/* <div className="py-3 px-4 inline-flex justify-center hover:text-red-700 cursor-pointer items-center gap-2">
                                <FiHeart size={28} />
                            </div> */}

                            <a onClick={handleBuyNow} className="hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" href="#" data-hs-overlay={`#hs-vertically-centered-scrollable-modal-${product._id}`}>
                                Buy Now
                            </a>
                            <a onClick={handleAddToCart} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" href="#">
                                Add To Cart
                            </a>

                        </div>
                    </div>
                </div>
            </div>}

        </>
    )
}

export default PizzaCard