import getDataLocalStorage, {setDataLocalStorage} from "./localStorage.js";
const data = getDataLocalStorage(); // Tạo biến lưu data trả về từ hàm getDataLocalStorage ở file localStorage.js

// Hàm hiển thị món ăn nổi bật
function renderFeaturedDishes(data) {
    const menuAllDish = document.getElementById('body-menu'); // Nơi để đưa thông tin các món ăn vào
    data.featuredDishes.forEach(dish => { // Duyệt từng phần tử trong featuredDishes
        menuAllDish.innerHTML += `
            <div class="menu_card">
                <div class="card_dish">
                    <img src="${dish.image_url}">
                </div>
                <h5>${dish.name}</h5>
                <h6>${dish.price}</h6>
                <button class="add_to_cart" id="${dish.id}">Thêm vào giỏ hàng</button>
            </div>
        `;
    });
}

// Hàm thêm món ăn vào giỏ hàng
function handleCart(data) {
    document.querySelectorAll('.add_to_cart').forEach(button => {
        button.addEventListener('click', function () {
            const foodId = parseInt(this.id);
            const user_ID = parseInt(sessionStorage.getItem('UserID'));
            if (!user_ID) {
                const users_confirm = confirm("Bạn chưa đăng nhập. Bạn có muốn đăng nhập hoặc đăng ký không?");
                if (users_confirm) {
                    document.getElementById('logAndReg_modal').style.display = 'block';
                } else {
                    alert("Hãy đăng nhập để thêm món vào giỏ hàng.");
                }
            } else {
                const food_Item = data.featuredDishes.find(dish => dish.id == foodId);
                const cartItem = {
                    "id": user_ID,
                    "nameFood": food_Item.name,
                    "foodId": food_Item.id,
                    "type": food_Item.type,
                    "image_url": food_Item.image_url,
                    "price": food_Item.price,
                    "food_Qty": 1,
                    "describe": food_Item.describe,
                };
                data.carts.push(cartItem);
                setDataLocalStorage(data); // Lưu giỏ hàng vào localStorage
                alert('Bạn đã thêm món vào giỏ hàng thành công');
            }
        });
    });
}

// Hàm chuyển sang page detail
function switchToDetailPage() {
    const menu_cards = document.querySelectorAll(".menu_card");
    menu_cards.forEach( (menu_card) => {
        menu_card.addEventListener("click", (e) => {
            console.log(e)
            if(e.target.className != "add_to_cart") {
                sessionStorage.setItem('foodId', menu_card.querySelector(".add_to_cart").id);
                window.location.href = "./details.html"
            }
        })
    })
        
}

// Hàm chạy chương trình
function runPage(data) {
    document.addEventListener('DOMContentLoaded', () => {
        renderFeaturedDishes(data);
        handleCart(data);
        switchToDetailPage();
    })
}

runPage(data);