import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const Buy = () => {

  const {courseId} = useParams()
  const [loading, setLoading] = useState(false)

  const handlePurchase = () => {
    
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <button className='bg-blue-500 text-white py-2 px-4 hover:bg-blue-800 duration-300 rounded-md' onClick={handlePurchase} disabled={loading}>
        {
          loading ? "processing...":"Buynow"
        }
      </button>
    </div>
  )
}

export default Buy