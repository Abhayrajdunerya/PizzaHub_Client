import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import AdminNav from '../../components/AdminNav'
import { getOrders, changeStatus, reduceSubCount, getAlert } from '../../functions/admin'
import { useSelector } from 'react-redux'
import ModalImage from 'react-modal-image'
import { images } from '../../constants'
import { getSubs } from '../../functions/subIngredient'

const threshold = import.meta.env.VITE_THRESHOLD;

const AdminDashboard = () => {

    const { user } = useSelector((state) => ({ ...state }));

    const [orders, setOrders] = useState([])
    const [allSubIngredients, setAllSubIngredients] = useState([])
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        loadOrders();
        // loadSubIngredients();
        getAlert(user.token).then(res => setShowAlert(res.data));
    }, []);

    const loadOrders = () => {
        getOrders(user.token).then(res => {
            // console.log(JSON.stringify(res.data, null, 4));
            setOrders(res.data);
        })
    }

    const loadSubIngredients = () => getSubs().then((res) => {
        res.data && res.data.map((item, i) => {
            if (item.qty < threshold) {
                setShowAlert(true);
                return;
            }
        })
    }).catch(err => console.log(err));

    // const loadSubIngredients

    const handleStatusChange = (orderId, orderStatus) => {
        // console.log("Order_ID = ", orderId, " Order_Status = ", orderStatus);
        changeStatus(user.token, orderId, orderStatus).then(res => {
            if (orderStatus === 'In the kitchen') {
                // console.log(res.data);
                res.data.pizzas.map(async (p, i) => {

                    await reduceSubCount(user.token, p.pizza.subIngredients, 1, p.count);
                })

                window.location.reload();

            }

            toast.success('Status updated');
            loadOrders();
        })
            .catch(err => console.log(err))
    }

    const showEachOrders = () => orders.reverse().map((order, i) => (
        <div key={i} className="">
            {showOrders(order)}
        </div>

    ))

    const showOrders = (order) => (
        <div className="shadow border rounded-sm">
            {order.pizzas.map((p, i) => (
                <div key={i} className="flex justify-between flex-wrap-reverse items-center px-4 py-4 my-2">
                    <div className="flex">
                        <div style={{ width: '100px', height: 'auto' }} className='img w-[100px]'>
                            {p.pizza.images.length ? <ModalImage small={p.pizza.images[0].url} large={p.pizza.images[0].url} /> :
                                <ModalImage small={images.blank} large={images.blank} />
                            }
                        </div>
                        <div className="flex flex-col mx-2 md:text-base ">
                            <div className="title md:my-2 md:mt-1 font-semibold text-black hover:text-gray-700 cursor-pointer" >{p.pizza.title}</div>
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
                        {/* {order.orderStatus === 'Not_Processed' || order.orderStatus === 'Cancelled' ? <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">{order.orderStatus}</span>
                            : <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">{order.orderStatus}</span>} */}

                        <div className="">
                            <select onChange={(e) => handleStatusChange(order._id, e.target.value)} defaultValue={order.orderStatus} id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none rounded-t-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value={'Order received'} >Order received</option>
                                <option value={'In the kitchen'} >In the kitchen</option>
                                <option value={'Sent to delivery'} >Sent to delivery</option>
                                {/* <option value={'cancelled'} >Cancelled</option>
                                <option value={'delivered'} >Delivered</option> */}
                            </select>
                        </div>
                    </div>


                    <div id={`hs-vertically-centered-scrollable-modal-${i}`} className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
                        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                            <div className="max-h-full overflow-hidden flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
                                    <h3 className="font-bold text-gray-800 dark:text-white">
                                        {p.pizza.title}
                                    </h3>
                                    <button type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay={`#hs-vertically-centered-scrollable-modal-${i}`}>
                                        <span className="sr-only">Close</span>
                                        <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-4 overflow-y-auto">
                                    <div className="space-y-4">
                                        <div>
                                            jbcjsdbcdsjbcsdj
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    )

    return (
        <div className="">
            <div className="container px-5  py-5 mx-auto">
                {showAlert && <div className="bg-orange-500 text-sm text-white rounded-md mb-2 p-4" role="alert">
                    <span className="font-bold">Warning</span> alert! Your stock are less than the threshold value. Add some stock
                </div>}
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

                        {showEachOrders()}

                    </div>
                </div>
            </div>


        </div>
    )
}

export default AdminDashboard