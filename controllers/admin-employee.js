const Employee = require('../models/employee'); 
var emailSender = require('../utils/emailSender')
var jwt = require('../utils/jwt')
var Account = require('../models/account')
var bcrypt = require('bcrypt')



exports.getAllEmployees = async function(req, res) {
  const page = parseInt(req.query.page) || 1;
  if(req.query.q){
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const employees = await Employee.find().populate('account');
    const searchInfo = req.query.q;
    const searchEmployee = employees.filter((element) => {
      return (
        removeAccents(element.fullName.toLowerCase()).includes(
          removeAccents(searchInfo.toLowerCase()))
      );
    });
    const searchProductsPag = searchEmployee.slice(skip, skip + limit);
    const totalProducts = searchEmployee.length;
    const totalPages = Math.ceil(totalProducts / limit);
    res.render('admin-employee', { 
      title: 'Employee List', 
      employees: searchProductsPag ,
      currentPage: page,
      totalPages: totalPages,
      totalCountEmployees: searchEmployee.length,
      limit: limit
    });
  }
  const limit = 10;
  const skip = (page - 1) * limit;
  const employees = await Employee.find().populate('account');
  const employeePagination = await Employee.find().populate('account').skip(skip).limit(limit);
  const totalEmployees = await Employee.countDocuments();
  const totalPages = Math.ceil(totalEmployees / limit);
  res.render('admin-employee', { 
    title: 'Employee List', 
    employees: employeePagination ,
    currentPage: page,
    totalPages: totalPages,
    totalCountEmployees: employees.length,
    limit: limit
  });
}

exports.unLockStatus = async function(req, res){
  const employeeId = req.body.id;
  console.log(employeeId);
  try {
    const employee = await Employee.findByIdAndUpdate(employeeId, {locked: false});
    return res.redirect('/admin/employee');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Lỗi server' });
  }
}

exports.lockStatus = async function(req, res){
  const employeeId = req.body.id;
  console.log(employeeId);
  try {
    const employee = await Employee.findByIdAndUpdate(employeeId, {locked: true});
    return res.redirect('/admin/employee');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Lỗi server' });
  }
}
async function seedInitialData() {
    try {
      const employeesData = [
        { fullName: 'John Doe', avatar: 'john.jpg', locked: false,activated:true },
        { fullName: 'Jane Smith', avatar: 'jane.jpg', locked: true,activated:true },
        // Add more employee data as needed
      ];
  
      const createdEmployees = await Employee.create(employeesData);
     
    } catch (error) {
      console.error('Error seeding initial data:', error);
      throw error;
    }
  }

exports.findEmployees = async function(req,res){
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const employees = await Employee.find().populate('account');
  const searchInfo = req.query.q;
  const searchEmployee = employees.filter((element) => {
    return (
      removeAccents(element.fullName.toLowerCase()).includes(
        removeAccents(searchInfo.toLowerCase()))
    );
  });
  const searchProductsPag = searchEmployee.slice(skip, skip + limit);
  const totalProducts = searchEmployee.length;
  const totalPages = Math.ceil(totalProducts / limit);
  res.render('admin-employee', { 
    title: 'Employee List', 
    employees: searchProductsPag ,
    currentPage: page,
    totalPages: totalPages,
    totalCountEmployees: searchEmployee.length,
    search: true,
    searchInfo: searchInfo,
    limit: limit
  });
}
  

  
exports.getAdd = function(req, res) {
  res.render('admin-employee-add', { title: 'Thêm nhân viên'})
}

exports.postAdd = async function(req, res) {
  const { fullName, gmail } = req.body;
  let gmailRegex = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g
  if (!gmailRegex.test(gmail)) { // test gmail
    req.flash("error", "Không đúng định dạng Gmail");
    return res.redirect("/admin/employee/add");
  }

  let exists = await Account.exists({email: gmail}).exec();
  if (exists) {
    req.flash("error", "Tài khoản gmail đã tồn tại.");
    return res.redirect("/admin/employee/add");
  }

  let username = gmail.substring(0, gmail.lastIndexOf("@")); // retrieve username from gmail
  let hash = await bcrypt.hash(username, 10)
  let account = await new Account({email: gmail, username: username, profileImg: 'img1.jpg', password: hash, role: 'employee'}).save()
  await new Employee({fullName: fullName, locked: false, avatar: 'img1.jpg', activated: false, account: account}).save();

  let sendMailStatus = sendActivationMail(gmail, username, fullName)
  if (sendMailStatus.success) 
    req.flash("success", sendMailStatus.message);
  else
    req.flash("error", sendMailStatus.message);
  return res.redirect("/admin/employee/add");
}

exports.resendActivationMail = async function(req, res) {
  const { gmail, username } = req.body;

  let account = await Account.findOne({username: username}).exec();
  let employee = await Employee.findOne({account: account}).populate('account').exec();
  if (!employee) {
    req.flash("error", "Gửi mail kích hoạt cho <b>" + username + "</b> thất bại !");
    return res.redirect("/admin/employee");
  }
  console.log(employee.fullName)
  let sendMailStatus = await sendActivationMail(gmail, username, employee.fullName);
  if (sendMailStatus.success) 
    req.flash("success", "Gửi mail kích hoạt cho <b>" + username + "</b> thành công !");
  else
    req.flash("error", "Gửi mail kích hoạt cho <b>" + username + "</b> thất bại !");
  return res.redirect("/admin/employee");
}

exports.getDetails = async function(req,res){
  const employeeId = req.params.id;
  const employee = await Employee.findById(employeeId).populate('account')
  .populate({
    path:'orders',
    populate: [
      { path: 'customer' },
      { path: 'orderItems', populate: 'product' }
    ]
  })
  .exec();
  
  res.render('admin-employee-detail',{title:'Employee Detail',employee:employee});
}

async function sendActivationMail (gmail, username, fullName) {
  let token = jwt.generateToken(username);
  console.log(fullName);
  const emailTemplate = ({ fullName, link }) => `
    <h2>Leafy xin chào ${fullName} !</h2>
    <p>Nhấn vào liên kết sau để đăng nhập vào website.</p>
    <p>${link}</p>
    <p><i>Lưu ý: Liên kết chỉ có hiệu lực trong vòng 1 phút</i></p>
  `
  const mailOptions = {
    from: "Leafy",
    html: emailTemplate({
      fullName,
      link: `http://localhost:3000/auth/login?token=${token}`,
    }),
    subject: "Leafy - Liên kết đăng nhập",
    to: gmail,
  };

  try {
      await emailSender.sendMail(mailOptions);
      return {success: true, message: "Gửi mail kích hoạt thành công"}
    }
  catch {
    return {success: false, message: "Gửi mail kích hoạt thất bại"}
  }
} 

