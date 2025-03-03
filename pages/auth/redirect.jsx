import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

function Redirect() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const { accessid } = router.query

  const getUserData = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SSO_URL}/project/getuserdata`,
        { id: id }
      )
      console.log(response.data)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch user data')
    }
  }

  useEffect(() => {
    if (!accessid) return

    const initializeUser = async () => {
      try {
        setLoading(true)
        const data = await getUserData(accessid)
        const updatedData = {
          ...data,
          isAdmin: false
        }
        localStorage.setItem('userdata', JSON.stringify(updatedData))
        router.push('/inventory')
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [accessid, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="btn-primary"
            onClick={() => router.push('/')}
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-blue-600 font-semibold">Authenticating...</p>
        </div>
      </div>
    )
  }

  return null
}

export default Redirect
