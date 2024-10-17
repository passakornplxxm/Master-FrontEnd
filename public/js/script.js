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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Response data: ", data);
        messageElement.innerText = data.message;
        
        document.getElementById('usernameDisplayTh').innerText = `Username TH: ${data.displayname_th}`;
        document.getElementById('usernameDisplayEn').innerText = `Username EN: ${data.displayname_en}`;
        document.getElementById('usernameDisplayStatus').innerText = `Status: ${data.tu_status}`;
        document.getElementById('usernameDisplayDepartment').innerText = `Department: ${data.department}`;
        credentialsDisplay.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.innerText = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';
    });
}

