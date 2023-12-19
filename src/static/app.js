window.addEventListener("DOMContentLoaded", setup);

//Declaring base_url, would put in .env file in other cases.
const BASE_URL = "http://localhost:3000";

//setupfunction that starts the process of javascript
//Calls all posts, and applys it to functions in need.
//Loading feature looks for when productContainer changes form loading... to products
//When loading is done, data is pushed in renderProductHTML, and styles applied.
async function setup() {
	try {
		const productContainer = document.querySelector('#productContainer');

		const isLoading = productContainer.innerHTML.trim() === '';

		if (!isLoading) {
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
//Used an old way I learned with appending, and creating elements
async function renderProductHTML(data) {

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

	//For loop to go through each product in data array of objects
	//Creates attributes and elements to place in div
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

//Search product function. Uses terms value and sets toLowerCase
//Function called in index.html
function searchProducts() {
	const searchTerm = document.getElementById('searchBar').value.toLowerCase();
	const products = document.querySelectorAll('.product');

	//For Each compares each product, converts the h2 to lowercase, and looks at search
	//productName shows all the products that include the searchTerm string and displays it.
	products.forEach((product) => {
		const productName = product.querySelector('h2').textContent.toLowerCase();
		console.log(productName)
		if (productName.includes(searchTerm)) {
			product.style.display = 'block';
		} else {
			product.style.display = 'none'
		}
	})
}

//Some extra time, prevents loading... from taking the styles, and applys
// to the productContainer.
function applyStylesAfterLoad() {
	const productContainer = document.querySelector('#productContainer');
	productContainer.classList.add('content-loaded');
}