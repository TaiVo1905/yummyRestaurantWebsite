import getDataLocalStorage, {setDataLocalStorage} from "../javaScript/localStorage.js";
const data = getDataLocalStorage();
let filtered=[];
// hàm lọc món ăn theo loại và hiển thị dưới dạng bảng
function filterMenu (){
    const menu = data.menu;
    const menu_list = document.querySelector('#menu_list');
    menu_list.addEventListener('click', (e) => {
        const type = e.target.textContent;
        // console.log(type, menu);
        // lọc món ăn theo loại
        filtered = menu.filter(item => {
            return item.type.toLowerCase() === type.toLowerCase();
        })
        // nơi hiển thị dữ liệu của menu
        const menuTblBody = document.querySelector("#menu_tbl tbody");
        menuTblBody.innerHTML = ''; // Xóa nội dung cũ
    
        // hiển thị các món đã lọc được
        filtered.forEach(item => {
            menuTblBody.innerHTML += `
                <td class="product_image"><img src="${item.image_url}" alt="${item.name}" width="100px" height="100px"></td>
                <td class="product_name">${item.name}</td>
                <td class="product_price">${item.price}</td>
                <td>
                    <div id="number-input">
                        <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" id="number_subtraction">-</button>
                        <input class="input_sl" id="input_sl-${item.id}" type="number" value="1" min="1" />
                        <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" id="number_addition">+</button>
                    </div>
                </td>
                <td>
                    <textarea name="note" class="input_note" id="input_note-${item.id}" placeholder="Nhập ghi chú..."></textarea>
                </td>
                <td><button class="btn_add" id="btn_add-${item.id}">Thêm vào giỏ hàng</button></td>
            </tr> 
            `;
        });
    addData()
        addCart()
  // Thêm sự kiện nhấp chuột cho các sản phẩm mới
  addClickEventToProducts();
    // Nếu không có món ăn nào phù hợp
        if (filtered.length === 0) {
            menuTblBody.innerHTML = `
                <tr>
                    <td colspan="6">Không có món nào thuộc loại này.</td>
                </tr>
            `;
        }
    })
}
filterMenu()


function addData(){
    document.querySelectorAll('.btn_add').forEach(button=>{
        // gắn sự kiện onclick cho các nút button "thêm vào giỏ hàng"
        button.addEventListener('click', function(){
            // lấy id của nút gán cho foodID
            const foodID = parseInt(this.id.split('-')[1]); 
            
            const foodQuantity = document.querySelector(`#input_sl-${foodID}`).value;
            const foodNote = document.querySelector(`#input_note-${foodID}`).value;
            // lấy dữ liệu 
            
            const foodItem = filtered.find(item =>{
                return item.id === foodID;
            })
            const userID = sessionStorage.getItem('UserID');
            // kiểm tra nếu chưa có userID tức là chưa đăng nhập thành công
            if(!userID){
                let userConfirmed = confirm("Bạn chưa đăng nhập. Bạn có muốn đăng nhập hoặc đăng ký không?");
                if (userConfirmed) {
                        document.getElementById('logAndReg_modal').style.display = 'block';
                        document.getElementById('register_Form').style.display = 'block';
                        document.getElementById('login_Form').style.display = 'block';
                } else {
                    alert("Hãy đăng nhập để thêm món vào giỏ hàng.");
                }
            }
            else{
                const cartItem = {
                    userId: userID,
                    nameFood: foodItem.name,
                    image_url: foodItem.image_url,
                    price: foodItem.price,
                    food_Number: parseInt(foodQuantity),
                    food_Note: foodNote
                }
                // Kiểm tra xem có trong cart có chưa. Nếu có rồi thì tăng số lượng
                let itemIndex = data.carts.findIndex(item =>{
                    return item.nameFood === foodItem.name;
                })
    
                if (itemIndex !== -1){
                    data.carts[itemIndex].food_Number += cartItem.food_Number;
                    // alert("Bạn thêm thành công!")
                }
                else{
                    data.carts.push(cartItem);
                    // alert("Thêm thành công!")
                }
                setDataLocalStorage(data);
            }
            
        })
    })
}
// định dạng cho class active hoạt động đúng như mong đợi (MẶC ĐỊNH)
document.querySelectorAll('#menu_list a').forEach(category => {
    category.addEventListener('click', function(e){
        e.preventDefault();
        document.querySelectorAll('#menu_list a').forEach(i => {
            i.classList.remove('active');
        })
        this.classList.add('active');
    });
});

/*sd hàm forEach để duyệt qua tất cả các thẻ a trong menu list
    thêm sự kiện click vào mỗi thẻ a
    chạy function: ngăn chặn các hành vi mặc định của thẻ a (như href)
    duyệt qua từng thẻ a một lần nữa:
    - Xóa class active trong các thẻ a khác
    - thêm class active vào thẻ a hiện tại (this.classList.add('active'))
*/

// lấy category khai vị làm mặc định khi tải trang (MẶC ĐỊNH)
window.addEventListener('load',()=>{
    const defaultPage = document.querySelector('#menu_list a');
    if (defaultPage){
        defaultPage.click();
        // mô phỏng quá trình click. Tức là khi tải trang nó sẽ tự động click vào thẻ a đầu tiên mà không cần người dùng click vào.
    }
})

// Khi click vào nút "Thêm vào giỏ hàng"
console.log(document.querySelectorAll('.btn_add'))
function addCart() {
    document.querySelectorAll('.btn_add').forEach(button=>{
        // gắn sự kiện onclick cho các nút button "thêm vào giỏ hàng"
        button.addEventListener('click', function(){
            // lấy id của nút gán cho foodID
            const foodID = this.id.split('-')[1]; 
            const foodQuantity = document.querySelector(`#input_sl-${foodID}`).value;
            const foodNote = document.querySelector(`#input_note-${foodID}`).value;
            // lấy dữ liệu 
            const foodItem = filtered.find(item =>{
                return item.id===foodID;
            })

            const userID = sessionStorage.getItem('UserID');
            // kiểm tra nếu chưa có userID tức là chưa đăng nhập thành công
            if(!userID){
                alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm vào giỏ hàng!")
            }
            // tạo một đối tượng chứa các thông tin (user_ID, foodName, ....)
            const cartItem = {
                user_ID: userID,
                food_Name: foodItem.name,
                food_Image: foodItem.image_url,
                food_Price: foodItem.price,
                food_Number: foodQuantity,
                food_Note: foodNote
            }
            // Đẩy dữ liệu lên mảng data.carts(json)
            data.carts.push(cartItem);
            // Đẩy lên localstorage 
            setDataLocalStorage(data);

            // Sau khi đẩy lên localStorage xong. Hiển thị 1 dòng trạng thái "thêm thành công"
            alert("Quý khách đã thêm món ăn vào giỏ hàng thành công!")
        })
    })
}

//Xem sản phẩm chi tiết
// Đảm bảo hàm onclickProduct hoạt động đúng
function onclickProduct(event) {
    // Kiểm tra nếu sự kiện xảy ra từ một phần tử sản phẩm
    const productElement = event.target.closest('.product_image, .product_name, .product_price');
    if (!productElement) {
        return; // Nếu không phải, ngăn chặn việc chuyển trang
    }
     /*
        event.target: Trả về phần tử cụ thể mà người dùng đã nhấp vào.
        .closest(selector): Phương thức này tìm kiếm trong chuỗi các phần tử cha gần nhất cho phần tử mà đã được nhấp vào
        (trong trường hợp này là event.target). Nếu phần tử đó khớp với bất kỳ phần tử nào trong chuỗi .product_image, 
        .product_name, hoặc .product_price, nó sẽ trả về phần tử đó. Nếu không, nó sẽ trả về null.
         */
        
    // Chuyển hướng đến trang chi tiết
    window.location.href = "details.html"; 
}

function addClickEventToProducts() {
    const productElements = document.querySelectorAll('.product_image, .product_name, .product_price');
    productElements.forEach(function (element) {
        element.addEventListener('click', onclickProduct);
    });
}