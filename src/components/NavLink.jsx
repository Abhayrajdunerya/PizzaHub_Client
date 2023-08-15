import React from 'react'
import { Link } from 'react-router-dom'
import { RiFolderUploadLine } from 'react-icons/ri'

const NavLink = ({url, title, icon}) => {
    return (
        <Link to={url}>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div >
                    {icon}
                </div>
                <span className="ml-3">{title}</span>
            </div>
        </Link>
    )
}

export default NavLink