import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userCart } from '../functions/user'
import ProductCardInCheckout from '../components/ProductCardInCheckout'
import { images } from '../constants/index'

const Cart = () => {

    const navigate = useNavigate();
    const {cart, user} = useSelector((state) => ({...state}));

    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    }

    const saveOrderToDB = () => {
        // console.log('cart', JSON.stringify(cart, null, 4));
        userCart(cart, user.token).then(res => {
            // console.log('CART POST RES', res);
            if (res.data.ok) navigate('/checkout');
        }).catch(err => {
            console.log('cart save err', err);
        })
        
    }

  return (
    <>
    {!cart.length ? <div className="flex mt-6 flex-col h-full w-full justify-center items-center py-4 shadow-md">
        <div className="my-2">
            <img src={images.cart_1} alt="" className='max-w-[20rem]' />
        </div>
        <div className="my-2 text-lg font-semibold">
            {/* Your cart is empty! */}
        </div>
        <div className="my-2 text-xs">
            Add items to it now.
        </div>
        <div className="my-2 text-xs">
            <button onClick={() => navigate('/')} className='flex justify-center items-center px-6 py-4 h-10 md:px-8 md:py-4 md:h-12 rounded-sm text-white text-sm md:font-bold md:text-base bg-blue-600 hover:bg-blue-700'>
                Shop Now
            </button>
        </div>
    </div> :
    <div className='grid grid-cols-1 lg:grid-cols-3 mt-2 p-2 overflow-y-scroll scrollbar-hide'>
        <div className='lg:col-span-2 m-2 shadow-md bg-white'>

            <div className='flex flex-col overflow-y-scroll scrollbar-hide h-80'>
                {cart.length > 0 && cart.map((p) => (
                    <ProductCardInCheckout key={p._id} p={p} />
                    ))}
            </div>
            <div className='flex justify-center md:justify-end items-center relative h-24  md:right-5'>
                {user ? <button onClick={saveOrderToDB} className='flex justify-center items-center px-3 py-2 h-8 md:px-6 md:py-4 md:h-12 rounded-sm text-white text-sm md:font-bold md:text-base bg-blue-600 hover:bg-blue-700'>
                    Place Order
                </button> :
                <button onClick={() => navigate('/login')} className='flex justify-center items-center px-3 py-2 h-8 md:px-6 md:py-4 md:h-12 rounded-sm text-white text-sm md:font-bold md:text-base bg-blue-600 hover:bg-blue-700'>
                    Place Order
                </button>}
            </div>
            
        </div>
        <div className="p-3 m-2 shadow-md bg-white">
            <div className="">
                <div className="flex my-2 items-center">
                    <div className='text-gray-500 text-lg font-semibold'>PRICE DETAILS</div>
                </div>
                <hr />
                <div className="flex my-2 items-center font-semibold justify-between">
                    <div className="text-lg">Price ({cart.length} items)</div>
                    <div className="text-lg text-green-700">
                        {cart.map((c, i) => (
                            <div key={i} className="">₹{c.price * c.count}</div>
                        ))}
                    </div>
                </div>
                <div className="flex my-3 items-center font-semibold justify-between">
                    <div className="text-lg">Discount</div>
                    <div className="text-lg text-green-700">₹0</div>
                </div>
                <div className="flex my-3 items-center font-semibold justify-between">
                    <div className="text-lg">Delivery Charges</div>
                    <div className="text-lg text-green-700">FREE</div>
                </div>
                <hr />
                <div className="flex my-3 items-center font-semibold justify-between">
                    <div className="text-xl font-bold">Total Amount</div>
                    <div className="text-lg text-green-700">₹{getTotal()}</div>
                </div>
                {/* <div className="flex my-3 items-center font-semibold justify-between">
                    <div className="text-lg text-green-700">You will save ₹2,770 on this order</div>
                </div> */}
            </div>
        </div>
    </div>}
    </>
  )
}

export default Cart