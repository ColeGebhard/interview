window.addEventListener("DOMContentLoaded", setup);

//Declaring base_url, would put in .env file in other cases.
const BASE_URL = "http://localhost:3000";

async function setup() {
	try {
		const productContainer = document.querySelector('#productContainer');

        const isLoading = productContainer.innerHTML.trim() === '';

		if(!isLoading) {
			const data = await getAllPosts();
			renderProductHTML(data);
			applyStylesAfterLoad();
		} else {
			console.log("Still loading")
		}
	
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

	//Formatting number to USD
	function formatNumberToUSD(number) {
		let numberString = number.toString();

		let formattedNumber = '$' + numberString.slice(0, -2) + '.' + numberString.slice(-2);

		return formattedNumber
	}


	for (const product of data) {
		const productCard = document.createElement('div');
		productCard.classList.add('product');

		const productImage = document.createElement('img');
		productImage.setAttribute('src', product.images[0].src)

		const productName = document.createElement('h2');
		productName.textContent = product.title;

		const productPrice = document.createElement('h5');
		const price = formatNumberToUSD(product.price)
		productPrice.textContent = price;

		productCard.appendChild(productImage)
		productCard.appendChild(productName);
		productCard.appendChild(productPrice);


		productContainer.appendChild(productCard);
	}
}

function searchProducts() {
	const searchTerm = document.getElementById('searchBar').value.toLowerCase();
	const products = document.querySelectorAll('.product');

	products.forEach((product) => {
		const productName = product.querySelector('h2').textContent.toLowerCase();

		if (productName.includes(searchTerm)) {
			product.style.display = 'block';
		} else {
			product.style.display = 'none'
		}
	})
}

function applyStylesAfterLoad() {
	const productContainer = document.querySelector('#productContainer');
	productContainer.classList.add('content-loaded'); // Add a class to apply styles
}