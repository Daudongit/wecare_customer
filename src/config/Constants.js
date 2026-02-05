import { Dimensions } from "react-native";

export const base_url = "enter_your_admin_link_here/";
export const paypal_url = "enter_your_admin_link_here/";
export const api_url = "enter_your_admin_link_here/api/";
export const img_url = "enter_your_admin_link_here/uploads/";
export const app_name = "wecare";
export const success_url = paypal_url+"paypal_success";
export const failed_url = paypal_url+"paypal_failed";
export const mpesa = "m_pesa/";

//Auth
export const customer_app_settings = "customer_app_setting";
export const customer_check_phone = "customer/check_phone";
export const customer_login = "customer/login";
export const customer_registration = "customer/register";
export const customer_forget_password = "customer/forget_password";
export const customer_reset_password = "customer/reset_password";

//Common
export const home = "customer/home";
export const get_payment_modes = "customer/get_payment_mode";
export const customer_add_address = "customer/add_address";
export const customer_update_address = "customer/update_address";
export const customer_get_address = "customer/all_addresses";
export const customer_edit_address = "customer/edit_address";
export const customer_delete_address = "customer/delete_address";
export const customer_last_active_address = "customer/get_last_active_address";
export const customer_get_faq = "get_faq";
export const customer_privacy_policy = "get_privacy_policy";
export const customer_get_profile = "customer/get_profile";
export const customer_profile_picture = "customer/profile_picture";
export const customer_profile_picture_update ="customer/profile_picture_update";
export const customer_profile_update = "customer/profile_update";
export const customer_get_blog = "customer/get_blog";
export const get_module_banners = "customer/get_module_banners";
export const customer_notification = "get_notifications";
export const e_prescription = "e_prescription_download/";


//Doctor
export const get_doctor_categories = "customer/get_doctor_categories";
export const get_online_doctors = "customer/get_online_doctors";
export const get_nearest_doctors = "customer/get_nearest_doctors";
export const create_booking = "customer/create_booking";
export const get_booking_requests = "customer/get_booking_requests";
export const create_consultation = "customer/create_consultation";
export const consultation_list = "customer/get_consultation_requests";
export const consultation_details = "customer/get_consultation_details";
export const doctor_rating = "customer/doctor_rating";
export const hospital_rating = "customer/hospital_rating";
export const check_consultation = "doctor/check_consultation";
export const continue_consultation = "doctor/continue_consultation";
export const time_slots = "customer/get_time_slots";
export const consultation_time_slots = "customer/get_consultation_time_slots"; 
export const start_call = "customer/start_call";
export const image_upload = "image_upload"; 
export const create_token="customer/create_token";
export const get_prescription = "doctor/get_prescription";
export const delete_account_request = "customer/delete_account";



//x-ray
export const customer_xray_list = "customer/get_xray_list";

//Size
export const screenHeight = Math.round(Dimensions.get("window").height);
export const screenWidth = Math.round(Dimensions.get("window").width);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);
export const height_17 = Math.round((17 / 100) * screenHeight);

//Path
export const login_image = require(".././assets/img/login_image.png");
export const confirmed_icon = require(".././assets/img/check.png");
export const rejected_icon = require(".././assets/img/cancel.png");
export const waiting_icon = require(".././assets/img/time-left.png");
export const doctor = require(".././assets/img/doctor.jpg");
export const white_logo = require(".././assets/img/white_logo.png");
export const logo_with_name = require(".././assets/img/logo_with_name.png");
export const online_consult = require(".././assets/img/online_consult.png");
export const tablet = require(".././assets/img/tablet.png");
export const clinic = require(".././assets/img/clinic.png");
export const discount = require(".././assets/img/discount.png");
export const background_img = require(".././assets/img/background_img.jpg");
export const clock = require(".././assets/img/clock.png");
export const location = require(".././assets/img/location.png");
export const theme_gradient = require(".././assets/img/theme_gradient.png");
export const promo_apply = require(".././assets/img/apply.png");
export const upload_path = require(".././assets/img/upload_icon.png");
export const add_reminder_icon = require(".././assets/img/add_reminder_icon.png");
export const today_reminder_icon = require(".././assets/img/today_reminder_icon.png");
export const my_reminder_icon = require(".././assets/img/my_reminder_icon.png");
export const login_entry_img = require(".././assets/img/login_entry_img.png");
export const chat_icon = require(".././assets/img/chat_icon.png"); 
// export const login = require(".././assets/img/login.png"); 
export const login = require(".././assets/img/doctorlogin.png"); 

export const nointernet  = require(".././assets/img/wifi.png"); 






//json path
export const confirm_remainder = require(".././assets/json/confirm_remainder.json");
export const payment_loader = require(".././assets/json/payment_loader.json"); 
export const my_orders = require(".././assets/json/myorders.json");

//Color Arrays
export const light_colors = [
  "#e6ffe6",
  "#f9f2ec",
  "#f9ecf2",
  "#ffe6ff",
  "#e6ffee",
  "#ffe6e6",
  "#ffffe6",
  "#ffe6e6",
  "#ffe6f9",
  "#ebfaeb",
  "#ffffe6",
  "#ffe6f0",
  "#fae6ff",
  "#e6ffe6",
  "#fff2e6",
  "#ffe6f0",
  "#e6ffee",
  "#a6abde",
];

//Lottie
export const location_enable = require(".././assets/json/locationenable.json");


//Font Family
export const regular = "GoogleSans-Medium";
export const bold = "GoogleSans-Bold";

//Map
export const REVERSE_GEOCODE = 'https://asia.routemappy.com/reverse?';
export const GOOGLE_KEY = "enter_your_map_key_here";
export const LATITUDE_DELTA = 0.015;
export const LONGITUDE_DELTA = 0.0152;
export const FLUTTERWAVE_KEY = "enter_your_flutteruake_key_here";
export const ROUTEMAPPY_KEY = "enter_your_routemappy_key_here";
//Util
export const month_name = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
