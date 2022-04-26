import { productsList } from "./products.js";

let cart = [];
let btnDOM = [];

const productContent = document.querySelector(".products");
const modalContent = document.querySelector(".modal-content");
const valueCart = document.querySelector(".shopping-cart-value");
const totalPrice = document.querySelector(".total-price");

// -----------------modal-----------------
const shoppingCart = document.querySelector(".shopping-cart");
const modalClose = document.querySelector(".close-modal");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");

shoppingCart.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);

function showModal() {
  modal.style.display = "flex";
  backdrop.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
  backdrop.style.display = "none";
}

// ----------------Product----------------

class Product {
  getApiProduct() {
    return productsList;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const product = new Product();
  const ui = new UI();
  const products = product.getApiProduct();
  ui.showProduct(products);
  Local.setLocalProduct(products);
  const btnAddCart = [...document.querySelectorAll(".add-cart")];
  btnDOM = btnAddCart;
  Local.getLocalCart();
  ui.getBtnAddCart(btnAddCart);
  ui.showCartModal(cart);
  ui.logicalCart();
});

// ------------------Ui------------------
class UI {
  showProduct(product) {
    product.forEach((item) => {
      const newProduct = document.createElement("div");
      newProduct.classList.add("product");
      newProduct.innerHTML = `<img src="${item.imgUrl}" alt="${item.title}" />
      <div class="caption">
        <span class="price">${item.price} $</span>
        <p class="title-img">${item.title}</p>
      </div>
      <button class="add-cart" data-id=${item.id} >
        <i class="fas fa-shopping-cart"></i>
        <span> add to cart</span>
      </button>`;
      productContent.appendChild(newProduct);
    });
  }

  getBtnAddCart(buttons) {
    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((item) => item.id === id);
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        btn.innerText = "In Cart";
        btn.disabled = true;
        const cartItem = Local.getLocalProduct(id);
        cart = [...cart, { ...cartItem, quantity: 1 }];
        Local.setLocalCart(cart);
        this.showCartModal(cart);
      });
    });
  }

  showCartModal(cart) {
    modalContent.innerHTML = "";
    cart.forEach((item) => {
      const modalItem = document.createElement("div");
      modalItem.classList.add("modal-cart");
      modalItem.innerHTML = `<img class="modal-img" src="${item.imgUrl}" alt="${item.title}" />
      <div class="modal-cart-data">
        <h2>${item.title}</h2>
        <span>${item.price} $</span>
      </div>
      <div class="modal-number">
        <button class="modal-increase" data-id=${item.id}>
          <i class="fas fa-chevron-up"></i>
        </button>
        <span>${item.quantity}</span>
        <button class="modal-decrease" data-id=${item.id}>
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      <button class="modal-remove-cart" data-id=${item.id}>
        <i class="fas fa-trash"></i>
      </button>`;
      modalContent.appendChild(modalItem);
      this.setValue(cart);
    });
  }

  setValue(cart) {
    const price = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    totalPrice.innerText = price.toFixed(2);

    const value = cart.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
    valueCart.innerText = value;
  }

  logicalCart() {
    modal.addEventListener("click", (e) => {
      const classItem = [...e.target.parentElement.classList];
      const idBtn = e.target.parentElement.dataset.id;
      switch (classItem[0]) {
        case "modal-increase":
          cart.forEach((item) => {
            if (item.id === idBtn) {
              item.quantity++;
            }
          });
          break;

        case "modal-decrease":
          cart.forEach((item) => {
            if (item.id === idBtn && item.quantity > 1) {
              item.quantity--;
            }
          });
          break;

        case "modal-remove-cart":
          this.removeCart(idBtn);
          break;

        case "modal-clear-cart":
          cart.forEach((item) => this.removeCart(item.id));
          break;
      }

      Local.setLocalCart(cart);
      this.showCartModal(cart);
      this.setValue(cart);
    });
  }

  removeCart(id) {
    cart = cart.filter((item) => item.id !== id);
    const btnCart = btnDOM.find((btn) => btn.dataset.id === id);
    btnCart.innerHTML = `<i class="fas fa-shopping-cart"></i>
    <span> add to cart</span>`;
    btnCart.disabled = false;
  }
}

// -----------------Local-----------------

class Local {
  static setLocalProduct(product) {
    localStorage.setItem("product", JSON.stringify(product));
  }
  static getLocalProduct(id) {
    const productCart = JSON.parse(localStorage.getItem("product"));
    return productCart.find((item) => item.id === id);
  }
  static setLocalCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getLocalCart() {
    cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
