const axios = require('./axios')
const dislikeForms = document.querySelectorAll('form')

function ajaxDislike(e) {
	e.preventDefault()
	axios
		.post(this.action)
		.then((res) => {
			const disliked = this.dislike.classList.add('active')
			document.querySelector('h2').textContent = res.data.dislikes.length
		})
}

dislikeForms.forEach(dislike => dislike.addEventListener('click', ajaxDislike))
