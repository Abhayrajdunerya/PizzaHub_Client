import React from 'react'
import { FiHeart } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'

import Title from '../components/Title'
import PizzaCard from '../components/PizzaCard'

const WishList = () => {

    const title = "My Wishlist"
    const paragraph = "Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably havent heard of them."

  return (
    <section id='wishlist' className="text-gray-600 body-font shadow-md">
        <div className="container px-5 py-24 mx-auto">
          <Title heading={title} paragraph={paragraph} />
          <div className="flex flex-wrap -m-4 justify-center items-center">
            <PizzaCard heading1={"Holden Caulfield"} heading2={"UI Developer"} image={"https://dummyimage.com/200x200"} icon1={<FiHeart />} icon2={<AiOutlineDelete />} paragraph={"DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware."} />
            <PizzaCard heading1={"Holden Caulfield"} heading2={"UI Developer"} image={"https://dummyimage.com/200x200"} icon1={<FiHeart />} icon2={<AiOutlineDelete />} paragraph={"DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware."} />
            <PizzaCard heading1={"Holden Caulfield"} heading2={"UI Developer"} image={"https://dummyimage.com/200x200"} icon1={<FiHeart />} icon2={<AiOutlineDelete />} paragraph={"DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware."} />
            <PizzaCard heading1={"Holden Caulfield"} heading2={"UI Developer"} image={"https://dummyimage.com/200x200"} icon1={<FiHeart />} icon2={<AiOutlineDelete />} paragraph={"DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware."} />
            <PizzaCard heading1={"Holden Caulfield"} heading2={"UI Developer"} image={"https://dummyimage.com/200x200"} icon1={<FiHeart />} icon2={<AiOutlineDelete />} paragraph={"DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware."} />
          </div>
        </div>
      </section>
  )
}

export default WishList