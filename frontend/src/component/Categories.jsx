import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { api } from "../api/client"

export default function Categories() {
    const [categoryName, setCategoryName] = useState("")
    const [categoryDescription, setCategoryDescription] = useState("")
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [editCategory, setEditCategory] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [search, setSearch] = useState("")
    const filteredCategory = categories.filter((category) =>
        category.categoryName.toLowerCase().includes(search.toLowerCase()) ||
        category.categoryDescription.toLowerCase().includes(search.toLowerCase())
    )

    const handleAuthError = useCallback((e) => {
        const isExpired = e?.response?.status === 401 && (
            e?.response?.data?.message === "Token expired" ||
            e?.response?.data?.message === "Invalid token" ||
            e?.response?.data?.message === "No token provided"
        )

        if (isExpired) {
            logout()
            navigate("/login")
            return true
        }
        return false
    }, [logout, navigate])

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true)
            setError("")
            const response = await api.get("/category")
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch categories")
            }
            setCategories(response?.data?.categories || []);
        } catch (e) {
            if (handleAuthError(e)) return
            console.error("Failed fetching data", e);
            setError(e?.response?.data?.message || e?.message || "Failed fetching data")
        } finally {
            setLoading(false);
        }
    }, [handleAuthError])

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setSubmitting(true)
            setError("")

            const url = editCategory ? `/category/${editCategory}` : "/category/add"

            const method = editCategory ? "put" : "post"

            const response = await api({
                method,
                url,
                data: { categoryName, categoryDescription },
            })

            if (response?.data?.success) {
                setEditCategory(null)
                setCategoryName("")
                setCategoryDescription("")
                await fetchCategories()
                return
            }
            throw new Error(response?.data?.message || "Operation failed")

        } catch (error) {
            if (handleAuthError(error)) return
            console.error("Error:", error)
            setError(error?.response?.data?.message || error?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (category) => {
        setEditCategory(category._id)
        setCategoryName(category.categoryName)
        setCategoryDescription(category.categoryDescription)
    }

    const handleCancel = () => {
        setEditCategory(null)
        setCategoryName("")
        setCategoryDescription("")
    }

    const handleDelete = async (id) => {
        try {
            setError("")
            const response = await api.delete(`/category/${id}`)

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Delete failed")
            }
            await fetchCategories()
        } catch (e) {
            if (handleAuthError(e)) return
            setError(e?.response?.data?.message || e?.message || "Couldn't delete category")
        }
    }

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>Categories</h1>
            <div className='py-4'>
                <input type="text" placeholder='Search' className='border rounded-md p-1 bg-white px-4' value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>{editCategory ? "Edit Category" : "Add Category"}</h2>
                        {error && <p className='mb-3 text-sm text-red-600'>{error}</p>}
                        <form className='space-y-4'
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <input type="text" placeholder='Category Name' value={categoryName} className='border w-full p-2 rounded-md'
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input type="text" placeholder='Category Description' value={categoryDescription} className='border w-full p-2 rounded-md'
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                />
                            </div>
                            <button disabled={submitting} type='submit' className='border w-full rounded-md p-2 bg-green-300 font-bold disabled:opacity-60'>{submitting ? "Saving..." : editCategory ? "Save Changes" : "Add Category"}</button>
                            {
                                editCategory && (
                                    <button type="button" className='border w-full rounded-md p-2 bg-red-300 font-bold' onClick={() => handleCancel()}>
                                        Cancel
                                    </button>
                                )
                            }
                        </form>
                    </div>
                </div>
                <div className='lg:w-2/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <table className='w-full border-collapse border border-gray-200'>
                            <thead>
                                <tr>
                                    <th className='border border-gray-200 p-2'>S.No</th>
                                    <th className='border border-gray-200 p-2'>Category Name</th>
                                    <th className='border border-gray-200 p-2'>Descrpition</th>
                                    <th className='border border-gray-200 p-2'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategory.map((category, index) => (
                                    <tr key={index}>
                                        <td className='border border-gray-200 p-2'>{index + 1}</td>
                                        <td className='border border-gray-200 p-2'>{category.categoryName}</td>
                                        <td className='border border-gray-200 p-2'>{category.categoryDescription}</td>
                                        <td className='border border-gray-200 p-2 flex justify-around'>
                                            <button className='border border-gray-200 bg-blue-500 p-2 text-white rounded-md hover:bg-blue-400' onClick={() => handleEdit(category)}
                                            >Edit</button>
                                            <button className='border border-gray-200 bg-red-500 p-2 text-white rounded-md hover:bg-red-400' onClick={() => handleDelete(category._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCategory.length===0 && <div>No data found</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
