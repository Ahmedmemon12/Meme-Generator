import React from 'react'

export default async function fetchedData() {
    const res = await fetch(`https://api.imgflip.com/get_memes`);
    const data = await res.json();
  return data
}
