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
                <h1>Folder ID</h1>
                <p>{folderId}</p>
            </div>

        </div>
    )
}

export default page
