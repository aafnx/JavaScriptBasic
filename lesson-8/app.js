'use strict';

let fitlerPopup = document.querySelector('.filterPopup');
let fitlerLabel = document.querySelector('.filterLabel');
let filterIcon = document.querySelector('.filterIcon');

fitlerLabel.addEventListener('click', function () {
  fitlerPopup.classList.toggle('hidden');
  fitlerLabel.classList.toggle('filterLabelPink');
  filterIcon.classList.toggle('filterIconPink');

  if (filterIcon.getAttribute('src') === 'images/filter.svg') {
    filterIcon.setAttribute('src', 'images/filterHover.svg')
  } else {
    filterIcon.setAttribute('src', 'images/filter.svg')
  }
});

let filterHeaders = document.querySelectorAll('.filterCategoryHeader');
filterHeaders.forEach(function (header) {
  header.addEventListener('click', function (event) {
    event.target.nextElementSibling.classList.toggle('hidden');
  })
});

let filterSizes = document.querySelector('.filterSizes');
let filterSizeWrap = document.querySelector('.filterSizeWrap');
filterSizeWrap.addEventListener('click', function () {
  filterSizes.classList.toggle('hidden');
});

// решение ДЗ
class ProductInBasket {
  count = 0;
  constructor(name, price, id) {
    this.name = name;
    this.price = price;
    this.id = id;
  }
  getSumProduct() {
    this.totalPrice = this.price * this.count;
  }
  increaseCountAndGetSum() {
    this.count++;
    this.getSumProduct();
  }
}

const basket = {
  products: [],
  totalPrice: 0,
  totalCount: 0,
  countInMarkupEl: document.querySelector('.cartIconWrap span'),
  basketEl: document.querySelector('.basketProductsWrap'),
  // получить сумму всех твоаров в корзине
  getTotalPrice() {
    this.totalPrice = 0;
    for (const product of this.products) {
      this.totalPrice += product.totalPrice;
    }
  },
  // получить количество всех твоаров в корзине
  getTotalCountProducts() {
    this.totalCount = 0;
    for (const product of this.products) {
      this.totalCount += product.count;
    }
  },
  // установить количество товаров из корзины в разметку
  setTotalCountInMarkup() {
    this.countInMarkupEl.style.visibility = 'visible';
    this.countInMarkupEl.textContent = this.totalCount;
  },
  // обновить разметку корзины
  updateMarkup() {
    let productMarkup = '';
    for (const product of this.products) {
      productMarkup +=
        `<tbody>
          <tr>
            <td>${product.name}</td>
            <td>${product.count}</td>
            <td>${product.price} &#36;</td>
            <td>${product.totalPrice} &#36;</td>
          </tr>
        </tbody>`;
    }
    this.basketEl.innerHTML =
      `<table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Количество</th>
          <th>Цена за единцу</th>
          <th>Общая стоимость</th>
        </tr>
        </thead>
      <tfoot>
        <tr>
        <td><button class="clearBasket">Очистить корзину</button></td>
          <td>Итого</td>
          <td>${this.totalCount} ед.</td>
          <td>${this.totalPrice} &#36;</td>
          </tr>
      </tfoot>
      ${productMarkup}
    </table>`;
  },
  // обновить все данные в корзине
  update() {
    this.getTotalPrice();
    this.getTotalCountProducts();
    this.setTotalCountInMarkup();
    this.updateMarkup();
  },
  // очистить корзну
  clear() {
    this.products = [];
    this.totalPrice = 0;
    this.totalCount = 0;
    this.countInMarkupEl.style.visibility = 'hidden';
    this.updateMarkup();
  },
};

// добавление товара в корзину
document.querySelector('.featuredItems').addEventListener('click', event => {
  let button = event.target;
  /**
   * Если кликнули не по кнопке или не по изображению корзины 
   * в кнопке, то выходим
   */
  if (!(button.tagName === 'BUTTON'
    || button.parentNode.tagName === 'BUTTON')) {
    return;
  };
  /* если кликнули по иконке корзины, то event target == img, а нам нужна
  * кнопка, поэтому меняем элемент на родителя img, то есть на кнопку
  */

  if (button.parentNode.tagName === 'BUTTON') {
    button = button.parentNode;
  }

  /* вариант получения данных из верстки
  получаем название продукта из верстки
  const newProductName = button.parentNode.parentNode
    .nextElementSibling.children[0].textContent.trim();

  получаем цену товара из верстки в виде строки с символом валюты
  let newProductPrice = button.parentNode.parentNode
    .nextElementSibling.children[2].textContent.trim();

  удаляем символ валюты и преобразуем в число
  newProductPrice = newProductPrice.split(''); // преобразовали в массив
  newProductPrice.splice(0, 1); // удалили символ валюты
  newProductPrice = parseInt(newProductPrice.join('')); // склеили в строку и преобразовали в число

  получили id
  const newProductId = button.parentNode.parentNode.parentNode.dataset.id;
  */


  //через data
  const newProductName = button.parentNode.parentNode.parentNode.dataset.name;
  const newProductPrice = button.parentNode.parentNode.parentNode.dataset.price;
  const newProductId = button.parentNode.parentNode.parentNode.dataset.id;

  // если в корзине есть продукт с таким же id, то увеличиваем количество товара
  for (const product of basket.products) {
    if (product.id == newProductId) {
      product.increaseCountAndGetSum();
      basket.update();
      return;
    }
  }

  // если нет создаем новый продукт в виде объекта, кладем в корзину
  const newProduct =
    new ProductInBasket(newProductName, newProductPrice, newProductId);
  newProduct.increaseCountAndGetSum();
  basket.products.push(newProduct);
  basket.update();
});

// появление меню корзины при клике на иконку корзины
document.querySelector('.cartIconWrap')
  .addEventListener('click', () => basket.basketEl.classList.toggle('hidden'));

// очистка корзины при клике на кнопку с классом .clearBasket
document.querySelector('.basketProductsWrap')
  .addEventListener('click', event => {
    if (!event.target.classList.contains('clearBasket')) {
      return;
    }
    basket.clear();
  });