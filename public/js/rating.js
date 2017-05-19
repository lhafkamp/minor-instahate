const axios = require('./axios')
const dislikeForms = document.querySelectorAll('form')

function ajaxDislike(e) {
	e.preventDefault()
	axios
		.post(this.action)
		.then((res) => {
			const disliked = this.dislike.classList.add('active')
			console.log(disliked)
		})
}

dislikeForms.forEach(dislike => dislike.addEventListener('click', ajaxDislike))
