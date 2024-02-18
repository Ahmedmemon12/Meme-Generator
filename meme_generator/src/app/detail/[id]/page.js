'use client'

import { useEffect, useState } from 'react';
import fetchedData from './data';
import './page.css'

function Detail({ params }) {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [generatedMemeUrl, setGeneratedMemeUrl] = useState('');
    const [error, setError] = useState(null);
    const [selectedMemeUrl, setSelectedMemeUrl] = useState('');

    useEffect(() => {
        fetchMeme();
    }, []);

    async function fetchMeme() {

        try {
            const data = await fetchedData();
            console.log('data:', data);
            const meme = data.data.memes.find(meme => meme.id === params.id);
            setSelectedMemeUrl(meme.url);
        } catch (error) {
            console.log();
        }
    }


    async function generateMeme() {
        setError(null);

        try {
            const response = await fetch(`https://api.imgflip.com/caption_image?template_id=${params.id}&username=Ahmedmemon2&password=ahmed123&text0=${text1}&text1=${text2}`);
            const data = await response.json();

            if (data.success) {
                setGeneratedMemeUrl(data.data.url);
            } else {
                setError(data.error_message);
            }
        } catch (error) {
            console.error('Error generating meme:', error);
            setError('An error occurred while generating the meme.');
        } finally {
        }
    }

    return (
        <div className='mainDiv'>
                <img style={{boxShadow:'1px 1px 50px black ', borderRadius:'20px'}} className='w-64 h-64 m-4' src={selectedMemeUrl} />
            <div className='flex flex-col items-center m-4'>
                <div className='flex flex-col mb-4'>
                    <label htmlFor="text1" className='mr-2 text-lg font-semibold'>Text 1:</label>
                    <input className='h-12 p-2 border border-black rounded' type="text" id="text1" value={text1} onChange={(e) => setText1(e.target.value)} />
                </div>

                <div className='flex flex-col mb-4'>
                    <label htmlFor="text2" className='mr-2 text-lg font-semibold'>Text 2:</label>
                    <input className='h-12 p-2 border border-black rounded' type="text" id="text2" value={text2} onChange={(e) => setText2(e.target.value)} />
                </div>

                <div>
                    <button className='px-4 py-2 bg-blue-500 text-white rounded cursor-pointer' onClick={generateMeme}>
                        Generate Meme
                    </button>
                </div>
            </div>

            <div className='m-4' style={{height:'100vh'}}>
                {error && <div className='text-red-500'>{error}</div>}
                {generatedMemeUrl && <img style={{boxShadow:'1px 1px 50px black ', borderRadius:'20px'}} className='w-64 h-64' src={generatedMemeUrl} alt="Generated Meme" />}
            </div>
        </div>
    );
}

export default Detail;