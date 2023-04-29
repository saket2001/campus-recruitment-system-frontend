const validatorFunc = (toCheckArr) => {
  let errors = {};
  for (const [key, value] of Object.entries(toCheckArr)) {
    switch (key) {
      case "user_name":
      case "full_name":
        if (value === "") {
          errors.user_name = "Full name is required";
          errors.full_name = "Full name is required";
        } else if (value.length < 5) {
          errors.user_name = "Please enter your full name";
          errors.full_name = "Please enter your full name";
        }
        break;

      case "user_email":
      case "email":
        const hostType = value.split('@')[1];
        if (value === "") errors.user_email = "Email is required";
        if (hostType==='gmail.com' &&
          !/^[A-Z0-9._%+-]+@gmail.com/i.test(value)
        ) {
          errors.user_email = "Please enter a valid email";
          errors.email = "Please enter a valid email";
          return;
        }
        else if (hostType==='student.mes.ac.in' && !/^[A-Z0-9._%+-]+@student.mes.ac.in/i.test(value)) {
          errors.user_email = "Please enter a valid MES email";
          errors.email = "Please enter a valid MES email";
          return;
        }
        else if (hostType !== "student.mes.ac.in" && hostType !== "gmail.com") {
          errors.user_email = "Please enter a valid MES or gmail email id";
          errors.email = "Please enter a valid MES or gmail email id";
        }
        break;

      case "user_username":
        if (value === "") errors.user_username = "Username is required";
        else if (value.length < 8)
          errors.user_name = "Please enter your valid username";
        break;

      case "user_password":
        if (value === "") errors.user_password = "Password is required";
        else if (value.length < 8)
          errors.user_password = "Password minimum length needs to be 8";
        break;

      case "user_contact":
      case "contact":
        if (value === "") {
          errors.user_contact = "Contact number is required";
          errors.contact = "Contact number is required";
        } else if (!/^[0-9]{8}/i.test(value)) {
          errors.user_contact = "Please enter a valid contact number";
          errors.contact = "Please enter a valid contact number";
        }
        break;

      case "about":
        if (value === "") errors.about = "About is required";
        else if (value.length < 10)
          errors.user_contact = "Please enter some more about information";
        break;

      case "company":
        if (value === "") errors.company = "Company is required";
        else if (value.length < 6)
          errors.company = "Please enter valid length details";
        break;

      case "company_id":
        if (value === "") errors.company_id = "Company Id is required";
        else if (value.length < 6)
          errors.company_id = "Please enter valid length details";
        break;
    }
  }
  return errors;
};

export default validatorFunc;
