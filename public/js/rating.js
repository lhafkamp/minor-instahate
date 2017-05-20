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
			const rank = Math.round(res.data.dislikes.length / dislikeForms.length * 10)
			socket.emit('title', rank)
		})
}

socket.on('titleUpdate', (rank) => {
	document.body.insertAdjacentHTML('afterbegin',
	`
		<div class="stay">
			<p>New rank! ${rank}</p>
		</div>
	`)

	document.querySelector('h3').textContent = rank

	setTimeout(() => {
		document.querySelector('.stay').style.opacity = 0;
		setTimeout(() => {
			document.querySelector('.stay').remove()
		}, 3000);
	}, 3000)
})

dislikeForms.forEach(dislike => dislike.addEventListener('click', ajaxDislike))
