const socket = io()
const axios = require('./axios')
const addNewPic = document.querySelector('.pics')

socket.on('newPic', (data) => {
	addNewPic.insertAdjacentHTML('afterbegin',
	`
		<div class="pic">
			<div>
				<img src="${data.img.image}"/>
			</div>
			<form method="POST" action="/main/${data.img._id}/rating">
				<button type="submit" name="dislike" class="dislike">Dislike</button>
			</form>
		</div>
	`)

	const newForm = document.querySelector('.pic:first-of-type form')

	function ajaxDislike(e) {
		e.preventDefault()
		axios
			.post(this.action)
			.then((res) => {
				const disliked = this.dislike.classList.add('active')
				document.querySelector('h2').textContent = res.data.dislikes.length
				if (res.data.dislikes.length > 1) {
					socket.emit('title')
				}
			})
	}

	newForm.addEventListener('click', ajaxDislike)
})
