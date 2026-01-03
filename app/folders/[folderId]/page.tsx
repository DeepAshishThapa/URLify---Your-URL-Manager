import React from 'react'

type PageProps = {
    params: {
        folderId: string;
    };
};

async function page({ params }: PageProps) {
    const { folderId } = await params;
    

    return (
        <div>
            <div>
                
            </div>

        </div>
    )
}

export default page
