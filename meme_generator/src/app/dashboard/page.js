import './dash.css'
import Link from 'next/link'

export default async function page() {
    const res = await fetch('https://api.imgflip.com/get_memes')
    const result = await res.json()

    let Memes = result.data.memes
    console.log(Memes.id);
    return (
        <div className='grid grid-cols-3 gap-4'>
            <div className='nav'><h1>Memes</h1></div>
            {Memes.map(item => {
                return <Link href={`/detail/${item.id}`} key={item.id}>
                    <div className="card-container">
                        <div className="card">
                            <div className="img-content" style={{ backgroundImage: `url(${item?.url})`, backgroundSize: 'cover' }}>
                            </div>
                            <div className="content" style={{ backgroundColor: 'rgb(0 0 0 / 38%)', width: '300px', height: '300px', textAlign: 'center' }}>
                                <p className="heading">{item.name}</p>
                                <h3>
                                    Customize by yourself
                                </h3>
                            </div>
                        </div>
                    </div>
                </Link>

            })}
        </div>
    )
}