import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getProductsByCount } from '../functions/pizza';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import Title from '../components/Title'
import PizzaCard from '../components/PizzaCard'
import { getIngredientSubs } from '../functions/ingredient';
import { toast } from 'react-toastify';
import _ from 'lodash';
import uniqid from 'uniqid';
import { createPizza } from '../functions/user'

const Home = () => {

  const [pizzaList, setPizzaList] = useState([]);

  const [base, setBase] = useState('');
  const [sauce, setSauce] = useState('');
  const [cheese, setCheese] = useState('');
  const [veggies, setVeggies] = useState([]);
  const [qty, setQty] = useState(1);

  const [allBases, setAllBases] = useState([]);
  const [allSauces, setAllSauces] = useState([]);
  const [allCheeses, setAllCheeses] = useState([]);
  const [allVeggies, setAllVeggies] = useState([]);

  const { user } = useSelector(state => ({ ...state }))

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    loadPizzas();
  }, [])

  const loadPizzas = () => getProductsByCount(10).then(res => setPizzaList(res.data)).catch(err => console.log(err));

  useEffect(() => {
    loadData();
  }, [])

  const loadBases = () => getIngredientSubs('64d9a9630e5afc1fc02b58b3').then(res => setAllBases(res.data)).catch(err => console.log(err));
  const loadSauces = () => getIngredientSubs('64d9a96b0e5afc1fc02b58b7').then(res => setAllSauces(res.data)).catch(err => console.log(err));
  const loadCheeses = () => getIngredientSubs('64d9a9730e5afc1fc02b58bb').then(res => setAllCheeses(res.data)).catch(err => console.log(err));
  const loadVeggies = () => getIngredientSubs('64d9a9a00e5afc1fc02b58bf').then(res => setAllVeggies(res.data)).catch(err => console.log(err));

  const loadData = () => {
    loadBases();
    loadSauces();
    loadCheeses();
    loadVeggies();
  }

  const handleVeggiesChange = (selectedItem) => {
    setVeggies([]);
    selectedItem.map((item, i) => {
      setVeggies(prev => {
        return [...prev, item._id];
      })
    })

    return veggies;
  }

  const handleAddToCart = (product) => {
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

    const subIngredients = [
      base,
      sauce,
      cheese,
      ...veggies
    ]

    createPizza(user.token, subIngredients)
    .then(res => {
      console.log(res);
      handleAddToCart(res.data);

      setTimeout(() => {
        navigate('/cart');
      }, 1000);
    })
    .catch(err => console.log(err));

    //   handleAddToCart();
    
  }

  return (

    <div className="">
      <section id='hero' className="">
        <div className={`relative overflow-hidden bg-cover bg-no-repeat p-12 text-center h-[500px] bg-[url(/src/assets/hero/pizza_hero_5.jpg)]`} >
          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed bg-black/30">
            <div className="flex h-full items-center justify-center">
              <div className="z-30 absolute py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">Welcome to PizzaHub</h1>
                <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 lg:px-48 text-gray-300">Your Gateway to Quick and Delicious Pizza Delights!</p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                  <button onClick={() => {!user ? navigate('/login') : ''}} className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black focus:ring-1 focus:ring-gray-100 text-white" data-hs-overlay="#hs-toggle-between-modals-first-modal" >
                    Create Your Pizza
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="hs-toggle-between-modals-first-modal" className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
              <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    Select a pizza base
                  </h3>
                  <button type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-first-modal" data-hs-overlay-close>
                    <span className="sr-only">Close</span>
                    <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 overflow-y-auto flex flex-col text-left">
                  {/* <p className="text-lg font-medium my-2 p-2 text-gray-800 dark:text-gray-400">
                    Select Pizza Base
                  </p> */}

                  {allBases.length > 0 && allBases.map((item, i) => (
                    <div key={item._id} className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
                      <input onChange={(e) => setBase(e.target.value)} id={item._id} type="radio" value={item._id} name="base" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="bordered-radio-1" className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{item.title}</label>
                    </div>

                  ))}
                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
                  <button type="button" disabled={base.length === 0} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-second-modal">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="hs-toggle-between-modals-second-modal" className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
              <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    Choose any sauce
                  </h3>
                  <button type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-second-modal" data-hs-overlay-close>
                    <span className="sr-only">Close</span>
                    <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 overflow-y-auto text-left">
                  {/* <p className="text-lg font-medium my-2 p-2 text-gray-800 dark:text-gray-400">
                    Select any Base
                  </p> */}

                  {allSauces.length > 0 && allSauces.map((item, i) => (
                    <div key={item._id} className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
                      <input onChange={(e) => setSauce(e.target.value)} id={item._id} type="radio" value={item._id} name="sauce" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="bordered-radio-1" className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{item.title}</label>
                    </div>

                  ))}
                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
                  <button type="button" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-first-modal">
                    Prev
                  </button>
                  <button type="button" disabled={sauce.length === 0} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-third-modal">
                    Next
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div id="hs-toggle-between-modals-third-modal" className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
              <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    Select a cheese type
                  </h3>
                  <button type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-second-modal" data-hs-overlay-close>
                    <span className="sr-only">Close</span>
                    <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 overflow-y-auto text-left">
                  {/* <p className="text-lg font-medium my-2 p-2 text-gray-800 dark:text-gray-400">
                    Select Pizza Base
                  </p> */}

                  {allCheeses.length > 0 && allCheeses.map((item, i) => (
                    <div key={item._id} className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
                      <input onChange={(e) => setCheese(e.target.value)} id={item._id} type="radio" value={item._id} name="cheese" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="bordered-radio-1" className="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{item.title}</label>
                    </div>

                  ))}
                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
                  <button type="button" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-second-modal">
                    Prev
                  </button>
                  <button type="button" disabled={cheese.length === 0} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-fourth-modal">
                    Next
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div id="hs-toggle-between-modals-fourth-modal" className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
              <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    Select veggies
                  </h3>
                  <button type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-second-modal" data-hs-overlay-close>
                    <span className="sr-only">Close</span>
                    <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 text-left">

                  <Multiselect
                    options={allVeggies}
                    onSelect={handleVeggiesChange}
                    onRemove={handleVeggiesChange}
                    placeholder='Select Veggies & Topings'
                    displayValue='title'
                    showArrow={true}
                  />

                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
                  <button type="button" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-third-modal">
                    Prev
                  </button>
                  <button onClick={handleBuyNow} type="button" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay-close>
                    Buy Now
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div id="hs-toggle-between-modals-fifth-modal" className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
              <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    Enter Quantity
                  </h3>
                  <button type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-second-modal" data-hs-overlay-close>
                    <span className="sr-only">Close</span>
                    <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 overflow-y-auto">
                  <div className='mb-2'>
                    <input onChange={e => setQty(e.target.value)} id="qty" name="qty" value={qty} type="number" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Enter quantity" />
                  </div>
                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
                  <button type="button" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" data-hs-overlay="#hs-toggle-between-modals-fourth-modal">
                    Prev
                  </button>
                  <button  type="button" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" >
                    Buy Now
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <section id='menu' className="text-gray-600 body-font shadow-md">
        <div className="container px-5 py-24 mx-auto">
          <Title heading={"Our Menu"} paragraph={"Indulge in a Symphony of Flavors with Our Diverse Pizza Menu. From Classic Margherita to Bold BBQ Chicken, We Have a Slice for Every Craving. Explore Our Culinary Canvas and Elevate Your Pizza Passion!"} />
          <div className="flex flex-wrap -m-4 justify-center items-center">
            {pizzaList.length > 0 && pizzaList.map((item, i) => (
              <PizzaCard key={item._id} admin={false} product={item} />
            ))}
          </div>
        </div>
      </section>
    </div>

  )
}

export default Home