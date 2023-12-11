import { Dimensions } from "react-native";

export const base_url = "enter_admin_url/";
export const api_url = "enter_admin_url/api/";
export const img_url = "enter_admin_url/public/uploads/";

export const app_name = "Mr.Pharman";
export const delivery_boy_check_phone = "delivery_boy/check_phone";
export const delivery_boy_change_online_status ="delivery_boy/change_online_status";
export const delivery_boy_dashboard = "delivery_boy/dashboard";
export const delivery_boy_order_details = "delivery_boy/get_order_detail";
export const new_order_status = "delivery_boy/get_new_status";
export const status_change = "order_status_change";
export const delivery_boy_order_list = "delivery_boy/get_order_list";
export const accept = "deliveryboy/accept";
export const reject = "deliveryboy/reject";
export const delivery_boy_login = "delivery_boy/login";
export const delivery_boy_forget_password = "delivery_boy/forget_password";
export const delivery_boy_profile_update = "delivery_boy/profile_update";
export const delivery_boy_profile_picture = "delivery_boy/profile_picture";
export const delivery_boy_get_profile = "delivery_boy/get_profile";
export const delivery_boy_reset_password = "delivery_boy/reset_password";
export const app_settings = "delivery_boy_app_setting";
export const delivery_boy_privacy_policy = "get_privacy_policy";
export const delivery_boy_faq = "get_faq";
export const customer_get_blog = "customer/get_blog";
export const customer_notification = "get_notifications";
export const terms_and_conditions = "get_terms_and_conditions";

//Size
export const screenHeight = Math.round(Dimensions.get("window").height);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);
export const height_17 = Math.round((17 / 100) * screenHeight);

//Path
export const home_banner = require(".././assets/img/home_banner.png");
export const white_logo = require(".././assets/img/partner/white_logo.png");
export const medicine = require(".././assets/img/medicine.png");
export const login_image = require(".././assets/img/partner/login_image.png");
export const order_notification = require(".././assets/img/notification.png");
export const app_update = require('.././assets/json/app_update.json'); 

//Path
export const profile_img = require(".././assets/tmp/profile_img.png");

//Lottie

//Font Family
export const regular = "GoogleSans-Medium";
export const bold = "GoogleSans-Bold";

//Map
export const GOOGLE_KEY = "enter_map_key";
export const LATITUDE_DELTA = 0.015;
export const LONGITUDE_DELTA = 0.0152;
