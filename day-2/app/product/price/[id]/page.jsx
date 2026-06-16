import React from 'react'
import PricePageClient from './PricePageClient'

export const metadata = {
  title: 'Provision Cloud Node | Nexus',
  description: 'Provision a custom cloud node environment on Nexus CDN network.',
}

const page = async({params}) => {
    const {id} = await params
    
  return (
    <PricePageClient id={id} />
  )
}

export default page