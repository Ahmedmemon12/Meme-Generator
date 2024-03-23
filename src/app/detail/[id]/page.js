'use client'

// Import necessary libraries and styles
import { useEffect, useState, useRef } from 'react';
import fetchedData from './data';
import Link from 'next/link'
import './page.css';

function Detail({ params }) {
    // State variables
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [generatedMemeUrl, setGeneratedMemeUrl] = useState('');
    const [error, setError] = useState(null)
    const [selectedMemeUrl, setSelectedMemeUrl] = useState('');
    const [inputBoxes, setInputBoxes] = useState([]);
    const resultRef = useRef(null);

    // Fetch meme data on component mount
    useEffect(() => {
        fetchMeme();
    }, []);

    useEffect(() => {
        // Scroll to the result section when generatedMemeUrl changes
        if (generatedMemeUrl && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [generatedMemeUrl]);
    // Function to fetch meme data
    async function fetchMeme() {
        try {
            const data = await fetchedData();
            const meme = data.data.memes.find(meme => meme.id === params.id);
            setSelectedMemeUrl(meme.url);

            const inputs = Array.from({ length: meme.box_count }, (_, index) => ({
                id: `text${index + 1}`,
                value: ''
            }));
            setInputBoxes(inputs);
        } catch (error) {
            console.error('Error fetching meme:', error);
        }
    }
    const handleInputChange = (index, value) => {
        const updatedInputs = [...inputBoxes];
        updatedInputs[index].value = value;
        setInputBoxes(updatedInputs);
    };
    // Function to generate meme
    async function generateMeme() {
        setError(null);
    
        try {
            // Constructing the texts variable in the required format
            const texts = inputBoxes.map((input, index) => `boxes[${index}][text]=${encodeURIComponent(input.value)}`).join('&');
            
            // Constructing the complete API request URL with the parameters
            const url = `https://api.imgflip.com/caption_image?template_id=${params.id}&username=Ahmedmemon2&password=ahmed123&${texts}`;
    
            // Sending the request
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.success) {
                setGeneratedMemeUrl(data.data.url);
            } else {
                setError(data.error_message);
            }
        } catch (error) {
            console.error('Error generating meme:', error);
            setError('An error occurred while generating the meme.');
        }
    }
    async function handleDownload() {
        if (generatedMemeUrl) {
            try {
                const response = await fetch(generatedMemeUrl);
                const blob = await response.blob();

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'generated-meme.png';
                link.click();
            } catch (error) {
                console.error('Error downloading meme:', error);
                setError('An error occurred while downloading the meme.');
            }
        }
    }
    return (
        <div className="container flex flex-col items-center justify-center bg-gray-100">
            <Link href='/dashboard'>
            <div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        width="24"
                        height="24"
                        fill="currentColor"
                    ><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                </button>
            </div>
            </Link>

            <h1>Generate A Custom Meme</h1>
            
            <div className="inputDiv p-6 rounded-lg shadow-md mb-6">
            {inputBoxes?.map((input, index) => (
                    <div className="mb-4" key={input.id}>
                        <label htmlFor={input.id} className="text-lg font-semibold">Text {index + 1}:</label>
                        <input
                            className="InputValue h-12 p-2 border border-gray-300 rounded"
                            type="text"
                            id={input.id}
                            value={input.value}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    </div>
                ))}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="button">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition" onClick={generateMeme}>
                        Generate Meme
                    </button>
                </div>
            </div>

            <img className="w-64 h-64 m-4 rounded-lg shadow-lg" src={selectedMemeUrl} alt="Selected Meme" />

            <div className="m-4" ref={resultRef}>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {generatedMemeUrl &&
                    <div className='result'>
                        <div class="loader"></div>
                        <img className="w-64 h-64 rounded-lg shadow-lg" src={generatedMemeUrl} alt="Generated Meme" />
                        <button className='px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition mt-3' onClick={handleDownload}>
                            Download</button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Detail;
