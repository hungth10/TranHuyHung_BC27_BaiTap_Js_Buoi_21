// **** tạo lớp đối tượng Staff
function Staff(
  account,
  name,
  email,
  password,
  datePicker,
  basicSalary,
  position,
  workTime
) {
  this.account = account;
  this.name = name;
  this.email = email;
  this.password = password;
  this.datePicker = datePicker;
  this.basicSalary = basicSalary;
  this.position = position;
  this.workTime = workTime;
}

// tính tổng lương
Staff.prototype.sumSalary = function () {
  var sum = 0;

  if (this.position === "Sếp") {
    sum = this.basicSalary * 3;
  } else if (this.position === "Trưởng phòng") {
    sum = this.basicSalary * 2;
  } else if (this.position === "Nhân viên") {
    sum = this.basicSalary * 1;
  }

  return sum.toLocaleString();
};

// xếp loại nhân viên
Staff.prototype.rank = function () {
  if (this.workTime >= 192) {
    return "nhân viên xuất sắc";
  }

  if (this.workTime >= 176) {
    return "nhân viên giỏi";
  }

  if (this.workTime >= 160) {
    return "nhân viên khá";
  }

  return "nhân viên trung bình";
};

// tạo mảng staffs
var staffs = [];

pushLocalStorage();

function pushLocalStorage() {
  staffs = JSON.parse(localStorage.getItem("staffs")) || [];

  for (var i = 0; i < staffs.length; i++) {
    var staff = staffs[i];

    staffs[i] = new Staff(
      staff.account,
      staff.name,
      staff.email,
      staff.password,
      staff.datePicker,
      staff.basicSalary,
      staff.position,
      staff.workTime
    );
  }

  display(staffs);
}

// **** thêm nhân viên
function addStaff() {
  var account = document.getElementById("tknv").value;
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var datePicker = document.getElementById("datepicker").value;
  var basicSalary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workTime = +document.getElementById("gioLam").value;

  var staff = new Staff(
    account,
    name,
    email,
    password,
    datePicker,
    basicSalary,
    position,
    workTime
  );

  // kiểm tra input có hợp lệ
  var isValid = validation();
  if (!isValid) {
    // alert("Vui lòng nhập đủ thông tin");
    return;
  }

  //   thêm staff vào mảng staffs
  staffs.push(staff);
  console.log(staffs);

  localStorage.setItem("staffs", JSON.stringify(staffs));

  // gọi hàm display và truyền vào mảng staffs
  display(staffs);

  resetForm();
}

// *** hiển thị ra giao diện
function display(staffs) {
  var tbodyEl = document.getElementById("tableDanhSach");

  var content = "";

  for (var i = 0; i < staffs.length; i++) {
    var staff = staffs[i];

    console.log(staff);
    content += `
        <tr>
          <td>${staff.account}</td>
          <td>${staff.name}</td>
          <td>${staff.email}</td>
          <td>${staff.datePicker}</td>
          <td>${staff.position}</td>
          <td>${staff.sumSalary()}</td>
          <td>${staff.rank()}</td>

          <td>
            <button
              class="btn btn-success"
              onclick="editStaff('${staff.account}')"
              
              data-toggle="modal"
              data-target="#myModal"
            >
              Edit
            </button>

            <button
              class="btn btn-danger"
              onclick="deleteStaff('${staff.account}')"
            >
              Xoá
            </button>
          </td>
        </tr>
      `;
  }

  tbodyEl.innerHTML = content;
}

// *** reset form
function resetForm() {
  document.getElementById("tknv").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("datepicker").value = "";
  document.getElementById("luongCB").value = "";
  document.getElementById("chucvu").value = "";
  document.getElementById("gioLam").value = "";

  document.getElementById("tknv").disabled = false;
}

// **** hàm xóa 1 nhân viên trong mảng staffs
function deleteStaff(staffAcount) {
  // console.log(typeof staffAcount)

  var index = findAccount(staffAcount);

  if (index !== -1) {
    staffs.splice(index, 1);
  }

  localStorage.setItem("staffs", JSON.stringify(staffs));

  display(staffs);
}

// **** Hàm edit thông tin nhân viên
function editStaff(staffAcount) {
  console.log(staffAcount);

  var index = findAccount(staffAcount);

  var staff = staffs[index];

  document.getElementById("tknv").value = staff.account;
  document.getElementById("name").value = staff.name;
  document.getElementById("email").value = staff.email;
  document.getElementById("password").value = staff.password;
  document.getElementById("datepicker").value = staff.datePicker;
  document.getElementById("luongCB").value = staff.basicSalary;
  document.getElementById("chucvu").value = staff.position;
  document.getElementById("gioLam").value = staff.workTime;

  document.getElementById("tknv").disabled = true;
}

//  *** update staff
function updateStaff() {
  var account = document.getElementById("tknv").value;
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var datePicker = document.getElementById("datepicker").value;
  var basicSalary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workTime = +document.getElementById("gioLam").value;

  var staff = new Staff(
    account,
    name,
    email,
    password,
    datePicker,
    basicSalary,
    position,
    workTime
  );

  // kiểm tra input có hợp lệ
  var isValid = validation();
  if (!isValid) {
    return;
  }

  // tìm chỉ mục của phần tử muốn thay đổi
  var index = findAccount(staff.account);

  // gán lại phần tử muốn thay đổi bằng phần tử mới
  staffs[index] = staff;

  // lưu xuồng local Storage
  localStorage.setItem("staffs", JSON.stringify(staffs));

  // Hiển thị ra giao diện
  display(staffs);

  // reset lại mặc định
  resetForm();
}

// **** hàm tìm tài khoản của nhân viên
function findAccount(staffAcount) {
  var index = -1;

  for (var i = 0; i < staffs.length; i++) {
    var staff = staffs[i];

    if (staff.account === staffAcount) {
      index = i;
      break;
    }
  }

  return index;
}

// **** Hàm tìm kiếm loại nhân viên
function searchStaff() {
  var searchValue = document.getElementById("searchName").value;
  searchValue = searchValue.toLowerCase();

  var newStaffs = [];
  for (var i = 0; i < staffs.length; i++) {
    var staff = staffs[i];
    var staffRank = staff.rank();

    staffRank = staffRank.toLowerCase();

    console.log(staffRank);

    if (staffRank.indexOf(searchValue) !== -1) {
      newStaffs.push(staff);
    }
  }

  display(newStaffs);
}

// Hàm kiểm tra Input có hợp lệ hay không
function validation() {
  var account = document.getElementById("tknv").value;
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var datePicker = document.getElementById("datepicker").value;
  var basicSalary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workTime = +document.getElementById("gioLam").value;

  var isValid = true;

  // Kiểm tra tài khoản có hợp lệ hay không
  var accountPatern = /^[0-9]{4,6}$/;
  if (!isRequired(account)) {
    isValid = false;
    document.getElementById(
      "tbTKNV"
    ).innerHTML = `Tài khoản không được để trống`;
  }  else if (!accountPatern.test(account)) {
    isValid = false;
    document.getElementById("tbTKNV").innerHTML =
     'Tài khoản phải từ 4 đến 6 chữ số';
  } else {
    document.getElementById("tbTKNV").innerHTML = "";
  }

  // kiểm tra tên có hợp lệ
  var namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;

  if(!isRequired(name)) {
    isValid = false;
    document.getElementById("tbTen").innerHTML = "Tên không được để trống";
  } else if (!minLength(name, 3)) {
    isValid = false;
    document.getElementById("tbTen").innerHTML = "Tên phải dài hơn 3 ký tự";
  } else if (!namePattern.test(name)) {
    isValid = false;
    document.getElementById("tbTen").innerHTML = "Tên có ký tự không hợp lệ";
  } else {
    document.getElementById("tbTen").innerHTML = "";
  }

  // kiểm tra email 
  var emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if(!isRequired(email)) {
    isValid = false;
    document.getElementById("tbEmail").innerHTML = "Email không được để trống";
  } else if (!emailPattern.test(email)) {
    isValid = false;
    document.getElementById("tbEmail").innerHTML = "Email không đúng định dạng";
  } else {
    document.getElementById("tbEmail").innerHTML = "";
  }

  // Kiểm tra password có hợp lệ hay không
  var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if(!isRequired(password)) {
    isValid = false;
    document.getElementById("tbMatKhau").innerHTML = "password không được để trống";
  } else if (!passwordPattern.test(password)) {
    isValid = false;
    document.getElementById("tbMatKhau").innerHTML = "password không đúng định dạng";
  } else {
    document.getElementById("tbMatKhau").innerHTML = "";
  }

  // Kiểm tra ngày làm
  if(!isRequired(datePicker)) {
    isValid = false;
    document.getElementById("tbNgay").innerHTML = "Ngày làm không được để trống";
  }  else {
    document.getElementById("tbNgay").innerHTML = "";
  }

  // kiểm tra Lương co bản
  if(!isRequired(basicSalary)) {
    isValid = false;
    document.getElementById("tbLuongCB").innerHTML = "Lương cơ bản không được để trống";
  } else if (basicSalary < 1000000 || basicSalary > 20000000) {
    isValid = false;
    document.getElementById("tbLuongCB").innerHTML =
     "Lương cơ bản không thể nhỏ hơn 1000000 và lớn hơn 20000000";
  } else {
    document.getElementById("tbLuongCB").innerHTML = "";
  }

  // Kiểm tra chức vụ
  if(!isRequired(position)) {
    isValid = false;
    document.getElementById("tbChucVu").innerHTML = "Chức vụ không được để trống";
  } else {
    document.getElementById("tbChucVu").innerHTML = "";
  }

  // Kiểm tra giờ làm
  if(!isRequired(workTime)) {
    isValid = false;
    document.getElementById("tbGiolam").innerHTML = "Giờ làm không được để trống";
  } else if (workTime < 80 || workTime > 200) {
    isValid = false;
    document.getElementById("tbGiolam").innerHTML =
     "Giờ làm không thể nhỏ hơn 80 và lớn hơn 200";
  } else {
    document.getElementById("tbGiolam").innerHTML = "";
  }

  return isValid;
}

// *** hàm kiểm tra xem input có rỗng hay không
function isRequired(value) {
  if (!value) {
    return false;
  }

  return true;
}

// *** Hàm kiểm tra input có đủ độ dài hay không
function minLength(value, limit) {
  if (value.length < limit) {
    return false;
  }

  return true;
}
