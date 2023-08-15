import React from 'react'

const Title = ({heading, paragraph}) => {
    return (
        <div className="flex flex-col text-center w-full mb-20">
            <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">{heading}</h1>
            {paragraph && <p className="lg:w-2/3 mx-auto leading-relaxed text-base">{paragraph}</p>}
        </div>
    )
}

export default Title