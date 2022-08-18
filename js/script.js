let productName = document.getElementById("productNameInput");
let productPrice = document.getElementById("productPriceInput");
let productCategory = document.getElementById("productCategoryInput");
let productDesc = document.getElementById("productDescInput");

let addBtn = document.getElementById("addBtn");
let updateBtn = document.getElementById("updateBtn");

let searchInput = document.getElementById("productSearchInput");

let tableBody = document.getElementById("tableBody");

productsContainer = [];

if (localStorage.getItem("products") != null) {
  productsContainer = JSON.parse(localStorage.getItem("products"));
  displayProducts(productsContainer);
}

addBtn.onclick = function (e) {
  e.preventDefault();
  if (
    productName.value == "" ||
    productPrice.value == "" ||
    productCategory.value == "" ||
    productDesc.value == ""
  ) {
    return;
  }
  function newid(start) {
    let id = start;
    for (let i = 0; i < productsContainer.length; i++) {
      if (productsContainer[i].id == id) {
        return newid(id + 1);
      }
    }
    return start;
  }
  product = {
    id: newid(productsContainer.length),
    name: productName.value,
    price: productPrice.value,
    category: productCategory.value,
    desc: productDesc.value,
  };
  productsContainer.push(product);
  clearForm();
  localStorage.setItem("products", JSON.stringify(productsContainer));
  displayProducts(productsContainer);
};

function clearForm() {
  productName.value = "";
  productPrice.value = "";
  productCategory.value = "";
  productDesc.value = "";
}

function displayProducts(products) {
  fetchedProducts = "";
  for (let i = 0; i < products.length; i++) {
    fetchedProducts += `
    <tr>
        <td>${i + 1}</td>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].category}</td>
        <td>${products[i].desc}</td>
        <td>
            <button onclick='retrieveProduct(${
              products[i].id
            })' class="btn btn-warning">update</button>
        </td>
        <td>
            <button onclick='deleteProduct(${
              products[i].id
            })' class="btn btn-danger">delete</button>
        </td>
    </tr>`;
  }
  tableBody.innerHTML = fetchedProducts;
}

searchInput.oninput = function () {
  searchContainer = [];
  for (let i = 0; i < productsContainer.length; i++) {
    if (productsContainer[i].name.includes(this.value)) {
      //we use json to get value not reference
      searchContainer.push(JSON.parse(JSON.stringify(productsContainer[i])));
      if (this.value != "") {
        searchContainer[searchContainer.length - 1].name = searchContainer[
          searchContainer.length - 1
        ].name.replaceAll(
          this.value,
          `<span style="color:red">${this.value}</span>`
        );
      }
    }
  }
  displayProducts(searchContainer);
};

function deleteProduct(productId) {
  for (let i = 0; i < productsContainer.length; i++) {
    if (productsContainer[i].id == productId) {
      productsContainer.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("products", JSON.stringify(productsContainer));
  displayProducts(productsContainer);
}

function retrieveProduct(productId) {
  for (let i = 0; i < productsContainer.length; i++) {
    if (productsContainer[i].id == productId) {
      productName.value = productsContainer[i].name;
      productPrice.value = productsContainer[i].price;
      productCategory.value = productsContainer[i].category;
      productDesc.value = productsContainer[i].desc;
      break;
    }
  }
  addBtn.style.display = "none";
  updateBtn.style.display = "block";
  updateBtn.setAttribute("data-deleteid", productId);
}

updateBtn.onclick = function (e) {
  e.preventDefault();
  for (let i = 0; i < productsContainer.length; i++) {
    if (productsContainer[i].id == this.getAttribute("data-deleteid")) {
      productsContainer[i].name = productName.value;
      productsContainer[i].price = productPrice.value;
      productsContainer[i].category = productCategory.value;
      productsContainer[i].desc = productDesc.value;
      break;
    }
  }
  addBtn.style.display = "block";
  updateBtn.style.display = "none";
  updateBtn.removeAttribute("data-deleteid");
  localStorage.setItem("products", JSON.stringify(productsContainer));
  clearForm();
  displayProducts(productsContainer);
};
