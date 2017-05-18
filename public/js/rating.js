const axios = require('./axios')
const dislikeForms = document.querySelectorAll('form')

function ajaxDislike(e) {
	e.preventDefault()
	axios
		.post(this.action)
		.then((res) => {
			const disliked = this.dislike.classList.toggle('active')
			console.log(disliked)
		})
		.catch(console.error('woooow'))
}

dislikeForms.forEach(dislike => dislike.addEventListener('click', ajaxDislike))
