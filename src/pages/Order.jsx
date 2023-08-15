import { useState, useEffect } from 'react'
import { getUserOrders } from '../functions/user'
import { useSelector } from 'react-redux'
import ModalImage from "react-modal-image";
import { images } from '../constants'

const History = () => {

    const { user } = useSelector((state) => ({ ...state }));

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadUserOrders();
    }, []);

    const loadUserOrders = () => {
        getUserOrders(user.token).then(res => {
            setOrders(res.data);
        })
    }

    const showOrders = (order) => (
        <div className="shadow border rounded-sm">
           {order.pizzas.map((p, i) => (
                <div key={i} className="flex justify-between flex-wrap-reverse items-center px-4 py-4 my-2">
                    <div className="flex">
                        <div style={{width: '100px', height: 'auto'}} className='img w-[100px]'>
                            {p.pizza.images.length ? <ModalImage small={p.pizza.images[0].url} large={p.pizza.images[0].url} /> : 
                                <ModalImage small={images.blank} large={images.blank} />
                            }
                        </div>
                        <div className="flex flex-col mx-2 md:text-base ">
                            <div className="title md:my-2 md:mt-1 font-semibold text-black hover:text-gray-700">{p.pizza.title}</div>
                            <div className="count md:my-1">Qty: {p.count}</div>
                            <div className="price md:my-1 flex justify-between">
                                <div>
                                    Price: 
                                    <span className='text-green-700 mx-2'>
                                        ₹{p.pizza.price}
                                    </span> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex mr-2 mb-4">
                        {order.orderStatus === 'order placed' || order.orderStatus === 'cancelled' ? <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">{order.orderStatus}</span>
                         : <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">{order.orderStatus}</span>}
                            
                    </div>
                </div>
           ))}
        </div>
    )

    const showEachOrders = () => orders.reverse().map((order, i) => (
        <div key={i} className="">
            {showOrders(order)}
        </div>

    ))

    return (
        <div className=''>
            <h4 className='text-xl text-center my-5  font-semibold'>{orders.length > 0 ? 'Your Orders' : 'No Orders'}</h4>
            {showEachOrders()}
            
        </div>
    )
}

export default History