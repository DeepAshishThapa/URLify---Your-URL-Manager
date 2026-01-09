import React from 'react'
import { Button } from '@/components/ui/button'

function layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className=" px-5 md:px-20 py-2 space-y-6  ">
            {children}
            
                
                
            

            
            
        </div>
    )
}

export default layout
