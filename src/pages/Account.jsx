import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


import { saveUserAddress, getUserAddress, updateUsername } from '../functions/user';
import Title from '../components/Title'

const Account = () => {

  const title = "My Account"
  const paragraph = "Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably havent heard of them."

  const { user } = useSelector((state) => ({ ...state }));

  const [userAddress, setUserAddress] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [name, setName] = useState(user.name);

  useEffect(() => {
    getUserAddress(user.token).then(res => {
      // console.log(res.data);
      setUserAddress(res.data)
    });
    // console.log(user.email);
  }, [])

  const saveAddressToDB = (e) => {
    e.preventDefault();
    // console.log(userAddress);
    saveUserAddress(user.token, userAddress).then(res => {
      if (res.data.ok) {
        toast.success('Address saved');
      }
    })
  }

  const handleAddressChange = (e) => {
    setUserAddress({ ...userAddress, [e.target.name]: e.target.value })
  }

  const updateName = () => {
    updateUsername(user.token, name).then(res => {
      // console.log(res.data);
      toast.success("Information is Updated");
    })
  }

  const handleEmail = (e) => {

  }

  const showAddressForm = () => (
    <form onSubmit={saveAddressToDB}>
      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" id="name" name="name" value={userAddress.name} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            {/* <input type="text" id="name" name="name" value={'userAddress.name'} onChange={() => { }} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            <input type="email" id="email" name="email" value={userAddress.email} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            {/* <input type="email" id="email" name="email" value={'userAddress.email'} onChange={() => { }} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
          </div>
        </div>
      </div>
      <div className='px-2 w-full'>
        <div className="mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea id="address" name="address" value={userAddress.address} onChange={handleAddressChange} required cols="30" rows="2" className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          {/* <textarea id="address" name="address" value={'userAddress.address'} onChange={() => { }} required cols="30" rows="2" className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
        </div>
      </div>

      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
            <input type="text" id="phone" name="phone" title="Phone no. must be of 10-digits" pattern="[1-9]{1}[0-9]{9}" value={userAddress.phone} onChange={handleAddressChange} required  className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            {/* <input type="text" id="phone" name="phone" title="Phone no. must be of 10-digits" pattern="[1-9]{1}[0-9]{9}" value={'userAddress.phone'} onChange={() => { }} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
            <input type="text" id="city" name="city" value={userAddress.city} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            {/* <input type="text" id="city" name="city" value={'userAddress.city'} onChange={() => { }} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
          </div>
        </div>
      </div>

      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input type="text" id="state" required name="state" value={userAddress.state} onChange={handleAddressChange} className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            {/* <input type="text" id="state" required name="state" value={'userAddress.state'} onChange={() => { }} className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input type="text" id="pincode" name="pincode" pattern="[1-9]{1}[0-9]{5}" title="Pincode must be of 6-digits" value={userAddress.pincode} onChange={handleAddressChange} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            {/* <input type="text" id="pincode" name="pincode" pattern="[1-9]{1}[0-9]{5}" title="Pincode must be of 6-digits" value={'userAddress.pincode'} onChange={() => { }} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
          </div>
        </div>
      </div>

      <button type='submit' className="flex text-white bg-blue-600 border-0 mx-2 mb-4 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded-sm text-sm">
        Save
      </button>
    </form>
  )

  return (
    <div>

      <section id='account' className="text-gray-600 body-font shadow-md">
        <div className="container px-5 py-24 mx-auto">
          <Title heading={title} />
          <div className="flex flex-wrap -m-4 justify-center items-center">

            <div className='container sm:m-auto'>
              <div className="p-2 my-2 shadow-md">
                {/* <h1 className='font-bold text-3xl my-8 text-center'>My Profile</h1> */}
                <h2 className='font-semibold text-xl mx-2'>1. Personal Information</h2>
                <div className='mx-auto flex my-2'>
                  <div className='px-2 w-1/2'>
                    <div className="mb-4">
                      <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                      <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                      {/* <input type="text" id="name" name="name" value={'name'} onChange={() => { }} required className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
                    </div>
                  </div>
                  <div className='px-2 w-1/2'>
                    <div className="mb-4">
                      <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                      <input type="email" id="email" name="email" value={user.email} onChange={handleEmail} disabled={true} className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                      {/* <input type="email" id="email" name="email" value={userAddress.email} onChange={handleEmail} disabled={true} className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
                      {/* <input type="email" id="email" name="email" value={"user.email"} onChange={() => { }} disabled={true} className="w-full bg-white rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> */}
                    </div>
                  </div>
                </div>
                <button onClick={() => updateName()} className="flex text-white bg-blue-600 border-0 mx-2 mb-4 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded-sm text-sm">
                {/* <button onClick={() => { }} className="flex text-white bg-blue-600 border-0 mx-2 mb-4 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded-sm text-sm"> */}
                  Save
                </button>
              </div>
              <div className="p-2 my-2 shadow-md">
                <h2 className='font-semibold text-xl mx-2'>2. Saved Address</h2>
                {showAddressForm()}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Account