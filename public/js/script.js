function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    const credentialsDisplay = document.getElementById('credentialsDisplay');
    
    console.log("Username: ", username);
    console.log("Password: ", password);
    
    if (!username || !password) {
        alert('กรุณาใส่ทั้งชื่อผู้ใช้และรหัสผ่าน');
        return;
    }
    
    const studentIdPattern = /^\d{10}$/;
    if (!studentIdPattern.test(username)) {
        alert('ชื่อผู้ใช้ต้องเป็น ID นักศึกษาจำนวน 10 หลัก');
        return;
    }
    
    const url = 'https://restapi.tu.ac.th/api/v1/auth/Ad/verify';
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TU98c64bc3ebfb23e1aeb386e311aaa4168551fb9baa885a20c3d76fa619122d23ea794cae30457ba6c882d05e85f87221'
        },
        body: JSON.stringify({ "UserName": username, "PassWord": password })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response data: ", data);
        messageElement.innerText = data.message;
        
        document.getElementById('usernameDisplayTh').innerText = `Username TH: ${data.displayname_th}`;
        document.getElementById('usernameDisplayEn').innerText = `Username EN: ${data.displayname_en}`;
        document.getElementById('usernameDisplayStatus').innerText = `Status: ${data.tu_status}`;
        document.getElementById('usernameDisplayDepartment').innerText = `Department: ${data.department}`;
        credentialsDisplay.style.display = 'block';
        
        if (data.status === true) {
            if (inputRole.value === "student") {
                fetchStudentProfile(data.username, password);
            } else {
                fetchInstructorProfile(data.email);
            }
        } else {
            alert("Login failed.");
            credentialsDisplay.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.innerText = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';
    });
}

function fetchStudentProfile(username, password) {
    const studentInfoUrl = `https://restapi.tu.ac.th/api/v2/profile/std/info/?id=${username}`;
    fetch(studentInfoUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Application-Key": `${API_KEY}`
        },
    })
    .then(res => res.json())
    .then(studentData => {
        if (studentData.status === true) {
            displayStudentProfile(studentData.data);
        } else {
            alert("Error: Unable to fetch student info.");
        }
    })
    .catch(e => {
        console.error(e);
        alert("Error: Unable to fetch student info.");
    });
}

function displayStudentProfile(student) {
    displayID.innerHTML = "";
    displayID.appendChild(createP(`ชื่อ: ${student.displayname_th}`));
    displayID.appendChild(createP(`รหัสนักศึกษา: ${student.username}`));
    displayID.appendChild(createP(`สาขา: ${student.department}`));
    displayID.appendChild(createP(`คณะ: ${student.faculty}`));

    document.querySelector(".login-container").classList.add("after-login");
    document.querySelector("#id-container").classList.add("visible");

    // Send student info to your backend
    fetch("http://localhost:8080/api/students/add", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "engName": student.displayname_en,
            "email": student.email,
            "faculty": student.faculty,
            "type": student.type,
            "userName": student.username,
            "password": password
        })
    });
}

function displayUsernameError(s) {
    console.log('username invalid');
    errorUsername.style.display = 'block';
    errorUsername.textContent = s;
}

function displayPasswordError(s) {
    console.log('password invalid');
    errorPassword.style.display = 'block';
    errorPassword.textContent = s;
}

checkEmptyUsername = function () {
    errorUsername.style.display = 'none';
    if (!inputUsername.value) {
        displayUsernameError("Your username can't be empty");
    }
}

checkEmptyPassword = function () {
    errorPassword.style.display = 'none';
    if (!inputPassword.value) {
        displayPasswordError("Your password can't be empty");
    }
}

checkEmptyRole = function () {
    if (inputRole.value === 'empty') {
    }
}

checkAll = function () {
    submitButton.disabled = false;
    if (!inputUsername.value || !inputPassword.value || inputRole.value === 'empty') {
        submitButton.disabled = true;
    }
}

submitButton.disabled = true;
loginForm.addEventListener("input", checkAll);
inputUsername.addEventListener("change", checkEmptyUsername);
inputPassword.addEventListener("change", checkEmptyPassword);
inputRole.addEventListener("input", checkEmptyRole);

document.querySelector("#show-password").addEventListener("change", function () {
    if (document.querySelector("#show-password").checked) {
        inputPassword.type = "text";
    } else {
        inputPassword.type = "password";
    }
});

submitButton.addEventListener("click", submitLogin);
