"use client"
import React, { Fragment, useState, useEffect } from 'react'
import { IoChevronForward } from 'react-icons/io5'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'
import useCompanyName from '@/utils/useCompanyName'

const Breadcrumb = ({ folderPath, companySlug, navigateToPathFromBreadcrumb }) => {
    const companyname = useCompanyName()
    const paths = folderPath.split('/').filter(Boolean)
    const filteredPaths = paths.filter(path => path !== 'root')
    const [activeIndex, setActiveIndex] = useState(null)

    useEffect(() => {
        if (filteredPaths.length === 0) {
            setActiveIndex(null)
        }
    }, [filteredPaths.length])

    return (
        <nav className="flex items-center text-xs sm:text-lg py-2 text-gray-600">
            <div className="flex items-center min-w-0 flex-shrink gap-1">
                <a
                    href="#"
                    className="text-gray-600 hover:underline hover:text-blue-600"
                    onClick={(e) => {
                        e.preventDefault()
                        setActiveIndex(-1)
                        navigateToPathFromBreadcrumb('root')
                    }}
                >
                    <span className="font-medium whitespace-nowrap">
                        {capitalizeFirstLetter(companyname || companySlug)}
                    </span>
                </a>

                {filteredPaths.length > 0 && (
                    <IoChevronForward className="flex-shrink-0 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                )}

                {filteredPaths.map((path, index) => (
                    <Fragment key={index}>
                        <a
                            href="#"
                            className="text-gray-600 hover:underline hover:text-blue-600"
                            onClick={(e) => {
                                e.preventDefault()
                                setActiveIndex(index)
                                const targetPath = ['root', ...filteredPaths.slice(0, index + 1)].join('/')
                                navigateToPathFromBreadcrumb(targetPath)
                            }}
                        >
                            <span className="truncate">{path}</span>
                        </a>

                        {index < filteredPaths.length - 1 && (
                            <IoChevronForward className="flex-shrink-0 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                    </Fragment>
                ))}
            </div>
        </nav>
    )
}

export default Breadcrumb