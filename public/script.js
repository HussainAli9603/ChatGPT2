import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')

const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(e)

    const data = new FormData(form)

    const response = await fetch('http://localhost:5000/add/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apiKey: data.get('apiKey')
        })
    })

    if (response.ok) {
        const data = await response.json();    
        localStorage.setItem('myKey', JSON.stringify(data.apiKey));
        localStorage.setItem('myKeyExpires', Date.now() + 60 * 24 * 60 * 60 * 1000); //2 months

        window.location.assign('https://chatgpt-api.cyclic.app/chat.html');

    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})