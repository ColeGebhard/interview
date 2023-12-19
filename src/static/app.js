window.addEventListener("DOMContentLoaded", setup);

//Declaring base_url, would put in .env file in other cases.
const BASE_URL = "http://localhost:3000";

async function setup() {
	try {
		const data = await getAllPosts();
		renderProductHTML(data);

	} catch (error) {
		console.error(error.message);
	}
}

//Function to call and store all posts.
async function getAllPosts() {
	try {
		const response = await fetch(`${BASE_URL}/products`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Failed to get products', error);
		throw new Error('Cannot get products');
	}
}

//Rendering data for HTML card.
async function renderProductHTML(data) {
	console.log(data);

	const productContainer = document.querySelector('#productContainer');

	productContainer.innerHTML = '';

	//Sort objects from low to high
	data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

	for (const product of data) {
		const productCard = document.createElement('div');
		productCard.classList.add('product');

		const productImage = document.createElement('img');
		productImage.setAttribute('src', product.images[0].src )

		const productName = document.createElement('h2');
		productName.textContent = product.title;

		const productPrice = document.createElement('h5');
		productPrice.textContent = product.price;
	
		productCard.appendChild(productImage)
        productCard.appendChild(productName);
		productCard.appendChild(productPrice);


		productContainer.appendChild(productCard);
	}
}
