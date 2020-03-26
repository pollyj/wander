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
	<div class="doggos text-left text-wrap container" style="overflow-wrap: break-word; background-color: #ffffff; max-width: 660px;">
		<div class="mt-5 pt-3 mx-auto">
		<div class="text-right">
			<span class="mt-3 text-center">
				<a href="#" class="btn btn-info">Edit <i class="fa fa-edit"></i></a>
				<a href="#" class="btn btn-danger">Delete <i class="fa fa-trash"></i></a>
			</span>
		</div>
			<img src=${imageurl} class="doggoImage mt-3" alt="Doggo image" width="100%">
			<div class="card-body">
				<h1 class="dogName">${doggoName}</h1>
				<p class="dogDescription">${description}</p>
				<span class="mt-3">
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
