const socket = io()
const axios = require('./axios')
const dislikeForms = document.querySelectorAll('form')

function ajaxDislike(e) {
	e.preventDefault()
	axios
		.post(this.action)
		.then((res) => {
			const disliked = this.dislike.classList.add('active')
			document.querySelector('h2').textContent = res.data.dislikes.length
			if (res.data.dislikes.length > 2) {
				socket.emit('title')
			}
		})
}

dislikeForms.forEach(dislike => dislike.addEventListener('click', ajaxDislike))
