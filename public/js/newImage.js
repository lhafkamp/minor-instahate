const socket = io()
const axios = require('./axios')
const addNewPic = document.querySelector('.pics')

socket.on('newPic', (data) => {
	addNewPic.insertAdjacentHTML('afterbegin', `
		<div class="pic">
			<div>
				<img class="instagram" src="${data.img.image}"/>
			</div>
			<form method="POST" action="/main/${data.img._id}/rating">
				<button type="submit" name="dislike" class="<%= ratingClass %>">Terrible</button>
			</form>
		</div>
	`)

	const newForm = document.querySelector('.pic:first-of-type form')

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
							<p>New title unlocked: <span>${res.data.title}</span></p>
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

	newForm.addEventListener('click', ajaxDislike)
})
