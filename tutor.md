jalanin xampp/laragon/lainnya untuk akses server mysql.

buat database di mysql-nya

CREATE DATABASE user_service;
CREATE DATABASE payment_service;

untuk windows, run

1_install.bat -> ini untuk npm install semua services dan fe

setelah semua terinstall

run
2_setup-env.bat -> otomatis ngebuat .env di setiap services dan fe

terakhir run
3_start.bat -> npm run dev di semua services dan fe

LINK SWAGGER DOCS API
http://localhost:8001/api-docs/#/