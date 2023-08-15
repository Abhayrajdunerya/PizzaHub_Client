import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'
import { BsFillBagCheckFill } from 'react-icons/bs'
import { emptyUserCart, getUserCart, saveUserAddress, applyCoupon, createOrder, getUserAddress } from '../functions/user';
import { order, verify } from '../functions/razorpay'
import { images } from '../constants';
import { addQty } from '../functions/subIngredient';

const Checkout = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, coupon } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [userAddress, setUserAddress] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [addressSaved, setAddressSaved] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');

  const [cartTotal, setCartTotal] = useState(0);
  // const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getUserCart(user.token)
      .then(res => {
        // console.log('user cart res', JSON.stringify(res.data, null, 4));
        if (!res.data.isEmpty) {
          setProducts(res.data.pizzas);
          setTotal(res.data.cartTotal);
          console.log(res.data);
        }
      })

    getUserAddress(user.token).then(res => setUserAddress(res.data));
  }, []);

  const handleAddressChange = (e) => {
    setUserAddress({ ...userAddress, [e.target.name]: e.target.value })
  }

  const emptyCart = () => {

    if (!window.confirm('Empty Cart?')) {
      return;
    }

    // remove from local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
    // remove from redux
    dispatch({
      type: 'ADD_TO_CART',
      payload: [],
    });
    // remove from backend
    emptyUserCart(user.token)
      .then(res => {
        setProducts([]);
        setTotal(0);
        setTotalAfterDiscount(0);
        toast.success('Cart is empty. Continue shopping.')
      })

    navigate('/');
  }

  const saveAddressToDB = (e) => {
    e.preventDefault();
    // console.log(userAddress);
    saveUserAddress(user.token, userAddress).then(res => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success('Address saved');
      }
    })
  }

  const applyDiscountCoupon = () => {
    // console.log('send coupon to backend', couponCode);
    applyCoupon(user.token, couponCode).then(res => {
      // console.log('RES ON COUPON APPLIED', res.data);
      if (!res.data.err && res.data) {
        setTotalAfterDiscount(res.data);
        dispatch({
          type: 'COUPON_APPLIED',
          payload: true,
        })
      }

      if (res.data.err) {
        setDiscountError(res.data.err);
        dispatch({
          type: 'COUPON_APPLIED',
          payload: false,
        })
      }
    })
  }

  const handlePay = () => {
    if (!addressSaved) {
      toast.error('Please save your address first!');
      return;
    }
    if (!products.length) {
      toast.error('Please add items to your cart!');
      return;
    }

    order(user.token, coupon).then(res => {
      console.log(res.data);

      setCartTotal(res.data.cartTotal);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);

      // createOrder(user.token, res.data.data).then((res) => {
      //   if (res.data.ok) {
      //     // empty cart from local storage
      //     if (typeof window !== 'undefined') {
      //       localStorage.removeItem('cart');
      //     }
      //     // empty cart from redux
      //     dispatch({
      //       type: 'ADD_TO_CART',
      //       payload: [],
      //     });
      //     // reset coupon to false
      //     dispatch({
      //       type: 'COUPON_APPLIED',
      //       payload: false,
      //     })
      //     // empty cart from database
      //     // emptyUserCart(user.token);
      //   }
      // })

      initPayment(res.data.data);
    }).catch(err => {
      console.log(err);
    })
  }

  const initPayment = (data) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'PizzaHub',
      description: 'Test Transaction',
      image: images.logo_2,
      order_id: data.id,
      prefill: {
        name: user.name,
        email: user.email,
        // contact: "9999999999"
      },
      theme: {
        color: '#0023FF'
      },
      handler: async (response) => {
        verify(user.token, response).then(res => {
          setSuccess(res.data.success);
          console.log(res.data);
          // empty cart from database

          if (res.data.success === true) {

            createOrder(user.token, res.data.order).then((res) => {
              if (res.data.ok) {
                // empty cart from local storage
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('cart');
                }
                // empty cart from redux
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: [],
                });
                // reset coupon to false
                dispatch({
                  type: 'COUPON_APPLIED',
                  payload: false,
                })
                // empty cart from database
                // emptyUserCart(user.token);
              }

              emptyUserCart(user.token);
              navigate('/user/orders');

            }).catch(err => console.log(err))
          } else {
            toast.error(res.data.message)
          }

        }).catch(err => {
          console.log(err);
        })
      },
    }

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }

  const showProductSummary = () => (
    products.length > 0 && products.map((p, i) => (
      <div key={i} className="flex justify-between my-2">
        <div className=''>
          {p.pizza.title}
        </div>
        <div className="text-green-700">
          {p.price} x {p.count} = {' ₹'}{p.pizza.price * p.count}
        </div>
      </div>
    ))
  )

  const showApplyCoupon = () => (
    <div className="flex justify-center items-center">
      <input type="text" id="name" name="couponCode" value={couponCode} onChange={e => { setCouponCode(e.target.value); setDiscountError('') }} required className="w-full mx-2 bg-white rounded-sm border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-700 font-semibold text-base outline-none text-gray-700 leading-8 transition-colors duration-200 ease-in-out" />
      <button onClick={applyDiscountCoupon} className='group mx-2 relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-blue-600 hover:bg-blue-700'>
        Apply
      </button>
    </div>
  )

  const showAddressForm = () => (
    <form onSubmit={saveAddressToDB}>
      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" id="name" name="name" value={userAddress.name} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            <input type="email" id="email" name="email" value={userAddress.email} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>
      <div className='px-2 w-full'>
        <div className="mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea id="address" name="address" value={userAddress.address} onChange={handleAddressChange} required cols="30" rows="2" className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
      </div>

      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
            <input type="text" id="phone" name="phone" title="Phone no. must be of 10-digits" pattern="[1-9]{1}[0-9]{9}" value={userAddress.phone} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
            <input type="text" id="city" name="city" value={userAddress.city} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input type="text" id="state" required name="state" value={userAddress.state} onChange={handleAddressChange} className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input type="text" id="pincode" name="pincode" pattern="[1-9]{1}[0-9]{5}" title="Pincode must be of 6-digits" value={userAddress.pincode} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <button type='submit' className="flex text-white bg-blue-600 border-0 mx-2 mb-4 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded-sm text-sm">
        Save
      </button>
    </form>
  )



  return (
    <div className='container sm:m-auto px-2'>
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      <h2 className='font-semibold text-xl'>1. Delivery Details</h2>
      {showAddressForm()}
      <hr />
      <h2 className='font-semibold text-xl mt-4'>2. Review Cart Items & Pay</h2>
      <div className="sideCart p-6 m-2 shadow-sm bg-white">
        <div className="flex flex-col justify-between">
          {showProductSummary()}
        </div>
        {/* <div className="mt-6 flex justify-between">
            <div className="font-semibold text-base">Have Coupon?</div>
            {showApplyCoupon()}
            {discountError && <p className='bg-red-500 mx-2 p-2'>{discountError}</p>}
        </div> */}
        <div className="">
          {totalAfterDiscount > 0 && (
            <p className='bg-orange-200 text-green-700 font-semibold text-base p-2 my-2 rounded-sm'>Discount Applied: Total Payable: ₹{totalAfterDiscount}</p>
          )}
        </div>
        <div className='font-semibold text-lg my-2 flex space-x-2'>Total: <div className="text-green-700 mx-4"> ₹{totalAfterDiscount ? totalAfterDiscount : total}</div></div>
      </div>
      <div className='flex pl-6'>
        <button onClick={handlePay} className="flex mx-2 items-center justify-center text-white bg-blue-600 border-0 py-2 px-2 focus:outline-none hover:bg-blue-700 rounded-sm text-sm">
          <BsFillBagCheckFill className='' /> Pay ₹{totalAfterDiscount ? totalAfterDiscount : total}
        </button>
        <button disabled={products.length === 0} onClick={emptyCart} className="flex mx-2 text-white bg-blue-600 border-0 py-2 px-2 focus:outline-none hover:bg-blue-700 rounded-sm text-sm">
          Empty Cart
        </button>
      </div>
    </div>
  )
}

export default Checkout