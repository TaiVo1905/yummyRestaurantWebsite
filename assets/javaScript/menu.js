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
                <td><img src="${item.image_url}" alt="${item.name}" width="100px" height="100px"></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
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

