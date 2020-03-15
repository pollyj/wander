const logOutBtn = document.querySelector('#logOut')

logOutBtn.addEventListener('click', async e => {
	let response = await fetch('/logout')
	console.log(response)

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})

// fetch doggos and display them on the page
const myDoggos = document.querySelector('#myDoggos')

const addDoggos = (doggoName, description, imageurl) => {
	myDoggos.innerHTML += `
	<div class="doggos text-left container" style="background-color: #ffffff;">
		<div class="mt-5 mx-auto">
			<img src=${imageurl} class="pt-3" alt="Doggo image goes here" width="100%">
			<div class="card-body">
				<h5 class="card-title">${doggoName}</h5>
				<p class="card-text">${description}</p>
				<span>
					<a href="#" class="btn btn-primary">Pat</a>
					<a href="#" class="btn btn-secondary">Like</a>
				</span>
			</div>
		</div>
	</div> \n`
}

async function loadDoggos() {
	let response = await fetch('/users/load-my-doggos')
	let resJson = await response.json()
	console.log(resJson)

	if (response.ok && resJson.doggos.length > 0) {
		myDoggos.innerHTML = ''
		resJson.doggos.forEach(doggo => {
			addDoggos(doggo.doggoname, doggo.description, doggo.imageurl)
		})
	} else if (response.ok && resJson.doggos.length === 0) {
		console.log('HTTP-status: ' + response.status + ' but no data')
	} else {
		alert('HTTP-Error: ' + response.status)
	}
}

loadDoggos()
