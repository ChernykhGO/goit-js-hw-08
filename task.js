// Разбей задание на несколько подзадач:
// - Создание и рендер разметки по массиву данных и предоставленному шаблону.
// - Реализация делегирования на галерее `ul.js-gallery` и получение `url` большого
//   изображения.
// - Открытие модального окна по клику на элементе галереи.
// - Подмена значения атрибута `src` элемента `img.lightbox__image`.
// - Закрытие модального окна по клику на кнопку
//   `button[data-action="close-lightbox"]`.
// - Очистка значения атрибута `src` элемента `img.lightbox__image`. Это необходимо
//   для того, чтобы при следующем открытии модального окна, пока грузится
//   изображение, мы не видели предыдущее.

import gallery from "./gallery-items.js";

// 1. Создаем шаблон разметки
console.log(createFotoCardsListMarkup (gallery));
function createFotoCardsListMarkup (gallery) {
  return gallery.map(({preview, original, description}) => {
    return `
  <li class="gallery__item">
  <a class="gallery__link"
    "${original}"
  />
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>
`;
  }).join('');
};

//  2. Добавляем разметку в уже существующий элемент <ul class="gallery js-gallery">
const galleryContainer = document.querySelector('.js-gallery');
const cardMarkup = createFotoCardsListMarkup(gallery);
galleryContainer.insertAdjacentHTML('beforeend', cardMarkup);

// 3 - Открываем модальное окно по клику добавляя класс is-open, 
// меняем значение`src`
const modal = document.querySelector('.lightbox');
const modalContent = document.querySelector('.lightbox__image');

galleryContainer.addEventListener('click', onOpenModalClick);
function onOpenModalClick(evt) {
  evt.preventDefault();
  // console.log(evt.target);
  // console.log(evt.target.alt);
  // console.log(evt.target.dataset.source);
  modalContent.src = evt.target.dataset.source;
  modalContent.alt = evt.target.alt;
  modal.classList.add('is-open');
  window.addEventListener('keydown', ScrollImages);
};

// 4.Пролистываем изображения галереи в открытом  окне клавишами "влево" и "вправо"
function ScrollImages(e) {
    let newIndex;
  const arrayImages = gallery.map((item) => item.original);
  const currentId = arrayImages.indexOf(modalContent.src);
  if (e.key === 'ArrowLeft') {
    newIndex = currentId - 1;
    if (newIndex == -1) {
      newIndex = arrayImages.length - 1;
    }
  } else if (e.key === 'ArrowRight') { 
    newIndex = currentId + 1;
    if (newIndex === arrayImages.length) {
      newIndex = 0;
    }
  }
  else {
    return;
  }
   modalContent.src = arrayImages[newIndex];
};

// 5.Закрытие модального окна по клику на кнопку `button[data-action="close-lightbox"]`
// (Доступ к элементу, слушаем клик и убираем класс 'is-open')
const closeModal = document.querySelector('.lightbox__button');

closeModal.addEventListener('click', onCloseBtnClick);
   function onCloseBtnClick() {
  modal.classList.remove('is-open');
     modalContent.src = '';
};

//6. Закрытие модального окна по нажатию клавиши `ESC`.
window.addEventListener('keydown', onEscCloseModal);

function onEscCloseModal(evt) {
  if (evt.code === 'Escape') {
    onCloseBtnClick();
  //     window.removeEventListener("keydown", onEscPress);
  // window.removeEventListener("keydown", onArrowPress);
  }
}


//7. Закрытие модального окна по клику на `div.lightbox__overlay`.
const closeModalOverlay = document.querySelector('.lightbox__overlay');

closeModalOverlay.addEventListener('click', CloseImg);
function CloseImg() {
    onCloseBtnClick();
};
