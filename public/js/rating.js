const socket = io()
const axios = require('./axios')
const dislikeForms = document.querySelectorAll('form')

socket.on('disconnect', () => {
	alert('server is offline! Your input will not work anymore, please try to login again later')
})

function ajaxDislike(e) {
	e.preventDefault()
	axios
		.post(this.action)
		.then((res) => {
			console.log(this.dislike);
			const disliked = this.dislike.classList.add('active')
			const titleEle = document.querySelector('h3').textContent
			document.querySelector('h2').textContent = res.data.dislikes.length

			if (titleEle != res.data.title) {
				document.querySelector('h3').textContent = res.data.title

				document.body.insertAdjacentHTML('afterbegin', `
					<div class="stay">
						<p>New title unlocked: 🎉🎉 <span> ${res.data.title} </span> 🎉🎉</p>
					</div>
				`)

				// TODO keyframe instead of this
				setTimeout(() => {
					document.querySelector('.stay').style.opacity = 0
					setTimeout(() => {
						document.querySelector('.stay').remove()
					}, 3000)
				}, 3000)
			}
		})
}

dislikeForms.forEach(dislike => dislike.addEventListener('click', ajaxDislike))
