import React from 'react'
import Link from 'next/link'
import './app.css'

export default function App() {
  return (
    <div className='main'>

      <Link href="/dashboard">
        <div className='semi'>
        <h1>Welcome to meme generator</h1>
        <button className='px-4 py-2 bg-blue-500 text-white rounded cursor-pointer'>dashboard</button>
        </div>
        </Link>
    </div>
  )
}
